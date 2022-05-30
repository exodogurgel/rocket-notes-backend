const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

// importando biblioteca que resolve os endereços de acordo com o ambiente 
const path = require("path");

async function sqliteConnection() {
  const database = await sqlite.open({
    // o arquivo ficara salvo em filename
    // o resolve diz ( resolver p mim)  __dirname pega de forma automática onde eu estou dentro do meu projeto
    filename: path.resolve(__dirname, "..", "database.db"),  // onde estou, volte uma pagina, crie um arquivo chamado "database.db"
    driver: sqlite3.Database
  });

  return database;
}

module.exports = sqliteConnection;