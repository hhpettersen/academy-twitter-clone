const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// function getTweets() {
//     return pool.query(`
//       SELECT
//         tweets.id,
//         tweets.message,
//         tweets.created_at,
//         users.name,
//         users.handle
//       FROM
//         tweets
//       INNER JOIN users ON
//         tweets.user_id = users.id
//       ORDER BY tweets.created_at DESC
//     `)
//       .then(({
//         rows
//       }) => rows);
//   }

getTweets = async () => {
  const { rows } = await pool.query(`
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

  return rows;
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

// getTweetsById = async (id) => {
//   const { rows } = await pool.query(`
//     SELECT
//       tweets.message
//     FROM
//       tweets
//     INNER JOIN
//       users
//     ON
//       tweets.user_id = $1
//   `, [id]);

//   return rows[0]
// }
  
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

  module.exports = {
      getTweets,
      getTweetsById,
      createUser,
      createTweet,
      getUserByHandle,
      deleteTweetById,
  }