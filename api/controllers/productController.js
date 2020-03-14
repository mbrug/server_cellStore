var Product = require('../models/product.model')

addProduct = async (req, res) => {
    const imagePath = req.file ? '/uploads/' + req.file.filename : '';

    const prod = new Product({
        brand: req.body.brand,
        model: req.body.model,
        screen: req.body.screen,
        camera: req.body.camera,
        storage: req.body.storage,
        memory: req.body.memory,
        battery: req.body.battery,
        image: imagePath,
        dualSim: req.body.dualSim
    });
    console.log('addProduct', [req.body, req.file, imagePath])
    await prod.save()
    res.send({ message: 'product created succesfully' });
}

listProduct = async (req, res) => {
    var perPage = 4;
    var page = 1;
    var productResult = null;





    Product.find().sort('-_id').skip((page - 1) * perPage).limit(perPage)
        .then(product => {
            res.set('X-limit', perPage);
            res.set('X-page', page);
            productResult = product;
            return Product.count();
        })
        .then(result => {
            res.set('X-total', result);
            res.status(200).send({ productResult });
        })
        .catch((err) => {
            res.status(500).send({ message: "Error en la petición" });
        });
}

updateProduct = async (req, res) => {
    res.send('update product');
}

deleteProduct = async (req, res) => {
    const prod = await Product.findByIdAndDelete(req.params.id);
    console.log('eliminado->', prod)
    res.json({ message: 'product Deleted' });
}

const productController = {};
productController.addProduct = addProduct;
productController.listProduct = listProduct;
productController.updateProduct = updateProduct;
productController.deleteProduct = deleteProduct;

module.exports = productController;
