"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
//import * as Router from 'koa-router';
const Serve = require("koa-static");
const port = process.env.PORT || 3000;
const app = new Koa();
//const router = new Router();
app.use(Serve(`${__dirname}/frontend`));
app.listen(port);
console.log(`Listening on port ${port}`);
//# sourceMappingURL=server.js.map