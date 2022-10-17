// build your `Task` model here
const db = require('../../data/dbConfig');

function getAll() {
  return db('tasks')
    .leftJoin('projects', 'tasks.project_id', 'projects.project_id')
    .then((tasks) =>
      tasks.map((task) => ({
        ...task,
        task_completed: task.task_completed ? true : false,
      }))
    )
    .catch((error) => console.error(error));
}

function create(task) {
  return db('tasks')
    .insert(task)
    .then((newTask) => {
      return db('tasks').where('task_id', newTask[0]).first();
    })
    .then((newTask) => {
      return {
        ...newTask,
        task_completed: newTask.task_completed ? true : false,
      };
    });
}

module.exports = {
  getAll,
  create,
};
