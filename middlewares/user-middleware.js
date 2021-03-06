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
      users.lowerCaseHandle,
      users.hashPassword,
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
        handle = $2,
        about=$3
    WHERE
      id = $4
    RETURNING * 
    `, [userData.name, userData.handle, userData.about, userData.id]);
  
  return rows[0]
}

/////////////////////FOLLOW///////////////////

addToFollowing = async (userData) => {
  const { rows } = await pool.query(
    `
      UPDATE users SET
      following = following || '{${userData.follow_id}}'
      WHERE 
        id = $1
      RETURNING *
    `, [userData.id])

  await pool.query(`
  UPDATE users SET
    followers = followers || '{${userData.id}}'
  WHERE
    id = $1
  RETURNING *
  `, [userData.follow_id])

  return rows[0]
}

removeFromFollowing = async (userData) => {
  const { rows } = await pool.query(
    `
    UPDATE users SET
      following = array_remove(following, $1)
    WHERE id = $2
    RETURNING *
    `, [userData.follow_id, userData.id])

  await pool.query(`
  UPDATE users SET
    followers = array_remove(followers, $1)
  WHERE id = $2
  RETURNING *
  `, [userData.id, userData.follow_id])

    return rows[0]
}

checkIfFollowing = async (userData) => {
  const { rows } = await pool.query(`
  SELECT COUNT(*) FROM
    users
  WHERE $1 = ANY(following)
  AND id = $2
  `, [userData.follow_id, userData.id])

  return rows [0]
}

checkFollowingCount = async (userData) => {
  const { rows } = await pool.query(`
  SELECT array_length(following, 1)
  FROM users WHERE id = $1
  `, [userData.id])

  return rows[0]
}

checkFollowerCount = async (userData) => {
  const { rows } = await pool.query(`
  SELECT array_length(followers, 1)
  FROM users WHERE id = $1
  `, [userData.id])

  return rows[0]
}

///////////////////END FOLLOW/////////////////////
    
editUserImage = async (userData) => {
  const { rows } = await pool.query(
    `
    UPDATE users SET
      image = $1
    WHERE
      id = $2
    RETURNING * 
    `, [userData.image, userData.id]);
  
  return rows[0]
}

// getting all user-data by id
getUserByHandle = async (handle) => {
  const { rows } = await pool.query(`
    SELECT
      *
    FROM
      users
    WHERE
      handle = $1`,
      [handle])

  return rows[0]
}

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

  validateHandle = async (handle) => {
    const { rows } = await pool.query(`
      SELECT
        COUNT(handle)
      FROM
        users
      WHERE
        handle = $1
    `, [handle])

    return rows[0]
  }

  module.exports = {
      createUser,
      getUserByHandle,
      editUserProfile,
      validateHandle,
      editUserImage,
      addToFollowing,
      removeFromFollowing,
      getUserById,
      checkIfFollowing,
      checkFollowingCount,
      checkFollowerCount,
  }