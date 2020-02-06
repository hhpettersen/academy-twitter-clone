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
  checkIfFollowing,
  checkFollowingCount,
  checkFollowerCount,
} = require('./middlewares/user-middleware')
const {
  cryptPassword,
  decryptPassword
} = require('./middlewares/bcrypt')


const secret = process.env.SECRET;

// ALTER TABLE users ALTER COLUMN following SET DEFAULT '{}';
// ALTER TABLE users ADD image integer DEFAULT 1;


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

api.put('/follow', authenticate, async function (req, res) {
  const { id } = req.user;
  const { follow_id } = req.body;

  const updateFollower = await addToFollowing({ follow_id, id });
  res.send(updateFollower)
})

api.put('/unfollow', authenticate, async function (req, res) {
  const { id } = req.user;
  const { follow_id } = req.body;

  const updateFollower = await removeFromFollowing({ follow_id, id })
  res.send(updateFollower);
})

api.post('/checkfollow', authenticate, async function (req, res) {
  const { follow_id } = req.body;
  const { id } = req.user;
  const booleanFollow = await checkIfFollowing({ follow_id, id })
  res.send(booleanFollow)
})

api.delete('/delete', authenticate, async (req, res) => {
  const { id } = req.user;
  const { data } = req.body;

  await deleteTweetById(data.id)
  res.send({id})
})

api.post('/userfeed', authenticate, async function (req, res) {
  const { id } = req.body;

  const tweets = await getFeedById(id);
  res.send(tweets);
})


api.post('/user', authenticate, async function (req, res) {
  const { handle } = req.body;
  const { id } = req.user;
  const userData = await getUserByHandle(handle);
  const followingData = await checkFollowingCount(id);
  const followersData = await checkFollowerCount(id);
  res.send({userData, followingData, followersData});
})

api.get('/user', authenticate, async function (req, res) {
  const { id } = req.user;
  const userData = await getUserById(id);
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

api.get('/tweets', authenticate, async function (req, res) {
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