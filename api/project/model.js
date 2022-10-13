// build your `Project` model here
const db = require('../../data/dbConfig');

const getAll = () => {
  return db('projects').select('*').from('projects');
};

const create = (project) => {
  return db('projects')
    .insert(project)
    .then((newProject) => {
      return db('projects').where('project_id', newProject[0]).first();
    });
};

module.exports = {
  getAll,
  create,
};
