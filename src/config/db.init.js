const pool = require('./db.config');

async function dbInit() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS teacher (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);
    console.log('Table "teacher" created successfully!');

    await client.query(`
      INSERT INTO teacher (name) VALUES
      ('Alice'),
      ('Bob')
      ON CONFLICT DO NOTHING;
    `);
    console.log('Initial data inserted into "teacher" table!');

    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(5000) NOT NULL,
        createdDate TIMESTAMP DEFAULT current_timestamp,
        teacherId INT,
        FOREIGN KEY (teacherId) REFERENCES teacher(id)
      );
    `);
    console.log('Table "posts" created successfully!');

    await client.query(`
      INSERT INTO posts (teacherId, title, content) VALUES
      ((SELECT id FROM teacher WHERE name = 'Alice'), 'First Post', 'Content of the first post'),
      ((SELECT id FROM teacher WHERE name = 'Bob'), 'Second Post', 'Content of the second post')
      ON CONFLICT DO NOTHING;
    `);
    console.log('Initial data inserted into "posts" table!');
  } catch (error) {
    console.error('Error creating tables or inserting data:', error);
  } finally {
    client.release();
  }
}

module.exports = dbInit;