CREATE TABLE IF NOT EXISTS teacher (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );

INSERT INTO teacher (name) VALUES
      ('Alice'),
      ('Bob')
      ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content VARCHAR(5000) NOT NULL,
        createdDate TIMESTAMPTZ DEFAULT current_timestamp,
        teacherId INT,
        FOREIGN KEY (teacherId) REFERENCES teacher(id)
      );

INSERT INTO posts (teacherId, title, content) VALUES
      ((SELECT id FROM teacher WHERE name = 'Alice'), 'First Post', 'Content of the first post'),
      ((SELECT id FROM teacher WHERE name = 'Bob'), 'Second Post', 'Content of the second post')
      ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS "user" (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        teacherId INT,
        FOREIGN KEY (teacherId) REFERENCES teacher(id)
);

INSERT INTO "user" (teacherId,email, password) VALUES
      ((SELECT id FROM teacher WHERE name = 'Alice'), 'alice@fiap.com.br', '$2a$12$/hdlY.pOIi/GUWLYE1Ia2ebrEqZxRmDHSqLWSGMCQe39Vlc98vYPa'),
      ((SELECT id FROM teacher WHERE name = 'Bob'), 'bob@fiap.com.br', '$2a$12$/hdlY.pOIi/GUWLYE1Ia2ebrEqZxRmDHSqLWSGMCQe39Vlc98vYPa')
      ON CONFLICT DO NOTHING;