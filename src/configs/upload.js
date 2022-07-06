const path = require("path");
const multer = require("multer");
const crypto = require("crypto"); // não precisa de instalação 

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp"); // onde a imagem chega
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");     // onde a imagem vai ficar

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      // isso irar garantir que cada usuário tenha um arquivo com o nome único 
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },  
  }),
};

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
}