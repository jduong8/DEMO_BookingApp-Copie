const db = require('../db.js')
const User = db.user;

exports.findAll = (req, res) => {
    User.findAll().then(users => {
        res.send(users)
    })
}

exports.create = (req, res) => {
    const {
        firstname,
        lastname,
        email,
        phone,
        user_password
    } = req.body;

    User.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        user_password: user_password,
    }).then(user => {
        res.send(user)
    });
};


exports.update = (req, res) => {
    const userId = req.params.id
    User.update({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        user_password: req.body.user_password,
    }, {
        where: {
            id: userId
        }
    }).then(() => {
        res.status(200).send({
            message: `User updated for userId: ${userId}`
        });
    });
};

exports.delete = (req, res) => {
    const userId = req.params.id
    User.destroy({
        where: {
            id: userId
        }
    }).then(() => {
        res.status(200).send({
            message: `User deleted for userId: ${userId}`
        });
    });
};