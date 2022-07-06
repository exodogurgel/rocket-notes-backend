const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const DiskStorage = require('../providers/DiskStorage');

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;

    const diskStorage = new DiskStorage();

    const user = await knex("users")
      .where({ id: user_id}).first();

    if(!user) {
      throw new AppError("Somente usuários autenticados podem mudar o avatar", 401);
    }

    // verificando se ja existe avatar
    if(user.avatar) {
      // se existir, deletaremos a foto
      await diskStorage.deleteFile(user.avatar);
    }

    // Caso não exista avatar
    const filename = await diskStorage.saveFile(avatarFilename);
    user.avatar = filename;

    //salvando no banco de dados
    await knex("users").update(user).where({ id: user_id });

    return response.json(user);
  }
}

module.exports = UserAvatarController;