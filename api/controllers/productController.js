var Product = require('../models/product.model')
var Brand = require('../models/brand.model')

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
        dualSim: req.body.dualSim,
        price: req.body.price,
        owner: req.userData.id
    });
    await prod.save()
    res.send({ message: 'product created succesfully' });
}

listProduct = async (req, res) => {
    var perPage = 4;
    var page = 1;
    var productResult = null;

    Product.find({ owner: req.userData.id })
        .sort('-_id').skip((page - 1) * perPage).limit(perPage)
        .populate('brand')
        .populate('model')
        .exec((err, product) => {
            if (err) {
                res.status(500).send({ message: "Error en la petición" });

            } else {
                res.set('X-limit', perPage);
                res.set('X-page', page);
                productResult = product;
                // return Product.count();
                // res.set('X-total', result);
                res.status(200).send({ productResult });
            }
        })

}
listAllProduct = async (req, res) => {
    var brandFilter = req.params.brand

    const brand = await Brand.findOne({ name: brandFilter })

    var query = {}
    if (brandFilter) {
        query = { brand: brand._id }
    }

    var perPage = 4;
    var page = 1;
    var productResult = [];

    Product.find(query)
        .sort('-_id').skip((page - 1) * perPage).limit(perPage)
        .populate('brand')
        .populate('model')
        .exec((err, product) => {
            if (err) {
                res.status(500).send({ message: "Error en la petición" });

            } else {
                res.set('X-limit', perPage);
                res.set('X-page', page);
                productResult = product;
                // return Product.count();
                // res.set('X-total', result);
                res.status(200).send({ productResult });
            }
        })
}

dataLoadForm = async (req, res) => {
    const productID = req.params.id;
    Product.findOne({ _id: productID }, (err, product) => {
        if (err) {
            res.status(500).send({ message: "Error en la petición" });
        } else {
            res.status(200).send({ product });
        }
    })
}

updateProduct = async (req, res) => {
    const imagePath = req.file ? '/uploads/' + req.file.filename : '';

    const prod = {
        brand: req.body.brand,
        model: req.body.model,
        screen: req.body.screen,
        camera: req.body.camera,
        storage: req.body.storage,
        memory: req.body.memory,
        battery: req.body.battery,
        image: imagePath,
        dualSim: req.body.dualSim,
        price: req.body.price
    };
    let arrayKeys = Object.keys(prod)
    arrayKeys.forEach((element) => {
        if (prod[element]) {

        } else {
            delete prod[element]
        }
    })
    await Product.update({ _id: req.body._id }, prod)
    res.send({ message: 'product updated succesfully' });
}

deleteProduct = async (req, res) => {
    const prod = await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'product Deleted' });
}

const productController = {};
productController.addProduct = addProduct;
productController.listProduct = listProduct;
productController.listAllProduct = listAllProduct;
productController.updateProduct = updateProduct;
productController.dataLoadForm = dataLoadForm;
productController.deleteProduct = deleteProduct;

module.exports = productController;
