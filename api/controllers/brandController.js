var Brand = require('../models/brand.model')
var Model = require('../models/model.model')

listBrand = async (req, res) => {
    Brand.find().sort('-_id')
        .populate('models')
        .exec((err, brands) => {
            if (err) {
                res.status(500).json({ message: "Error request" });
            } else {
                res.status(200).json({ brandResult: brands });
            }
        })
}
addBrand = async (req, res) => {
    await Model.create(req.body.models, async (err, value) => {
        if (err) {
            res.status(500).json({ message: "Error request" });
        }
        const brand = new Brand({
            name: req.body.name,
            models: value,
        });
        await brand.save()
        res.send({ message: 'brand created succesfully' });
    });
}

updateBrand = async (req, res) => {
    let arrayNew = [];
    let arrayUpdat = [];
    let arrayDeleted = [];
    let newModel = [];
    req.body.models.forEach(element => {
        if (element.isDeleted) {
            arrayDeleted.push(element)
        } else if (element._id) {
            arrayUpdat.push(element)
        } else {
            arrayNew.push(element)
        }
    });

    if (arrayNew.length) {
        await Model.create(arrayNew, async (err, value) => {
            if (err) {
                res.status(500).json({ message: "Error request" });
            }
            newModel = [...value, ...arrayUpdat]
            const brand = {
                name: req.body.name,
                models: newModel,
            };
            delete brand._id
            await Brand.updateOne({ _id: req.body._id }, brand, (err, brand) => {
                if (err) {
                    res.status(500).json({ message: "Error request" });
                } else {
                    [...arrayUpdat, ...arrayDeleted].forEach(async (item) => {
                        if (item.isDeleted) {
                            await Model.findByIdAndDelete(item._id)
                        } else {
                            await Model.findByIdAndUpdate(item._id, item)
                        }
                    })
                }
            })
            res.send({ message: 'Brand updated succesfully' });
        });
    } else {
        const brand = {
            name: req.body.name,
            models: arrayUpdat,
        };
        delete brand._id
        await Brand.updateOne({ _id: req.body._id }, brand, (err, brand) => {
            if (err) {
                res.status(500).json({ message: "Error request" });
            } else {
                [...arrayUpdat, ...arrayDeleted].forEach(async (item) => {
                    if (item.isDeleted) {
                        await Model.findByIdAndDelete(item._id)
                    } else {
                        await Model.findByIdAndUpdate(item._id, item)
                    }
                })
            }
        })
        res.send({ message: 'Brand updated succesfully' });
    }
}

deleteBrand = async (req, res) => {
    // const brand = await Brand.findByIdAndDelete(req.params.id);
    await Brand.findByIdAndDelete(req.params.id, async (err, brand) => {
        if (err) {
            res.status(500).json({ message: "Error request" });
        } else {
            await Model.deleteMany({ _id: brand.models }, (err, deletedModels) => {
                if (err) {
                    res.status(500).json({ message: "Error request" });
                } else {
                    res.json({ message: 'Brand Deleted' });
                }
            })
        }
    });
}

const brandController = {};
brandController.listBrand = listBrand;
brandController.addBrand = addBrand;
brandController.updateBrand = updateBrand;
brandController.deleteBrand = deleteBrand;

module.exports = brandController;
