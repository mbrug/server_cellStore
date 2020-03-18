var Brand = require('../models/brand.model')
var Model = require('../models/model.model')

addBrand = async (req, res) => {
    const model = new Model({
        name: 'maikel'
    })
    await model.save();

    const brand = new Brand({
        name: req.body.name,
        models: [model],
    });
    await brand.save()
    res.send({ message: 'brand created succesfully' });
}

listBrand = async (req, res) => {
    Brand.find().sort('-_id')
        .populate('models')
        .exec((err, brands) => {
            console.log("Populated User " + brands);
            if (err) {
                res.status(500).json({ message: "Error request" });
            } else {
                res.status(200).json({ brandResult: brands });
            }
        })
}

updateBrand = async (req, res) => {
    const brand = {
        name: req.body.name,
        models: req.body.models,
    };
    delete brand._id
    await Brand.update({ _id: req.body._id }, brand)
    res.send({ message: 'Brand updated succesfully' });
}

deleteBrand = async (req, res) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: 'Brand Deleted' });
}

const brandController = {};
brandController.listBrand = listBrand;
brandController.addBrand = addBrand;
brandController.updateBrand = updateBrand;
brandController.deleteBrand = deleteBrand;

module.exports = brandController;
