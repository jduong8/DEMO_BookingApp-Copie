require('dotenv').config();
const db = require('../db.js')
const User = db.user;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY;
const { use } = require('../app.js');

exports.findAll = (req, res) => {
    User.findAll().then(users => {
        res.send(users)
    })
}

exports.create = async (req, res) => {
    try {
        // Validation des données entrantes
        const { firstname, lastname, email, phone, user_password } = req.body;
        if (!firstname || !lastname || !email || !phone || !user_password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hashage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt);

        // Création de l'utilisateur
        const user = await User.create({
            firstname,
            lastname,
            email,
            phone,
            user_password: hashedPassword,
        });

        // Renvoyer l'utilisateur créé (sans le mot de passe)
        res.status(200).json({
            message: "User created",
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
};


exports.connect = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(400).send("Incorrect user or password");
        }

        const validPassword = await bcrypt.compare(req.body.user_password, user.user_password);
        
        if (!validPassword) {
            return res.status(400).send("Incorrect user or password");
        }

        const payload = {
            email: user.email
        }

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: 60 * 60 * 24 });
        res.json({ 
            message: "Connexion succeed",
            token: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
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