exports.up = knex => knex.schema.createTable("tags", table => {
  table.increments("id");
  table.text("name").notNullable(); // aqui esta dizendo que não é aceito um nulo
  
  // a função onDelete() significa que se a nota que a tag esta vinculada for deletada a tag também será
  table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
  table.integer("user_id").references("id").inTable("users");
});

exports.down = knex => knex.schema.dropTable("tags");
