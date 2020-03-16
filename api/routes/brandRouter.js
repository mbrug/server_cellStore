var express = require('express');

module.exports = (function () {

    var brandRoutes = express.Router();
    const brandController = require('../controllers/brandController');


    brandRoutes.get('/', brandController.listBrand);
    brandRoutes.post('/', brandController.addBrand);
    brandRoutes.put('/', brandController.updateBrand);
    brandRoutes.delete('/:id', brandController.deleteBrand);

    return brandRoutes;

})();
