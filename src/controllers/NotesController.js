const knex = require("../database/knex");

class NotesController {
  async create( request, response ) {
    // destructing 
    const { title, description, tags, links } = request.body;
    const { user_id } = request.params;

    // inserindo um nota recuperando o código da nota que foi inserida
    const note_id = await knex("notes").insert({
      title,
      description,
      user_id
    });

    // map() = ira percorrer em cada item dentro do array
    // aqui esta sendo criado um novo objeto inserindo o id da nota onde esse link esta vinculado e mudando de link para url
    const linksInsert = links.map(link => {
      return {
        note_id,
        url: link
      }
    });

    await knex("links").insert(linksInsert);

    // Inserindo as tags
    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    });

    await knex("tags").insert(tagsInsert);

    response.json();
  }

  async show( request, response ) {
    const { id } = request.params;

    // aqui queremos pegar a nota baseada pelo id
    const note = await knex("notes").where({ id }).first(); // aqui ele ira retornar so uma nota
    const tags = await knex("tags").where({ note_id: id}).orderBy("name"); // ordenado pelo nome
    const links = await knex("links").where({ note_id: id}).orderBy("created_at"); // ordenado pela data de criação

    return response.json({
      ...note, // despejando todos os detalhes da nota aqui
      tags,
      links,
    });
  }

  async delete( request, response ) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete();

    return response.json();
  }

  async index( request, response ) {
    const { title, user_id, tags } = request.query; // pegando o user_id de uma query

    let notes;

    //se existir a tags, ira rodar um filtro baseado por tags
    if(tags) {
      // convertendo de texto simples para um vetor
      const filterTags = tags.split(',').map(tag => tag.trim());
      
      notes = await knex("tags")
        // criando um array selecionando os campos necessários das tabelas
        .select([
          "notes.id",
          "notes.title",
          "notes.user_id",
        ])
        .where("notes.user_id", user_id) // filtrando pelas tags do id do usuário 
        .whereLike("notes.title", `%${title}%`) // Pesquise na palavra antes e depois e se existir oq estou passando traga para mim
        .whereIn("name", filterTags) // irar ser passado o nome da tag e irar ser comparado com o vetor que esta em filterTags
        .innerJoin("notes", "notes.id", "tags.note_id") // conectando uma tabela com a outra
        .orderBy("notes.title") // organizando pelo titulo
    } else {
      // buscando as notas
      notes = await knex("notes")
        .where({ user_id }) // pegando as notas criadas somente por esse usuário
        .whereLike("title", `%${title}%`) // Pesquise na palavra antes e depois e se existir oq estou passando traga para mim
        .orderBy("title"); // listando por ordem alfabética
    }

    const userTags = await knex("tags").where({ user_id }); // pegando todas as tags que o note_id seja igual ao id do usuário
    const notesWithTags = notes.map( note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id) // filtrando as tags da nota

      return {
        ...note,
        tags: noteTags
      }
    })
    return response.json(notesWithTags);
  }
}

module.exports = NotesController;