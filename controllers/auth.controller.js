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

exports.create = async (req, res) => {
  try {
    // Validation des données entrantes
    const { firstname, lastname, email, phone, user_password, user_role } =
      req.body;
    if (!firstname || !lastname || !email || !phone || !user_password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let currentUserRole;
    // Vérification du rôle de l'utilisateur actuel s'il souhaite assigner un rôle spécifique
    if (user_role) {
      currentUserRole = req.user ? req.user.role : "client"; // Supposons que vous ayez le rôle de l'utilisateur actuel dans req.user
      if (user_role === "admin" && currentUserRole !== "super_admin") {
        return res
          .status(403)
          .json({ message: "Only a Super Admin can assign the Admin role" });
      }
    }
    // Si un rôle n'est pas spécifié ou si l'utilisateur n'a pas les droits pour assigner un rôle, assigner le rôle 'client' par défaut
    const assignedRole =
      user_role && currentUserRole === "super_admin" ? user_role : "client";
    // Hashage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_password, salt);
    const validations = {
      firstname: "string",
      lastname: "string",
      email: "string",
      phone: "string",
      user_password: "string",
    };

    for (const [key, type] of Object.entries(validations)) {
      if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ message: "Email invalide" });
      } else if (typeof req.body[key] !== type) {
        return res.status(422).json({ error: `${key} must be a ${type}` });
      }
    }
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
      return res.status(400).send("Incorrect user or password");
    }

    const validPassword = await bcrypt.compare(
      req.body.user_password,
      user.user_password,
    );
    if (!validPassword) {
      return res.status(400).send("Incorrect user or password");
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
    // text: `Bonjour, veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe: ${resetUrl}`,
    html: `<p>Bonjour,</p><p>Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe:</p><a href="${resetUrl}">${resetUrl}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de réinitialisation envoyé.");
  } catch (error) {
    console.error("Erreur lors de l’envoi de l’email: ", error);
  }
};
