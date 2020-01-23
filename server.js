require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const api = express();
const { authenticate } = require('./middlewares/authenticate');

const {
  getTweets,
  getTweetsById,
  createUser,
  createTweet,
  getUserByHandle,
  deleteTweetById,
} = require('./middlewares/middleware')


const secret = process.env.SECRET;

//Defining middlewares: 

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('build'));
app.use('/api', api)

// ROUTES

// LOGIN/AUTH
api.get('/session', authenticate, function (req, res) {
  res.send({
    message: 'You are authenticated'
  });
});

api.post('/session', async function (req, res) {
  const {
    handle,
    password
  } = req.body;
  console.log(handle, password)
  const user = await getUserByHandle(handle);

  if (!user) {
    return res.status(401).send({
      error: 'Unknown user'
    });
  }

  if (user.password !== password) {
    return res.status(401).send({
      error: 'Wrong password'
    });
  }

  const token = jwt.sign({
    id: user.id,
    handle: user.handle,
    name: user.name
  }, new Buffer(secret, 'base64'));

  res.send({
    token: token
  });
});

api.post('/tweets', authenticate, async function (req, res) {
  const {
    id
  } = req.user;
  const {
    message
  } = req.body;

  const newTweet = await createTweet(message, id);
  res.send(newTweet);
});

// api.get('/myprofile', authenticate, async function (req, res) {
//   const { handle } = await req.user;
//   console.log("server.js", handle);
//   res.send(handle);
// })

api.get('/myprofile', authenticate, async function (req, res) {
  const userData = req.user;
  console.log(userData)
  res.send(userData);
})

api.get('/tweets', async function (req, res) {
  const tweets = await getTweets();
  res.send(tweets);
});

// api.get('/tweets/:handle', async function (req, res) {
//   const {
//     id
//   } = req.params;
  
//   const myTweets = await getTweetsById(id);
//   res.send(myTweets);
// });

api.post('/signup', async function (req, res) {
  const {
    name,
    handle,
    password,
  } = req.body;

  const newUser = await createUser({
    name,
    handle,
    password,
  })
  res.send(newUser);
});



// PORTING
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Twitter Clone running on port ${port}`);
});