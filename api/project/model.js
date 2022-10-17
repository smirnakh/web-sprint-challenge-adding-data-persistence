// build your `Project` model here
const db = require('../../data/dbConfig');

function getAll() {
  return db('projects')
    .then((projects) =>
      projects.map((proj) => ({
        ...proj,
        project_completed: proj.project_completed ? true : false,
      }))
    )
    .catch((error) => console.error(error));
}
// const getAll = () => {
//   return db('projects').then((projects) => {
//     projects.map((project) => {
//       return {
//         ...project,
//         project_completed: project.project_completed ? true : false,
//       };
//     });
//   });
// .catch((error) => console.error(error))
//return db('projects').select('*').from('projects');
//};

const create = (project) => {
  return db('projects')
    .insert(project)
    .then((newProject) => {
      return db('projects').where('project_id', newProject[0]).first();
    })
    .then((newProject) => {
      return {
        ...newProject,
        project_completed: newProject.project_completed ? true : false,
      };
    });
};

module.exports = {
  getAll,
  create,
};
