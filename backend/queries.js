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

  values = values.slice(0, values.length - 1); // slice off the trailing ','
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

function updateApplication(request, response) {
  const id = request.body.id;
  console.log("called updateApplication", id);
  delete request.body.id;
  const data = {
    ...request.body,
    DOB: new Date(request.body.DOB).toISOString().split("T")[0]
  };
  const variablesThatNeedQuotesAroundThemForSQLQuery = [
    "firstName",
    "lastName",
    "DOB",
    "zipCode",
    "vehicle1VIN",
    "vehicle1Year",
    "vehicle1MakeAndModel",
    "vehicle2VIN",
    "vehicle2Year",
    "vehicle2MakeAndModel",
    "vehicle3VIN",
    "vehicle3Year",
    "vehicle3MakeAndModel"
  ];
  //   go through the data object and create the SET statement
  const set = Object.keys(data).map(key => {
    if (variablesThatNeedQuotesAroundThemForSQLQuery.includes(key)) {
      return `"${key}" = '${data[key]}'`;
    }
    return `${key} = '${data[key]}'`;
  });
  let joinedSet = set.join(", ");
  joinedSet = joinedSet.slice(0, joinedSet.length - 1); // slice off the trailing ','
  console.log("joinedSet", joinedSet);
  pool.query(
    `UPDATE applications
     SET ${set}
     WHERE id = ${id}
     `,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Updated application successfully!`);
    }
  );
}

module.exports = { getApplication, createApplication, updateApplication };
