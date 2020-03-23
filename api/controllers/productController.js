var Product = require('../models/product.model')
var Brand = require('../models/brand.model')
var User = require('../models/user.model');
const mailer = require('./emailController');


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
        //if paginate element
        // .sort('-_id').skip((page - 1) * perPage).limit(perPage)
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
        //if paginate element
        // .sort('-_id').skip((page - 1) * perPage).limit(perPage)
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

purchase = async (req, res) => {
    const listProduct = req.body.listProd;
    const total = req.body.total;
    const address = req.body.address;
    let listEmail = []
    listProduct.map((element) => {
        listEmail.push(element.owner)
    })
    record = await User.find().select('email').where('_id').in(listEmail).exec()

    record.forEach((item) => {
        let products = `<p>A user wants to buy the following list of products and expects to receive that at this address ${address}</p> </br> 
        <table> 
        <tr>
            <th>Cant</th>
            <th>Brand</th>
            <th>Model</th>
        </tr>`
        listProduct.forEach((element) => {
            if (element.owner == item._id) {
                products = products + `<tr>
                <td>${element.cant}</td>
                <td>${element.brand.name}</td>
                <td>${element.model.name}</td>
            </tr>`
            }
        })
        products = products + '<table>'

        try {
            // let urlRequest = req.get('origin').split('//')
            let mailOptions = {
                from: '"Phone Shop Team 👻"', // sender address
                to: item.email, // list of receivers
                subject: 'Notification Purchase ✔', // Subject line
                html: products // html body
            };

            mailer.sendMail(mailOptions)
                .then(async (response) => {
                    // res.send({ message: 'Purchase Order successfully', email: item.email });
                })
                .catch(error => {
                    // res.status(400).send('we have problem communicating with seller\'s email');
                });
        } catch (error) {
            // res.status(400).send(error);
        }

    })
    res.send({ message: 'Purchase Order successfully' });




}

const productController = {};
productController.addProduct = addProduct;
productController.listProduct = listProduct;
productController.listAllProduct = listAllProduct;
productController.updateProduct = updateProduct;
productController.dataLoadForm = dataLoadForm;
productController.deleteProduct = deleteProduct;
productController.purchase = purchase;

module.exports = productController;
