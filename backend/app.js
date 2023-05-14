const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const db = require("./queries");
const app = express();
const port = 3100;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Allow requests from every domain
app.use(cors());

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/application", db.getApplication);
app.post("/application", db.createApplication);
app.put("/application", db.updateApplication);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
