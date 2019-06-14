"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const Send = require("koa-send");
const Serve = require("koa-static");
const Mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser");
const port = process.env.PORT || 3000;
const app = new Koa();
const router = new Router();
Mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
console.log('Connected to database');
const emailSchema = new Mongoose.Schema({
    email: String,
    validate: {
        validator: function (v, cb) {
            hackerEmail.find({ email: v }, function (docs) {
                cb(docs.length === 0);
            });
        },
        message: 'Email already exists!'
    }
});
const hackerEmail = Mongoose.model('Emails', emailSchema);
router.post('/', async (ctx) => {
    const info = ctx.request.body;
    const newEmail = new hackerEmail({
        email: info.email,
    });
    await newEmail.save((err) => {
        if (err) {
            console.log(`Database error: ${err}`);
        }
        else {
            console.log('Email saved in database');
        }
    });
    ctx.response.redirect('back');
});
app.use(Serve('src'));
app.use(bodyParser());
app.use(router.routes());
app.listen(port);
app.use(async (ctx) => {
    await Send(ctx, `${__dirname}/index.html`);
});
console.log(`Listening on port ${port}`);
//# sourceMappingURL=server.js.map