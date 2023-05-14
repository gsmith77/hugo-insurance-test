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
  delete request.body.id;
  const data = {
    ...request.body,
    DOB: new Date(request.body.DOB).toISOString().split("T")[0]
  };
  console.log("data", data);
  let values = Object.keys(request.body)
    .map((key, index) => `$${index + 1},`)
    .join(" ");

  values = values.slice(0, values.length - 1);
  console.log("values", values);
  const keys = `"firstName", "lastName", "DOB", street, city, state, "zipCode", "vehicle1VIN", "vehicle1Year", "vehicle1MakeAndModel", "vehicle2VIN", "vehicle2Year", "vehicle2MakeAndModel", "vehicle3VIN", "vehicle3Year", "vehicle3MakeAndModel"`;
  pool.query(
    `INSERT INTO applications(${keys}) VALUES (${values});`,
    [...Object.values(data)],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Created application successfully!`);
    }
  );
}

module.exports = { createApplication, getApplication };
