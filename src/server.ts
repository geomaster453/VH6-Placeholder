import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as Send from 'koa-send';
import * as Serve from 'koa-static';
import * as Mongoose from 'mongoose';
import * as bodyParser from 'koa-bodyparser';

const port = process.env.PORT || 3000;
const app = new Koa();
const router = new Router();

Mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
console.log('Connected to database');

interface IEmail {
  email: String,
}

interface emailModel extends IEmail, Mongoose.Document {}

// const emailSchema = new Mongoose.Schema({
//   email: {
//     type: String,
//     validate: {
//       validator: function (v: string, cb: (b: boolean) => void) {
//         hackerEmail.find({ email: v }, function (docs) {
//           cb (docs.length === 0);
//         });
//       },
//       message: 'Email already exists!',
//     },
//   }  
// });

const emailSchema = new Mongoose.Schema({
  email: String,
});

const hackerEmail = Mongoose.model('Emails', emailSchema);

const emailExists = (doc: any) => hackerEmail.countDocuments({ email: doc.email});

router.post('/', async (ctx) => {
  const info = ctx.request.body;
  const newEmail = new hackerEmail({
    email: info.email,
  });
  if (!emailExists(newEmail)) {
    await newEmail.save((err) => {
      if (err) {
        console.log(`Database error: ${err}`);
      } else {
        console.log('Email saved in database');
      }
    });
    ctx.response.redirect('back');
  }
});

app.use(Serve('src'));
app.use(bodyParser());
app.use(router.routes());

app.listen(port);

app.use(async (ctx) => {
  await Send(ctx, `${__dirname}/index.html`);
});

console.log(`Listening on port ${port}`);
