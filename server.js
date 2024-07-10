const express = require('express');
const app = express();
const port = 8080;

const productsRouter = require('./routes/products');

app.use(express.json());
app.use('/api/products', productsRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
