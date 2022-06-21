const { Router } = require("express");

const usersRouter = require("./users.routes");
const notesRouter = require("./notes.routes");
const tagsRouter = require("./tags.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router();

routes.use("/users", usersRouter); // quando for acessada essa rota levara para o userRoutes
routes.use("/sessions", sessionsRouter); 
routes.use("/notes", notesRouter); 
routes.use("/tags", tagsRouter); 

module.exports = routes;