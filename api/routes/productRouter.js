var express = require('express');

module.exports = (function () {

    var productRoutes = express.Router();
    const productController = require('../controllers/productController');


    productRoutes.get('/', productController.listProduct);
    productRoutes.post('/', productController.addProduct);
    productRoutes.put('/', productController.updateProduct);
    productRoutes.delete('/:id', productController.deleteProduct);

    return productRoutes;

})();
