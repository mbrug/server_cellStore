var User = require('../models/user.model');
var { registerValidations, loginValidations } = require('../validations/registerValidations');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const mailer = require('./emailController');
const ROLEs = require('../config/config').ROLEs;



register = async (req, res) => {
    const { error } = registerValidations(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return
    }

    const user = new User({
        avatar: 'string',
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        role: ROLEs[0]
    });

    try {
        const savedUser = await user.save();
        let urlRequest = req.get('origin').split('//')
        console.log('origin', urlRequest)
        const urlConfirm = urlRequest[1] + '/auth/confirm-account/' + savedUser.emailConfirmed
        let mailOptions = {
            from: '"Phone Shop Team 👻"', // sender address
            to: savedUser.email, // list of receivers
            subject: 'Phone Shop ✔', // Subject line
            // text: 'Thanks for signing up with Phone Shop! You must follow this link to activate your account:', // plain text body
            html: '<p>Thanks for signing up with Phone Shop! You must follow this link to activate your account:</p><a href="http://' + urlConfirm + '">account</a>' // html body
        };

        mailer.sendMail(mailOptions)
            .then(async (response) => {
                res.send({ message: 'account created successfully', email: savedUser.email });
            })
            .catch(error => {
                res.status(400).send('we are problem communicating with your email');
            });
    } catch (error) {
        res.status(400).send(error);
    }
}
login = (req, res) => {
    User.findOne({ email: req.body.email }, 'email emailConfirmed password userName role')
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: 'User Not found' });
            }

            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send({ auth: false, accessToken: null, message: 'Invalid Password' });
            }

            var token = jwt.sign({ id: user._id, user: user.userName, role: user.role }, process.env.SECRET_OR_KEY, { expiresIn: 86400 });

            res.json({ accessToken: token, user: user.userName, role: user.role });
        })
        .catch(error => {
            res.status(500).send('we are problem communicating with DB');
        });
}

refreshToken = (req, res) => {
    User.findOne({ userName: req.body.user }, 'email emailConfirmed password userName role')
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: 'UserName Not found' });
            }
            var token = jwt.sign({ id: user._id }, process.env.SECRET_OR_KEY, { expiresIn: 86400 });
            res.status(200).send({ accessToken: token, user: user.userName, role: user.role });

        })
        .catch(error => {
            res.status(500).send('we are problem communicating with DB');
        })
}

confirmAccount = (req, res) => {
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

listUsers = (req, res) => {
    if (req.userData.role != 'admin') {
        res.status(401).json({ message: 'UnAutorized Token' })
        return
    } else {
        User.find()
            .then(usersList => {
                res.status(200).json({ usersList });
            })
            .catch(error => {
                res.status(500).send('we are problem communicating with DB');
            })
    }
}
UpdateUser = (req, res) => {
    res.send('fine')
}

DeleteUser = async (req, res) => {
    if (req.userData.role != 'admin') {
        res.status(401).json({ message: 'UnAutorized Token' })
        return
    } else {

        User.findByIdAndDelete(req.params.id, (err, user) => {
            if (err) {
                res.status(500).send('we are problem communicating with DB');
            } else {
                res.status(200).json({ message: 'User deleted succesfully' });
            }
        })
    }
}

const authController = {};
authController.register = register;
authController.login = login;
authController.confirmAccount = confirmAccount;
authController.refreshToken = refreshToken;

authController.listUsers = listUsers;
authController.UpdateUser = UpdateUser;
authController.DeleteUser = DeleteUser;

authController.isOwner = this.isOwner;
authController.isAdmin = this.isAdmin;
authController.isContador = this.isContador;
authController.isVisor = this.isVisor;


module.exports = authController;