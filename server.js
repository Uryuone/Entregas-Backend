const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const fs = require('fs');

// Inicializa la aplicación de Express
const app = express();
const port = 8080;

// Crear el servidor HTTP
const httpServer = createServer(app);

// Inicializa Socket.io
const io = new Server(httpServer);

// Configurar Handlebars como el motor de plantillas
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Importar los enrutadores
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para la vista home
app.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  res.render('home', { products });
});

// Ruta para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  res.render('realTimeProducts', { products });
});

// Manejar conexiones de Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('newProduct', (product) => {
    const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
    products.push(product);
    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2), 'utf-8');
    io.emit('updateProducts', products);
  });

  socket.on('deleteProduct', (productId) => {
    let products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
    products = products.filter(p => p.id !== productId);
    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2), 'utf-8');
    io.emit('updateProducts', products);
  });
});

// Inicia el servidor
httpServer.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
