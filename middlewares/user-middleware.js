const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
  
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

// Used to update userinfo in editprofile-route
editUserProfile = async (userData) => {
  const { rows } = await pool.query(
    `
    UPDATE users SET
        name = $1,
        handle = $2
    WHERE
      id = $3
    RETURNING * 
    `, [userData.name, userData.handle ,userData.id]);
  
  return rows[0]
}

// getting all user-data by id
getUserById = async (id) => {
  const { rows } = await pool.query(`
    SELECT
      *
    FROM
      users
    WHERE
      id = $1`,
      [id])

  return rows[0]
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
      createUser,
      getUserByHandle,
      editUserProfile,
      getUserById
  }