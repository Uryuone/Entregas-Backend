const express = require('express');
const { create } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');

const app = express();
const port = 8080;

// Configurar Handlebars
const hbs = create({ extname: '.handlebars' });
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', './views');

// Configurar el servidor HTTP y Socket.io
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use('/api/products', productsRouter(io)); // Pasar io a las rutas de productos
app.use('/api/carts', cartRouter(io)); // Pasar io a las rutas de carritos (si es necesario)

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/', (req, res) => {
  res.render('home', { products: getProducts() });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products: getProducts() });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Función para obtener productos (simulación)
function getProducts() {
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  return products;
}
