// build your `Resource` model here
const db = require('../../data/dbConfig');

const getAll = () => {
  return db('resources');
};

const create = (resource) => {
  return db('resources')
    .insert(resource)
    .then((newResource) => {
      return db('resources').where('resource_id', newResource[0]).first();
    });
};

module.exports = {
  getAll,
  create,
};
