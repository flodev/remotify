import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthModule } from '../src/auth/auth.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  xit('/auth/temp-signup (POST)', (done) => {
    request(app.getHttpServer())
      .post('/auth/temp-signup')
      .send({
        type: 'temporary',
      })
      .expect(201)
      .end((err, res) => {
        console.log('err', err);
        console.log('res', res.body);
        expect(res.body.id).toBeDefined();
        expect(res.body.username).toBe('user1');
        done();
      });
  });
  xit('/auth/temp-signup (POST) invitation', (done) => {
    request(app.getHttpServer())
      .post('/auth/temp-signup')
      .send({
        type: 'invitation',
        inviteId: '9TN7QaqFOkW5neLRMozx3w==',
      })
      .expect(201)
      .end((err, res) => {
        console.log('err', err);
        console.log('res', res.body);
        expect(res.body.id).toBeDefined();
        expect(res.body.username).toBeDefined();
        done();
      });
  });
  it('/auth/refresh_token (POST) refresh token test', (done) => {
    request(app.getHttpServer())
      .post('/auth/refresh-token')
      .send({
        refreshToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzU1NzkwNTksImV4cCI6MTYzODE3MTA1OSwic3ViIjoiNWM4NzE5ZTQtMTkyYi00NTVhLWJmNmItZGI0YjMwNGZmYjFhIiwianRpIjoiMmU3MjYzMGQtN2EyZS00MWJhLWE2YWItMjQwZjQ4YzExYTYyIn0.RP7GMdqFbjK9xBx5LNDJkgTVZHTUmRrgzeVEP2zHktCE-jcocCsZZ-9feF_OrIH4c6-ZbAXGb4VWNXqCErsv-0KMYeyyU0f99zNTz9qeZG7KnJjjT1ol5ZT6x1lsYicb6uoSf9thwOmH24iFa8AeS-Y0EdUuauMUqqbU-VwgxM-dLJhfqW6DGPoL39pfI3rEjrasFkmKC1X07vgknk1ymCl9lLJoNHBLbGUCPm5PCtWz2FCNIqyVXIJo0bLQw2mUbuNM-rcJul3T-li0CmTxC5An-tz5rElS8AsW7Rk1bowpa6dHO1AiCe8-IWUnbhetcGzw7WkIckHutDRox8YzN2PMcfZGQsEu3QdgQAoX_ouPLGW9tAxZLUiHwpNHZTy5a4fQEj4oRzC30-Cv-fjMTxi0jlM8WXMvavfESkLu5NiaW0g3ebYEC7XtnbD5BOahK3o-HM9OTxwcaUQe6sDHib6Cvs8AVmdKKO-J8EZ6JIb3urpvB6bClV7160n_BblzAr-0JqNJ1fZfm2aNQoKsej6ME7qTw0S5aXc3C2y_oozb5g9anH-XwX8nH8c484e6yp8w3d5Kwxx4U7167Aaa-uh_TOT0OnqQk4TQJ6lTZ-PNd1bKlWLFF6w-wH7t-vZ5-ZO-3n6Q4XeotzZNl1qPs8-DsTMdfRRSRJIAqpKOHVw',
      })
      .expect(201)
      .end((err, res) => {
        console.log('err', err);
        console.log('res', res.body);
        expect(res.body.user).toBeDefined();
        expect(res.body.payload).toBeDefined();
        done();
      });
  });
});
