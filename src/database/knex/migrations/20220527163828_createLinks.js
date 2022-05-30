exports.up = knex => knex.schema.createTable("links", table => {
  table.increments("id");
  table.text("url").notNullable(); // aqui esta dizendo que não é aceito um nulo
  
  // a função onDelete() significa que se a nota que a tag esta vinculada for deletada a tag também será
  table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
  table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("links");
