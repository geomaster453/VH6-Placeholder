"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Send = require("koa-send");
const Router = require("koa-router");
const Serve = require("koa-static");
const port = process.env.PORT || 3000;
const app = new Koa();
const router = new Router();
app.use(Serve(`${__dirname}`));
app.use(router.routes());
app.listen(port);
app.use(function* index() {
    yield Send(this, `${__dirname}/index.html`);
});
console.log(`Listening on port ${port}`);
//# sourceMappingURL=server.js.map