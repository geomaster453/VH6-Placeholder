import * as Koa from 'koa';
import * as Serve from 'koa-static';
import * as Mount from 'koa-mount';

const port = process.env.PORT || 3000;
const app = new Koa();
const ui = new Koa;

ui.use(Serve(`${__dirname}/frontend`));
app.use(Mount('/', ui));

app.listen(port);

console.log(`Listening on port ${port}`);
