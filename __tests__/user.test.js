import request from 'supertest';
import faker from 'faker';
import matchers from 'jest-supertest-matchers';

import { User } from '../src-backend/models';
import app from '../src-backend';
import initDb from '../src-backend/initDb';

const dataTestForm = {
  email: faker.internet.email().toLowerCase(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
};

describe('requests', () => {
  let server;

  beforeAll(async () => {
    jasmine.addMatchers(matchers);
    await initDb();
  });

  beforeEach(() => {
    server = app.listen();
  });

  it('(POST) redirect to root after create new user', async () => {
    const res = await request.agent(server)
      .post('/users');
    expect(res).toHaveHTTPStatus(302);
  });

  it('(GET) users', async () => {
    const res = await request.agent(server)
      .get('/users');
    expect(res).toHaveHTTPStatus(200);
  });

  it('(POST) add new user to database', async () => {
    const res = await request.agent(server)
      .post('/users')
      .send(dataTestForm);
    const user = await User.findOne({
      where: {
        email: dataTestForm.email,
      },
    });
    expect(res).toHaveHTTPStatus(302);
    expect(user.firstName).toEqual(dataTestForm.firstName);
    expect(user.lastName).toEqual(dataTestForm.lastName);
    expect(user.email).toEqual(dataTestForm.email);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});
