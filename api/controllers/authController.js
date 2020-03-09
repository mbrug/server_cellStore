var User = require('../models/user.model');
var { registerValidations, loginValidations } = require('../validations/registerValidations');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const mailer = require('./emailController');


register = async (req, res) => {
    const { error } = registerValidations(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return
    }

    const user = new User({
        avatar: 'string',
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });
    try {
        const savedUser = await user.save();
        const urlConfirm = req.get('origin') + '/auth/confirm-account/' + savedUser.emailConfirmed
        let mailOptions = {
            from: '"Phone Shop Team 👻"', // sender address
            to: savedUser.email, // list of receivers
            subject: 'Phone Shop ✔', // Subject line
            // text: 'Thanks for signing up with Phone Shop! You must follow this link to activate your account:', // plain text body
            html: '<p>Thanks for signing up with Phone Shop! You must follow this link to activate your account:</p><a href="http://' + urlConfirm + '">account</a>' // html body
        };
        console.log('mailOptions', [mailOptions, urlConfirm])

        mailer.sendMail(mailOptions)
            .then(async (response) => {
                console.log('si se envio el correo', response);
                res.send({ message: 'account created successfully', email: savedUser.email });
            })
            .catch(error => {
                res.status(400).send('we are problem communicating with your email');
                console.log('no se envio el correo', error)
            });
    } catch (error) {
        res.status(400).send(error);
    }
}
login = (req, res) => {
    User.findOne({ email: req.body.email }, 'email emailConfirmed password')
        .then(user => {
            if (!user) {
                return res.status(404).send('User Not found');
            }

            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            console.log('password Compar', [passwordIsValid, user.password, req.body.password, process.env.MAIL_HOST]);
            if (!passwordIsValid) {
                return res.status(401).send({ auth: false, accessToken: null, reason: 'Invalid Password' });
            }

            var token = jwt.sign({ id: user._id }, process.env.SECRET_OR_KEY, { expiresIn: 86400 });

            res.status(200).send({ auth: true, accessToken: token, user: user });

            console.log('user authenticate', user);
        })
        .catch(error => {
            res.status(500).send('we are problem communicating with your email');
            console.log('no se envio el correo', error)
        });
}

confirmAccount = (req, res) => {
    console.log('object', req.body)
    User.updateOne({ emailConfirmed: req.body.idConfirm }, { $set: { emailConfirmed: '' } })
        .then(user => {
            if (!user.nModified) {
                return res.status(404).send('User Not found');
            }
            res.send({ message: 'account successfully activated' });
        })
        .catch(error => {
            res.status(500).send('we are problem communicating with DB');
        });
}

isOwner = (req, res) => {
    User.findOne({ _id: req.body.id }, 'email')
        .then(user => {
            res.status(200).json({ 'description': 'user is Owner', 'user': user });
        })
        .catch(error => {
            res.status(500).json({ 'description': 'user is not Owner', 'error': error });
        })
}
isAdmin = (req, res) => {
    User.findOne({ _id: req.body.id }, 'email')
        .then(user => {
            res.status(200).json({ 'description': 'user is admin', 'user': user });
        })
        .catch(error => {
            res.status(500).json({ 'description': 'user is not admin', 'error': error });
        })
}
isContador = (req, res) => {
    User.findOne({ _id: req.body.id }, 'email')
        .then(user => {
            res.status(200).json({ 'description': 'user is contador', 'user': user });
        })
        .catch(error => {
            res.status(500).json({ 'description': 'user is not contador', 'error': error });
        })
}
isVisor = (req, res) => {
    User.findOne({ _id: req.body.id }, 'email')
        .then(user => {
            res.status(200).json({ 'description': 'user is visor', 'user': user });
        })
        .catch(error => {
            res.status(500).json({ 'description': 'user is not visor', 'error': error });
        })
}

const authController = {};
authController.register = register;
authController.login = login;
authController.confirmAccount = confirmAccount;

authController.isOwner = this.isOwner;
authController.isAdmin = this.isAdmin;
authController.isContador = this.isContador;
authController.isVisor = this.isVisor;


module.exports = authController;