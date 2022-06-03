const { Router } = require('express');
const productControllers = require('../controllers/productControllers');
const productRouter = Router();

productRouter.get('/products', productControllers.get_products);
productRouter.get('/product/:Product_name', productControllers.get_product);
productRouter.post('/products/add', productControllers.post_product);
productRouter.put('/products/update/:id', productControllers.update_product);
productRouter.delete('/products/delete/:id', productControllers.delete_product);

module.exports = productRouter;