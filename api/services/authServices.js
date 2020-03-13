const User = require('../models/user.model');
const config = require('../config/config');
var jwt = require('jsonwebtoken');
const ROLEs = config.ROLEs;

checkDuplicateUserNameOrEmail = async (req, res, next) => {
    console.log('from checkDuplicateUserNameOrEmail', req.body.email);
    const user = await User.findOne({ email: req.body.email }, { 'email': 1 });
    console.log('este es user', user)
    if (user) {
        res.status(400).json({ message: 'Email is already in use' })
        return;
    }
    next();
}
checkRoleExisted = (req, res, next) => {
    if (!req.body.role) {
        res.status(400).json({ message: 'The role field is required' });
        return;
    }
    if (!ROLEs.includes(req.body.role.toUpperCase())) {
        res.status(400).json({ message: `Does Not exist role ${req.body.role.toUpperCase()}` });
        return;
    }
    next();
}

verifyToken = async (req, res, next) => {
    console.log('resverifyToken', req.get('phonelicence'))
    let token = req.get('phonelicence')
    console.log('Token', token)
    await jwt.verify(token, process.env.SECRET_OR_KEY, (err, decoded) => {
        console.log('err', err)
        console.log('decoded', decoded)
        if (err) {
            res.status(401).json({ message: 'UnAutorized Token' })
            return
        }
        next();
    });
}
isAdmin = (req, res, next) => { }
isPmOrAdmin = (req, res, next) => { }

const authService = {};
authService.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
authService.checkRoleExisted = checkRoleExisted;
authService.verifyToken = verifyToken;
authService.isAdmin = isAdmin;
authService.isPmOrAdmin = isPmOrAdmin;

module.exports = authService;