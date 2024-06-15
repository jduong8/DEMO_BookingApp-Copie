const { Op } = require("sequelize");
const db = require("../db.js");
const User = db.User;
const bcrypt = require("bcrypt");
const USER_ROLE = require("../models/userRole.model.js");

class UserService {
  async getAllUsers(role, userId) {
    let whereCondition = {};
    switch (role) {
      case USER_ROLE.ADMIN:
        whereCondition.role = USER_ROLE.CLIENT;
        break;
      case USER_ROLE.MASTER:
        whereCondition.role = {
          [Op.in]: [USER_ROLE.ADMIN, USER_ROLE.CLIENT],
        };
        whereCondition.id = { [Op.ne]: userId };
        break;
      case USER_ROLE.CLIENT:
        throw new Error("Access denied");
    }

    return await User.findAll({
      where: whereCondition,
      attributes: { exclude: ["password"] },
    });
  }

  async getUserById(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUserInfo(userId, updatedData) {
    const user = await this.getUserById(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = await user.update(updatedData, {
      where: { id: userId },
    });
    return updatedUser;
  }

  async deleteUser(userId) {
    return await User.destroy({
      where: {
        id: userId,
      },
    });
  }

  async updatePassword(userId, oldPassword, newPassword) {
    const user = await this.getUserById(userId);
    if (!user) throw new Error("User not found");

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) throw new Error("Incorrect old password");

    if (!newPassword || newPassword.trim().length < 8)
      throw new Error("New password must be at least 8 characters long");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await this.updateUserInfo(userId, user);
  }
}

module.exports = UserService;
