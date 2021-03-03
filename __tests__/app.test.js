require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });


    test('creates favorite', async() => {

      const newFavorite =
        {
          title: 'Test',
          episodes: 1, 
          status: 'Test',
          synopsis: 'Test',
          rating: 100.00,
          poster: 'Test',
          db_id: -1
      
        };
      
      const expectedFavorites = [
        {
          ...newFavorite,
          id:2, 
          owner_id: 2
        }
      ];
      

      const data = await fakeRequest(app)
        .post('/favorites')
        .send(newFavorite)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectedFavorites);
    });
    test('returns favorites', async() => {

      const expectation = [
        {
          title: 'Test',
          episodes: 1, 
          status: 'Test',
          synopsis: 'Test',
          rating: 100.00,
          poster: 'Test',
          db_id: -1,
          ownder_id:2,
          id:2
      
        }
      ];
      

      const data = await fakeRequest(app)
        .get('/favorites')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
