const UserService = require("../services/user.service");

class RoleService {
  constructor() {
    this.userService = new UserService();
  }
  async updateRole(userId, newRole) {
    const user = await this.userService.getUserById(userId);

    await user.update({ role: newRole });
    return user;
  }
}

module.exports = RoleService;
