const { verify } = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const authConfig = require('../configs/auth');

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization; // Aqui é onde o token do user fica salvo

  // Verificando se o token existe
  if(!authHeader) {
    throw new AppError("JWT Token não informado", 401);
  }

  // se existir, separando e pegando so o token
  const [, token] = authHeader.split(' ');  // Bearer xxxxxxxxxxToken

  try {
    // verificando se é um token válido e armazenando em uma constante
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    // criando propriedade 
    request.user = {
      id: Number(user_id),
    };

    return next();
  } catch {
    // se o token for invalido
    throw new AppError("JWT Token inválido", 401);
  }
}

module.exports = ensureAuthenticated;