require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db.js");
const User = db.User;
const nodemailer = require("nodemailer");
const USER_ROLE = require("../models/userRole.model.js");
const crypto = require("crypto");

class AuthenticationService {
  constructor() {
    this._transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.HOTMAIL_ADDRESS,
        pass: process.env.HOTMAIL_PASSWORD,
      },
    });
  }

  async createUser({ firstname, lastname, email, phone, password }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      role: USER_ROLE.CLIENT,
    });
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }; // Exclude the password
  }

  async valideUser(email, password) {
    const user = await User.findOne({ where: { email: email } });
    if (!user) throw new Error("User not found");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Invalid password");

    return user;
  }

  async generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });
  }

  async generatePasswordResetToken(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    // Generate a temporary password
    const temporaryPassword = crypto.randomBytes(8).toString("hex");
    const hashedTemporaryPassword = await bcrypt.hash(temporaryPassword, 10);

    // Update the user's password with the hashed temporary password
    user.password = hashedTemporaryPassword;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    return { user, temporaryPassword };
  }

  async sendResetPasswordEmail(user, temporaryPassword) {
    const mailOptions = {
      from: process.env.HOTMAIL_ADDRESS,
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      html: `<p>Bonjour,</p>
      <p>Votre mot de passe temporaire est: <strong>${temporaryPassword}</strong></p
      ><p>Veuillez utiliser ce mot de passe pour vous connecter et n'oubliez pas de le changer après vous être connecté.</p>`,
    };
    await this._transporter.sendMail(mailOptions);
  }

  async resetPassword(email) {
    const { user, temporaryPassword } =
      await this.generatePasswordResetToken(email);
    if (user) {
      await this.sendResetPasswordEmail(user, temporaryPassword);
    }
  }
}

module.exports = AuthenticationService;
