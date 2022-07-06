const fs = require('fs'); //para lidar com manipulação de arquivos
const path = require('path'); // para lidar com os diretorios
const uploadConfig = require('../configs/upload');

class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename(  // rename aqui significa mudar o arquivo de lugar
      path.resolve(uploadConfig.TMP_FOLDER, file), //pegando o arquivo dessa pasta
      path.resolve(uploadConfig.UPLOADS_FOLDER, file) // levando para essa pasta
    );

    return file;
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return; 
    }

    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;