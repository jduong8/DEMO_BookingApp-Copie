require('dotenv').config();
const db = require('../db.js')
const User = db.user;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY;

exports.findAll = (req, res) => {
    User.findAll().then(users => {
        res.send(users)
    })
}

exports.addSuperAdmin = async (req, res) => {
    try {
        // Valider les données reçues
        const { firstname, lastname, email, phone, user_password } = req.body;
        if (!firstname || !lastname || !email || !phone || !user_password) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        // Hashage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt);

        // Création du super_admin
        const superAdmin = await User.create({
            user_role: 'super_admin', // Définir le rôle à super_admin
            firstname,
            lastname,
            email,
            phone,
            user_password: hashedPassword,
        });

        // Générer un token JWT
        const payload = {
            id: superAdmin.id,
            email: superAdmin.email,
            user_role: superAdmin.user_role,
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: 60 * 60 * 24 });

        // Renvoyer le super_admin créé (sans le mot de passe) et le token
        res.status(200).json({
            message: "SuperAdmin créé",
            user: {
                id: superAdmin.id,
                firstname: superAdmin.firstname,
                lastname: superAdmin.lastname,
                email: superAdmin.email,
                phone: superAdmin.phone,
                user_role: superAdmin.user_role,
            },
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création du superAdmin" });
    }
};

exports.create = async (req, res) => {
    try {
        // Validation des données entrantes
        const { firstname, lastname, email, phone, user_password, user_role } = req.body;
        if (!firstname || !lastname || !email || !phone || !user_password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Vérification du rôle de l'utilisateur actuel s'il souhaite assigner un rôle spécifique
        if (user_role) {
            const currentUserRole = req.user ? req.user.role : 'client'; // Supposons que vous ayez le rôle de l'utilisateur actuel dans req.user

            if (user_role === 'admin' && currentUserRole !== 'super_admin') {
                return res.status(403).json({ message: "Only a Super Admin can assign the Admin role" });
            }
        }

        // Si un rôle n'est pas spécifié ou si l'utilisateur n'a pas les droits pour assigner un rôle, assigner le rôle 'client' par défaut
        const assignedRole = user_role && currentUserRole === 'super_admin' ? user_role : 'client';

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
            user_role: assignedRole,
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
                user_role: user.user_role,
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
            id: user.id,
            email: user.email,
            user_role: user.user_role
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


exports.update = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const currentUser = req.user;
    
    // Vérifier si currentUser est défini
    if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userToUpdate = await User.findByPk(userId);
    if (!userToUpdate) return res.status(404).json({ message: "User not found" });

    if (currentUser.id !== userToUpdate.id) {
        return res.status(403).json({ message: "Cannot update: Permission denied" });
    }

    const updatedData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
    };
    
    if (currentUser.user_role === 'super_admin' && req.body.user_role) {
        updatedData.user_role = req.body.user_role; // Seul un super_admin peut changer le rôle
    } else if (req.body.user_role) {
        // Si un utilisateur non super_admin tente de changer le rôle, on renvoie une erreur
        return res.status(403).json({ message: "Cannot change role: Permission denied" });
    }

    User.update(updatedData, {
        where: {
            id: userId
        }
    }).then(() => {
        res.status(200).send({
            message: `User updated for userId: ${userId}`
        });
    });
};


exports.delete = async (req, res) => {
    const userId = req.params.id;
    const currentUser = req.user;

    const userToDelete = await User.findByPk(userId);
    if (!userToDelete) return res.status(404).json({ message: "User not found" });

    if (currentUser.id !== userToDelete.id && currentUser.user_role !== 'admin' && currentUser.user_role !== 'super_admin') {
        return res.status(403).json({ message: "Permission denied" });
    }

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
