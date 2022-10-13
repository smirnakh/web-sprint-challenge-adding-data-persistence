// build your `Task` model here
const db = require('../../data/dbConfig');

const getAll = () => {
  return db('tasks')
    .select('*')
    .from('tasks')
    .leftJoin('projects', 'tasks.project_id', 'projects.project_id');
};

const create = (task) => {
  return db('tasks')
    .insert(task)
    .then((newTask) => {
      return db('tasks').where('task_id', newTask[0]).first();
    });
};

module.exports = {
  getAll,
  create,
};
