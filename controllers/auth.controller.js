require("dotenv").config();
const db = require("../db.js");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;
const HOTMAIL_ADDRESS = process.env.HOTMAIL_ADDRESS;
const HOTMAIL_PASSWORD = process.env.HOTMAIL_PASSWORD;
const validator = require("validator");
const nodemailer = require("nodemailer");
const USER_ROLE = require("../models/userRole.model.js");

exports.createAccount = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, user_password } = req.body;

    // Hashage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_password, salt);

    // Création de l'utilisateur avec le rôle CLIENT par défaut
    const user = await User.create({
      firstname,
      lastname,
      email,
      phone,
      user_password: hashedPassword,
      user_role: USER_ROLE.CLIENT,
    });

    // Renvoyer l'utilisateur créé (sans le mot de passe)
    res.status(201).json({
      message: "User created",
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        user_role: user.user_role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

exports.connect = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect user or password",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.user_password,
      user.user_password,
    );
    if (!validPassword) {
      return res.status(400).json({
        message: "Incorrect user or password",
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      user_role: user.user_role,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: 60 * 60 * 24 });
    res.json({
      message: "Connexion succeed",
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Génération d'un token de réinitialisation
    const resetToken = await bcrypt.genSalt(20);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    // Envoyer l'email ici
    const link = `http://localhost:3000/forget-password/${resetToken}`;
    await sendResetPasswordEmail(user, link);

    res.status(200).json({ message: "Email sent for password reset" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in password reset process" });
  }
};

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: `${HOTMAIL_ADDRESS}`,
    pass: `${HOTMAIL_PASSWORD}`,
  },
});

// Fonction pour envoyer l'email
const sendResetPasswordEmail = async (user, resetUrl) => {
  const mailOptions = {
    from: HOTMAIL_ADDRESS,
    to: user.email,
    subject: "Réinitialisation de mot de passe",
    html: `<p>Bonjour,</p><p>Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe:</p><a href="${resetUrl}">${resetUrl}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de réinitialisation envoyé.");
  } catch (error) {
    console.error("Erreur lors de l’envoi de l’email: ", error);
  }
};
