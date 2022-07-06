const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/AppError");

// importando conexão com o banco de dados
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create( request, response ) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    // Verificando se ja tem algum email igual
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    // Criptografando senha
    const hashedPassword = await hash(password, 8);

    // Cadastrando usuário
    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [ name, email, hashedPassword ]
    );

    return response.status(201).json();
  }

  async update( request, response ) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    // verificando se a pessoa ta tentando atualizar o email para outro email que ja existe
    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      throw new AppError("Este e-mail já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    // Atualizando senha 
    // se a pessoa digitou a senha, mas não digitou a senha antiga
    if (password && !old_password) { 
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha");
    }

    // se os dois forem informado
    if (password && old_password) {
      // verificando se a senha antiga passada pelo usuário é realmente igual a que esta cadastrada no banco de dados
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.")
      }

      // se estiver tudo certo, a senha será atualizada
      user.password = await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id] 
      );

      return response.json();
  }
}

module.exports = UsersController;
