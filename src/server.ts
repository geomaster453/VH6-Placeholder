import * as Koa from 'koa';
// import * as Router from 'koa-router';
import * as Serve from 'koa-static';

const port = process.env.PORT || 3000;
const app = new Koa();
// const router = new Router();

console.log(__dirname);
console.log(`${__dirname}/frontent`);
app.use(Serve(`${__dirname}/frontend`));

app.listen(port);

console.log(`Listening on port ${port}`);
