/*const request = require('supertest')
const app = require('../server')


describe('Routes to GET all elements Json with authorization', () => {  
    let cookie: string | null = null; 
    beforeAll(async () => {    
        const loginRes = await request(app).post('/login').send({
            email: 'kdeveral0@nifty.com',
            password: '1',      
        });    
        if (loginRes.headers['set-cookie']) 
        {
            cookie = loginRes.headers['set-cookie'];
        } else 
        {
            throw new Error('No se recibió la cookie de autenticación');
        } 
    expect(loginRes.statusCode).toEqual(201)
    expect(loginRes.body).toHaveProperty('post')
  })
})*/

import request from 'supertest';
import { app } from '../app';
import { initializeDatabase } from '../mongodb/start';

describe('Protected Endpoints', () => {
    let cookie: string;

    beforeAll(async () => {
        await initializeDatabase();

        const response = await request(app)
            .post('/login')
            .send({ name: 'demilv', password: 'Pass123' });

        cookie = response.headers['set-cookie'][0].split(';')[0];
    });

    it('should access rooms endpoint with valid cookie', async () => {
        const response = await request(app)
            .get('/rooms')
            .set('Cookie', cookie);

        console.log('Response body:', response.body);
        console.log('Response status:', response.status);

        expect(response.status).toBe(200);
    });

    it('should fail to access rooms endpoint without cookie', async () => {
        const response = await request(app).get('/rooms');
        expect(response.status).toBe(401);
    });

    it('should access /rooms/1 endpoint with valid cookie', async () => {
        const response = await request(app)
            .get('/rooms/1')
            .set('Cookie', cookie);

        console.log('Response body:', response.body);
        console.log('Response status:', response.status);

        expect(response.status).toBe(200);
    });

    it('should fail to access /rooms/1 endpoint without cookie', async () => {
        const response = await request(app).get('/rooms/1');
        expect(response.status).toBe(401);
    });

    it('should access users endpoint with valid cookie', async () => {
        const response = await request(app)
            .get('/users')
            .set('Cookie', cookie);

        console.log('Response body:', response.body);
        console.log('Response status:', response.status);

        expect(response.status).toBe(200);
    });

    it('should fail to access users endpoint without cookie', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(401);
    });

    it('should access /users/1 endpoint with valid cookie', async () => {
        const response = await request(app)
            .get('/users/1')
            .set('Cookie', cookie);

        console.log('Response body:', response.body);
        console.log('Response status:', response.status);

        expect(response.status).toBe(200);
    });

    it('should fail to access /users/1 endpoint without cookie', async () => {
        const response = await request(app).get('/users/1');
        expect(response.status).toBe(401);
    });

    it('should access reviews endpoint with valid cookie', async () => {
        const response = await request(app)
            .get('/reviews')
            .set('Cookie', cookie);

        console.log('Response body:', response.body);
        console.log('Response status:', response.status);

        expect(response.status).toBe(200);
    });

    it('should fail to access reviews endpoint without cookie', async () => {
        const response = await request(app).get('/reviews');
        expect(response.status).toBe(401);
    });

    it('should access /reviews/1 endpoint with valid cookie', async () => {
        const response = await request(app)
            .get('/reviews/1')
            .set('Cookie', cookie);

        console.log('Response body:', response.body);
        console.log('Response status:', response.status);

        expect(response.status).toBe(200);
    });

    it('should fail to access /reviews/1 endpoint without cookie', async () => {
        const response = await request(app).get('/reviews/1');
        expect(response.status).toBe(401);
    });

    it('should access bookings endpoint with valid cookie', async () => {
        const response = await request(app)
            .get('/bookings')
            .set('Cookie', cookie);

        console.log('Response body:', response.body);
        console.log('Response status:', response.status);

        expect(response.status).toBe(200);
    });

    it('should fail to access bookings endpoint without cookie', async () => {
        const response = await request(app).get('/bookings');
        expect(response.status).toBe(401);
    });

    it('should access /bookings/1 endpoint with valid cookie', async () => {
        const response = await request(app)
            .get('/bookings/1')
            .set('Cookie', cookie);

        console.log('Response body:', response.body);
        console.log('Response status:', response.status);

        expect(response.status).toBe(200);
    });

    it('should fail to access /bookings/1 endpoint without cookie', async () => {
        const response = await request(app).get('/bookings/1');
        expect(response.status).toBe(401);
    });
});



/*
describe('Database Seeding and Authentication Tests', () => {
    let cookie: string;
  
    beforeAll(async () => {
      await run();
    });
  
    it('should login with correct credentials and return a cookie', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: loginUser.name, password: loginUser.pass });
      
      expect(response.status).toBe(302);
      expect(response.headers['set-cookie']).toBeDefined();
      
      cookie = response.headers['set-cookie'];
    });
  
    it('should fail to login with incorrect credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: loginUser.name, password: 'wrongpassword' });
      
      expect(response.status).toBe(401);
    });
  
    it('should access rooms endpoint with valid cookie', async () => {
      const response = await request(app)
        .get('/rooms')
        .set('Cookie', cookie);
  
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined(); 
    });
  
    it('should fail to access rooms endpoint without cookie', async () => {
      const response = await request(app).get('/rooms');
      expect(response.status).toBe(401);
    });
  
    it('should access users endpoint with valid cookie', async () => {
      const response = await request(app)
        .get('/users')
        .set('Cookie', cookie);
  
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  
    it('should fail to access users endpoint without cookie', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(401);
    });  
  });

  */