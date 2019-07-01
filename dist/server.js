"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const Send = require("koa-send");
const Serve = require("koa-static");
const Mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser");
const Helmet = require("koa-helmet");
const port = process.env.PORT || 3000;
const app = new Koa();
const router = new Router();
Mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
console.log('Connected to database');
const re = new RegExp(['^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]',
    '{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'].join(''));
const emailSchema = new Mongoose.Schema({
    email: String,
});
const hackerEmail = Mongoose.model('Emails', emailSchema);
async function validateEmail(doc) {
    let valid = re.test(doc.email.toLowerCase());
    await hackerEmail.countDocuments({ email: doc.email.toLowerCase() }, (err, count) => {
        valid = (count === 0 && valid) ? true : false;
    });
    return valid;
}
router.post('/', async (ctx) => {
    const info = ctx.request.body;
    const newEmail = new hackerEmail({
        email: info.email,
    });
    if (await validateEmail(newEmail)) {
        await newEmail.save((err) => {
            if (err) {
                console.log(`Database error: ${err}`);
            }
            else {
                console.log('Email saved in database');
            }
        });
    }
    ctx.response.redirect('back');
});
app.use(Helmet());
app.use(Serve('src'));
app.use(bodyParser());
app.use(router.routes());
app.listen(port);
app.use(async (ctx) => {
    await Send(ctx, `${__dirname}/index.html`);
});
console.log(`Listening on port ${port}`);
//# sourceMappingURL=server.js.map