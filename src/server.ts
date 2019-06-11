import * as Koa from 'koa';
// import * as Router from 'koa-router';
import * as serve from 'koa-static';

const port = process.env.PORT || 3000;
const app = new Koa();
// const router = new Router();

app.use(serve(`${__dirname}/app`));

app.listen(port);

console.log(`Listening on port ${port}`);
