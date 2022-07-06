const knex = require("../database/knex");

class TagsController {
  // função responsável por litar todas as tags cadastradas do usuário
  async index( request, response) {
    const  user_id  = request.user.id; // pegando o id pelo middleware

    const tags = await knex("tags")
      .where({ user_id }) // indo nas tags e filtrando onde seja igual ao user_id
      .groupBy("name") // ele vai agrupar pelo campo que voce dizer e não vai trazer repetidos desse campo
    return response.json(tags);
  }
}

module.exports = TagsController;