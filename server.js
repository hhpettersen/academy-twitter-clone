require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const api = express();
const { authenticate } = require('./middlewares/authenticate');

// Impored functions
const {
  getTweets,
  getTweetsById,
  createTweet,
  deleteTweetById,
  getFeedById,
} = require('./middlewares/tweets-middleware')
const {
  createUser,
  getUserByHandle,
  getUserById,
  editUserProfile,
  validateHandle,
  editUserImage,
  addToFollowing,
  removeFromFollowing,
} = require('./middlewares/user-middleware')
const {
  cryptPassword,
  decryptPassword
} = require('./middlewares/bcrypt')


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

  const user = await getUserByHandle(handle);

  const match = await decryptPassword(password, user.password);

  if (!user) {
    return res.status(401).send({
      error: 'Unknown user'
    });
  }

  if (!match) {
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

api.put('/follow', async function (req, res) {
  const {
    id,
    follow_id
  } = req.body;

  const updateFollower = await addToFollowing({ follow_id, id });
  res.send(updateFollower)
})

api.put('/unfollow', async function (req, res) {
  const {
    id,
    follow_id
  } = req.body;

  const updateFollower = await removeFromFollowing({ follow_id, id })
  res.send(updateFollower);
})

api.delete('/delete', authenticate, async (req, res) => {
  const { id } = req.user;
  const { data } = req.body;

  await deleteTweetById(data.id)
  res.send({id})
})

api.get('/userfeed', authenticate, async function (req, res) {
  const { id } = req.user;
  const tweets = await getFeedById(id);
  res.send(tweets);
})


api.get('/myprofile', authenticate, async function (req, res) {
  const { id } = req.user;
  const userData = await getUserById(id);
  res.send(userData);
})

api.get('/user', authenticate, async function (req, res) {
  const { handle } = req.body;
  const userData = await getUserByHandle(handle);
  res.send(userData);
})

api.put('/editprofile', authenticate, async function (req, res) {
  const { id } = req.user;
  const {
    name,
    handle,
    about
  } = req.body;

  const updateUser = await editUserProfile({
    name,
    handle,
    about,
    id,
  });

  res.send(updateUser);
})

api.put('/editimage', authenticate, async function (req, res) {
  const { id } = req.user;
  const {
    image
  } = req.body;

  const updateImage = await editUserImage({
    image,
    id
  });

  res.send(updateImage);
})

api.get('/tweets', async function (req, res) {
  const tweets = await getTweets();
  res.send(tweets);
});

api.post('/signup', async function (req, res) {
  const {
    name,
    handle,
    password,
  } = req.body;

  const handleCount = await validateHandle(handle);
  const hashPassword = await cryptPassword(password);
  console.log(handleCount.count)

  if (+handleCount.count) {
    return res.status(403).json({ status: 403, message: 'Handle already in use, please try again.'})
  } else {
    const newUser = await createUser({
      name,
      handle,
      hashPassword,
    })
    res.send(newUser);
  }
});

// PORTING
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Twitter Clone running on port ${port}`);
});