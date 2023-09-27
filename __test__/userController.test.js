const request = require('supertest');
const app = require('../app');
const db = require('../db.js');
const User = db.user;


describe('User Controller', () => {
  beforeAll(async () => {
    await User.sync({ force: true });
  }); 
  test('should create a new user', async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      user_password: "password",
      // user_role: "client"
    };
    
    const response = await request(app)
      .post('/api/signup')
      .send(newUser);
      
    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe(newUser.email);
 
    const user = await User.findOne({ where: { email: newUser.email } });
    expect(user).not.toBeNull();
  });

  test('should not create a new user with invalid email', async () => {
    const invalidUser = {
      firstname: "John",
      lastname: "Doe",
      email: "invalid-email", // Invalid email address
      phone: "1234567890",
      user_password: "password",
      // user_role: "client"
    };
  
    const response = await request(app)
      .post('/api/signup')
      .send(invalidUser);
  
    expect(response.statusCode).toBe(422);
  
    // Vérifie que l'utilisateur n'a pas été créé
    const user = await User.findOne({ where: { email: invalidUser.email } });
    expect(user).toBeNull();
  });
  
});
