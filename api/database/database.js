var mongoose = require('mongoose');

//mongodb+srv://michael:<M1ch43l.c0m>@cluster0-eeqp8.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false })
    .then(response => {
        console.log('Database connected success');
    })
    .catch(error => {
        console.log('Error Database connection')
    });