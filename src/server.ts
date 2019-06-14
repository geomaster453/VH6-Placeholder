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

function validateEmail(doc: any) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let valid: boolean;
  hackerEmail.countDocuments({ email: doc.email.toLowerCase() }).then((count) => {
    valid = (count === 0 && re.test((doc.email as string).toLowerCase())) ? true : false;
  });
  return valid;
}

router.post('/', async (ctx) => {
  const info = ctx.request.body;
  const newEmail = new hackerEmail({
    email: info.email,
  });
  // if (validateEmail(newEmail)) {
  //   await newEmail.save((err) => {
  //     if (err) {
  //       console.log(`Database error: ${err}`);
  //     } else {
  //       console.log('Email saved in database');
  //     }
  //   });
  //   ctx.response.redirect('back');
  // }
  await newEmail.save((err) => {
    if (err) {
      console.log(`Database error: ${err}`);
    } else {
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
