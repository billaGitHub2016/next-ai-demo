const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
// const { createSeedUser } = require('./init');

const db = {};

const initialize = async () => {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
    console.log(host, port, user, password, database);
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { host, port, dialect: 'mysql' });
    db.sequelize = sequelize;

    /* fs.readdirSync(__dirname) */
    const models = process.cwd() + '/db/models/' || __dirname;
    fs.readdirSync(models)
        .filter(file => {
            return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
        })
        .forEach(file => {
            /* const model = sequelize["import"](path.join(__dirname, file)); */
            // const model = sequelize['import'](path.join(models, file));
            const model = require(path.join(__dirname, 'models', file));
            db[model.name] = model(sequelize);
        });
    // console.log('db = ', db);
    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    // sync all models with database
    await db.sequelize.sync();

    await createSeedUser(db);

    // await User.sync();
    console.log('sync end ~~~~~~~~~~~~~~');
};

async function createSeedUser(db) {
  const userAdmin = await db.user.findOne({ where: { email: 'admin@123.com' } })
  if (userAdmin) return
  const admin = await db.user.create({ email: 'admin@123.com', password: '123456',  });
  const topic = await db.topic.create({ title: 'Hello AI', userId: admin.id });
}

module.exports = { initialize };
