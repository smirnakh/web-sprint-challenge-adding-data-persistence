/*
IMPORTANT NOTES 🔥
IMPORTANT NOTES 🔥
IMPORTANT NOTES 🔥

1- Run tests using `npm test` script (see `package.json`)
2- Tests use their own database connection (see `knexfile.js` and `data/dbConfig.js`)
3- Tests will fail to run until server.js and migration(s) are sufficiently fleshed out
4- Opening the `test.db3` with SQLite Studio might prevent tests from working
5- If the tests crash due to a "locked migration table", stop tests and delete `test.db3` file
6- Manual testing with Postman or HTTPie is still necessary
*/
const request = require('supertest');
const db = require('./data/dbConfig');
const server = require('./api/server');

const projectA = { project_name: 'Web API', project_description: 'Build APIs' };
const projectB = {
  project_name: 'Databases',
  project_description: 'Learn SQL',
  project_completed: 1,
};
const projectC = { project_name: 'Authentication' };

const resourceA = { resource_name: 'keyboard' };
const resourceB = {
  resource_name: 'computer',
  resource_description: 'Windows PC',
};

const taskA = { task_description: 'Do foo', project_id: 1 };
const taskB = {
  task_description: 'Do bar',
  task_notes: 'Use Postman!',
  project_id: 1,
};
const taskC = {
  task_description: 'Do baz',
  task_notes: 'Have fun!',
  task_completed: 1,
  project_id: 2,
};

afterAll(async () => {
  await db.destroy();
});
beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

test('[0] sanity check', () => {
  expect(true).not.toBe(false);
});

describe('server.js', () => {
  // 👉 PROJECTS
  // 👉 PROJECTS
  // 👉 PROJECTS
  describe('projects endpoints', () => {
    describe('[GET] /api/projects', () => {
      beforeEach(async () => {
        await db('projects').insert(projectA);
        await db('projects').insert(projectB);
      });
      test('[1] can get all projects that exist in the table', async () => {
        const res = await request(server).get('/api/projects');

        expect(res.body).toHaveLength(2);
      }, 750);
      test('[2] each project contains project_name, project_description and project_completed (as a boolean)', async () => {
        const res = await request(server).get('/api/projects');

        expect(res.body[0]).toMatchObject({
          ...projectA,
          project_completed: false,
        });
        expect(res.body[1]).toMatchObject({
          ...projectB,
          project_completed: true,
        });
      }, 750);
    });
    describe('[POST] /api/projects', () => {
      test('[3] can add a new project to the table', async () => {
        await request(server).post('/api/projects').send(projectA);
        await request(server).post('/api/projects').send(projectB);
        await request(server).post('/api/projects').send(projectC);
        const projects = await db('projects');
        expect(projects).toHaveLength(3);
        expect(projects[0]).toMatchObject(projectA);
        expect(projects[1]).toMatchObject({
          project_name: 'Databases',
          project_description: 'Learn SQL',
        });
        expect(projects[2]).toMatchObject({
          ...projectC,
          project_description: null,
        });
      }, 750);
      test('[4] responds with the newly created project with its project_completed as a boolean', async () => {
        let res = await request(server).post('/api/projects').send(projectA);
        expect(res.body).toMatchObject({
          ...projectA,
          project_completed: false,
        });
        res = await request(server).post('/api/projects').send(projectB);
        expect(res.body).toMatchObject({
          ...projectB,
          project_completed: true,
        });
        res = await request(server).post('/api/projects').send(projectC);
        expect(res.body).toMatchObject({
          ...projectC,
          project_completed: false,
        });
      }, 750);
      test('[5] rejects projects lacking a project_name with an error status code', async () => {
        const res = await request(server).post('/api/projects').send({});
        const projects = await db('projects');
        expect(res.status + '').toMatch(/4|5/);
        expect(projects).toHaveLength(0);
      }, 750);
    });
  });

  // 👉 RESOURCES
  // 👉 RESOURCES
  // 👉 RESOURCES
  describe('resources endpoints', () => {
    describe('[GET] /api/resources', () => {
      test('[6] can get all resources in the table', async () => {
        await db('resources').insert(resourceA);
        await db('resources').insert(resourceB);
        const res = await request(server).get('/api/resources');
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toMatchObject(resourceA);
        expect(res.body[1]).toMatchObject(resourceB);
      }, 750);
    });
    describe('[POST] /api/resources', () => {
      test('[7] can add a new resource to the table', async () => {
        await request(server).post('/api/resources').send(resourceA);
        await request(server).post('/api/resources').send(resourceB);
        const resources = await db('resources');
        expect(resources).toHaveLength(2);
        expect(resources[0]).toMatchObject(resourceA);
        expect(resources[1]).toMatchObject(resourceB);
      }, 750);
      test('[8] responds with the newly created resource', async () => {
        const res = await request(server)
          .post('/api/resources')
          .send(resourceA);
        expect(res.body).toMatchObject(resourceA);
      }, 750);
      test('[9] rejects a resource with an existing resource_name with an error status code', async () => {
        await db('resources').insert(resourceA);
        const res = await request(server)
          .post('/api/resources')
          .send(resourceA);
        const resources = await db('resources');
        expect(res.status + '').toMatch(/4|5/);
        expect(resources).toHaveLength(1);
      }, 750);
    });
  });

  // 👉 TASKS
  // 👉 TASKS
  // 👉 TASKS
  describe('tasks endpoints', () => {
    beforeEach(async () => {
      await db('projects').insert(projectA);
      await db('projects').insert(projectB);
      await db('tasks').insert(taskA);
      await db('tasks').insert(taskB);
      await db('tasks').insert(taskC);
    });
    describe('[GET] /api/tasks', () => {
      test('[10] can get all tasks in the table', async () => {
        const res = await request(server).get('/api/tasks');
        expect(res.body).toHaveLength(3);
      }, 750);
      test('[11] each task contains task_notes and task_description and task_completed (as a boolean)', async () => {
        const res = await request(server).get('/api/tasks');
        expect(res.body[0]).toMatchObject({
          task_description: 'Do foo',
          task_notes: null,
          task_completed: false,
        });
        expect(res.body[1]).toMatchObject({
          task_description: 'Do bar',
          task_notes: 'Use Postman!',
          task_completed: false,
        });
        expect(res.body[2]).toMatchObject({
          task_description: 'Do baz',
          task_notes: 'Have fun!',
          task_completed: true,
        });
      }, 750);
      test('[12] each task contains the project_name and the project_description', async () => {
        const res = await request(server).get('/api/tasks');
        expect(res.body[0]).toMatchObject({
          project_name: 'Web API',
          project_description: 'Build APIs',
        });
        expect(res.body[1]).toMatchObject({
          project_name: 'Web API',
          project_description: 'Build APIs',
        });
        expect(res.body[2]).toMatchObject({
          project_name: 'Databases',
          project_description: 'Learn SQL',
        });
      }, 750);
    });
    describe('[POST] /api/tasks', () => {
      test('[13] can add a new task to the db', async () => {
        await db('tasks').truncate();
        await request(server).post('/api/tasks').send(taskA);
        await request(server).post('/api/tasks').send(taskB);
        await request(server).post('/api/tasks').send(taskC);
        const tasks = await db('tasks');
        expect(tasks).toHaveLength(3);
      }, 750);
      test('[14] responds with the newly created task with the task_completed as a boolean', async () => {
        await db('tasks').truncate();
        const res = await request(server).post('/api/tasks').send(taskA);
        expect(res.body).toMatchObject({
          task_description: 'Do foo',
          task_notes: null,
          task_completed: false,
        });
      }, 750);
      test('[15] rejects a task lacking a task_description with an error status code', async () => {
        await db('tasks').truncate();
        const res = await request(server)
          .post('/api/tasks')
          .send({ project_id: 1 });
        const tasks = await db('tasks');
        expect(res.status + '').toMatch(/4|5/);
        expect(tasks).toHaveLength(0);
      }, 750);
      test('[16] rejects a task lacking a project_id with an error status code', async () => {
        await db('tasks').truncate();
        const res = await request(server)
          .post('/api/tasks')
          .send({ task_description: 'Execute order 66' });
        const tasks = await db('tasks');
        expect(res.status + '').toMatch(/4|5/);
        expect(tasks).toHaveLength(0);
      }, 750);
      test('[17] rejects a task containing an invalid project_id with an error status code', async () => {
        await db('tasks').truncate();
        const res = await request(server)
          .post('/api/tasks')
          .send({ ...taskA, project_id: 66 });
        const tasks = await db('tasks');
        expect(res.status + '').toMatch(/4|5/);
        expect(tasks).toHaveLength(0);
      }, 750);
    });
  });
});
