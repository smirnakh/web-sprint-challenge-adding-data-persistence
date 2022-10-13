/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema
    .createTable('projects', (table) => {
      table.increments('project_id');
      table.string('project_name', 128).notNullable();
      table.string('project_description');
      table.boolean('project_completed').defaultTo(false);
    })
    .createTable('resources', (table) => {
      table.increments('resource_id');
      table.string('resource_name').unique().notNullable();
      table.string('resource_description');
    })
    .createTable('tasks', (table) => {
      table.increments('task_id');
      table.string('task_description').notNullable();
      table.string('task_notes');
      table.boolean('task_completed').defaultTo(false);
      table
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('project_id')
        .inTable('projects');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema
    .dropTableIfExists('tasks')
    .dropTableIfExists('projects')
    .dropTableIfExists('resources');
};
