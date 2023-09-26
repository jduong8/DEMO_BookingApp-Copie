const request = require('supertest');
const app = require('../app.js');

describe('GET /api/reservations', () => {
    // Testez le cas non authentifié
    it('should return a 401 error if user is not authenticated', async () => {
        const res = await request(app)
        .get('/api/reservations')
        .expect('Content-Type', /json/)
        .expect(401);
    });
});