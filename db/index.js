const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

export const db = {};

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
console.log(host, port, user, password, database);
await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// connect to db
const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: "mysql",
  dialectModule: require("mysql2")
});
db.sequelize = sequelize;
db.user = require("./models/user")(sequelize);
db.topic = require("./models/topic")(sequelize);
db.topicLog = require("./models/topicLog")(sequelize);
db.session = require("./models/session")(sequelize);
