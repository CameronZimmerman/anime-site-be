require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const request = require('superagent');

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
          rating: '0',
          poster: 'Test',
          db_id: -1
      
        };
      
      const expectedFavorites = 
        [{
          ...newFavorite,
          id:2, 
          owner_id: 2
        }]
      ;
      

      const data = await fakeRequest(app)
        .post('/api/favorites')
        .send(newFavorite)
        .set('Authorization', token)
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
          rating: '0',
          poster: 'Test',
          db_id: -1,
          owner_id:2,
          id:2
      
        }
      ];
      

      const data = await fakeRequest(app)
        .get('/api/favorites')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('deletes favorite', async() => {

      const expected = [];
      

      await fakeRequest(app)
        .delete('/api/favorites/2')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      const data = await fakeRequest(app)
        .get('/api/favorites')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body).toEqual(expected);
    });
    test('creates favorite', async() => {

      const dbData = request.get('https://kitsu.io/api/edge/anime?filter[text]=bleach');
      const expected = dbData.body.data;
      

      const data = await fakeRequest(app)
        .get('/api/anime?search=bleach')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expected);
    });
  });
});
