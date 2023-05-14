const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "api",
  password: "password",
  port: 5432
});

function getApplication(request, response) {
  pool.query("SELECT * FROM applications", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

function createApplication(request, response) {
  const {
    firstName,
    lastName,
    DOB,
    street,
    city,
    state,
    zipCode
  } = request.body;
  pool.query(
    "INSERT INTO applications (firstName, lastName, DOB, street, city, state, zipCode) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [firstName, lastName, DOB, street, city, state, zipCode]
  );
}

module.exports = { createApplication, getApplication };
