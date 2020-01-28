const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});


getTweets = async () => {
  const { rows } = await pool.query(`
  SELECT
    tweets.id,
    tweets.message,
    tweets.created_at,
    users.name,
    users.handle,
    users.image
  FROM
    tweets
  INNER JOIN users ON
    tweets.user_id = users.id
  ORDER BY tweets.created_at DESC
  `)

  return rows;
}
  
  function getTweetsById(id) {
    return pool.query(`
    SELECT 
      tweets.message 
    FROM 
      tweets 
    INNER JOIN 
      users 
    ON 
      tweets.user_id = $1`, [id])
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

  getFeedById = async (id) => {
    const { rows } = await pool.query(`
    SELECT
    tweets.message,
    created_at,
    id
    FROM
      tweets
    WHERE
      tweets.user_id = $1
    ORDER BY 
      tweets.created_at DESC
    `, [id])

    return rows;
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

  deleteTweetById = async (id) => {
    const { rows } = await pool.query(`
      DELETE FROM
        tweets
      WHERE
        id = $1
    `, [id]);
    
    return rows[0]
  }

  module.exports = {
      getTweets,
      getTweetsById,
      createTweet,
      deleteTweetById,
      getFeedById,
  }