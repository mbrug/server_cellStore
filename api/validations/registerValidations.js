const Joi = require('@hapi/joi');

//Register Validation
const registerValidations = data => {
    const shemaValidations = Joi.object({
        userName: Joi.string().required(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        role: Joi.string(),
    });
    return shemaValidations.validate(data);
}
const loginValidations = data => {
    const shemaValidations = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
    });
    return shemaValidations.validate(data);
}

module.exports.registerValidations = registerValidations;
module.exports.loginValidations = loginValidations;