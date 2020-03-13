var Product = require('../models/product.model')

addProduct = async (req, res) => {
    const prod = new Product({
        brand: req.body.brand,
        model: req.body.model,
        screen: req.body.screen,
        camera: req.body.camera,
        storage: req.body.storage,
        memory: req.body.memory,
        battery: req.body.battery,
        image: req.body.image,
        dualSim: req.body.dualSim
    });
    await prod.save()
    res.send({ message: 'product created succesfully' });
}

listProduct = async (req, res) => {
    const prod = await Product.find().sort('-_id');
    res.json(prod);
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
