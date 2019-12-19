require('dotenv').config();

/* 
postgres://qckiadogaetqwx:40998084dd86f57a73cedcee14329cb752e39940d2e3da33437f9e6e8811a220@ec2-174-129-24-148.compute-1.amazonaws.com:5432/d8dsenh16mari4

user: qckiadogaetqwx
password: 40998084dd86f57a73cedcee14329cb752e39940d2e3da33437f9e6e8811a220
host: ec2-174-129-24-148.compute-1.amazonaws.com
port: 5432
database: d8dsenh16mari4

*/
const express = require('express');
const bodyParser = require('body-parser');
const {
  Pool
} = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');


const {
  authenticate
} = require('./middleware');

const app = express();
const api = express();
app.use(express.static('build'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const port = process.env.PORT;
const secret = process.env.SECRET;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function getTweets() {
  return pool.query(`
    SELECT
      tweets.id,
      tweets.message,
      tweets.created_at,
      users.name,
      users.handle
    FROM
      tweets
    INNER JOIN users ON
      tweets.user_id = users.id
    ORDER BY tweets.created_at DESC
  `)
    .then(({
      rows
    }) => rows);
}

function getTweetsById(id) {
  return pool.query('SELECT tweets.message FROM tweets INNER JOIN users ON tweets.user_id = $1', [id])
    .then(({
      rows
    }) => {
      return rows.map((elem) => {
        return {
          message: elem.message,
        };
      });
    })
    .then((tweet) => tweet[0]);
}

function createUser(users) {
  const queryText = `
    INSERT INTO users(
        name,
        handle,
        password
    )

    VALUES(
        $1,
        $2,
        $3
    )

    RETURNING *
    `

  const queryValues = [
    users.name,
    users.handle,
    users.password,
  ]

  return pool.query(queryText, queryValues)
    .then(({
      rows
    }) => {
      return rows.map((elem) => {
        return {
          id: elem.id,
          name: elem.name,
          handle: elem.handle,
          password: elem.password,
        };
      });
    })
    .then((users) => users[0]);
}

function createTweet(message, userId) {
  return pool.query(`
    INSERT INTO tweets
      (message, user_id)
    VALUES
      ($1, $2)
    RETURNING
      *
  `, [message, userId])
    .then(({
      rows
    }) => rows[0]);
}

function getUserByHandle(handle) {
  return pool.query(`
    SELECT * FROM users WHERE handle = $1
  `, [handle])
    .then(({
      rows
    }) => rows[0]);
}

function deleteTweetById(id) {
  return pool.query('DELETE FROM tweets WHERE id = $1', [id])
}

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
  console.log({
    handle,
    password
  })
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

api.get('/tweets', async function (req, res) {
  const tweets = await getTweets();
  res.send(tweets);
});

api.get('/tweets/:handle', async function (req, res) {
  const {
    id
  } = req.params;

  const myTweets = await getTweetsById(id);
  res.send(myTweets);
});

api.post('/signup', function (req, res) {
  const {
    name,
    handle,
    password,
  } = req.body;

  createUser({
      name,
      handle,
      password,
    })
    .then((newUser) => {
      res.send(newUser);
    });
});

api.delete('/tweets/:handle', function (req, res) {
  const {
    id
  } = req.body;
  deleteTweetById(id)
    .then(() => {
      res.send({
        id
      });
    });
});

app.use('/api', api);

app.listen(port, () => {
  console.log('Twitter Clone running on port 3333');
});