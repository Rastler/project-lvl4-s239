import request from 'supertest';
import faker from 'faker';
import matchers from 'jest-supertest-matchers';

import app from '../src-backend';
import initDb from '../src-backend/initDb';

const dataTestForm = {
  email: 'rust@mail.com',
  password: '123',
};

const wrongDataTestForm = {
  email: faker.internet.email().toLowerCase(),
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

  it('(POST) Sign in', async () => {
    const res = await request.agent(server)
      .post('/session')
      .send(dataTestForm);
    expect(res).toHaveHTTPStatus(302);
    expect(res.headers.authenticated).toBe('yes');
  });

  it('(POST) Wrong sign in', async () => {
    const res = await request.agent(server)
      .post('/session')
      .send(wrongDataTestForm);
    expect(res).toHaveHTTPStatus(200);
    expect(res.headers.authenticated).toBe('no');
  });

  it('(DELETE) Sign out', async () => {
    const res = await request.agent(server)
      .delete('/session');
    expect(res).toHaveHTTPStatus(302);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});
