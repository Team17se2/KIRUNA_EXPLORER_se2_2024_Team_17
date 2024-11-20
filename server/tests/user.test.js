import request from 'supertest'; // Import supertest for testing HTTP requests
import {app,server} from '../index.js';
require('dotenv').config();
describe('User API', () => {
    // Test for login
    it('should login successfully with valid credentials', async () => {
        const response = await request(app)
            .post('/api/sessions')
            .send({ username: 'mario@test.it', password: process.env.TEST_USER_PASSWORD });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('email', 'mario@test.it');
        expect(response.body).toHaveProperty('name', 'Mario');
        expect(response.body).toHaveProperty('surname', 'Test');
        expect(response.body).toHaveProperty('role', 'Urban Planner');
    });

    it('should fail login with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/sessions')
            .send({ username: 'invalidUser', password: 'invalidPassword' });
        expect(response.status).toBe(401);
    });

    // Test for logout
    it('should logout successfully', async () => {
        const agent = request.agent(app);
        await agent
            .post('/api/sessions')
            .send({ username: 'mario@test.it', password: 'pwd' });

        const response = await agent.delete('/api/sessions/current');
        expect(response.status).toBe(200);
    });

    // Test for checking current session
    it('should return the current user if authenticated', async () => {
        const agent = request.agent(app);
        await agent
            .post('/api/sessions')
            .send({ username: 'mario@test.it', password: 'pwd' });

        const response = await agent.get('/api/sessions/current');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('email', 'mario@test.it');
        expect(response.body).toHaveProperty('name', 'Mario');
        expect(response.body).toHaveProperty('surname', 'Test');
        expect(response.body).toHaveProperty('role', 'Urban Planner');
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app).get('/api/sessions/current');
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Unauthenticated user!');
    });
});