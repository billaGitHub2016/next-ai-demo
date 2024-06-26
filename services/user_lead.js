// import mysql from "mysql2";
import Sequelize from "sequelize";
import jwt from "jsonwebtoken";
import md5 from "md5";
import { db } from "../db";
export const EXPIRE_DATE = 60 * 60 * 24 * 7 * 1000;

// let pool = null
// // 创建连接池，设置连接池的参数
// function createPollConnection() {
//   pool = mysql.createPool({
//     host: process.env.DB_USER_HOST,
//     port: process.env.DB_USER_PORT,
//     user: process.env.DB_USER_USER,
//     password: process.env.DB_USER_PASSWORD,
//     database: process.env.DB_USER_DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 5,
//     maxIdle: 5, // 最大空闲连接数，默认等于 `connectionLimit`
//     idleTimeout: 60000, // 空闲连接超时，以毫秒为单位，默认值为 60000 ms
//     queueLimit: 0,
//     enableKeepAlive: true,
//     keepAliveInitialDelay: 0,
//   });
// }

// createPollConnection();

const sequelize = new Sequelize(process.env.DB_USER_DB_NAME, process.env.DB_USER_USER, process.env.DB_USER_PASSWORD, {
  host: process.env.DB_USER_HOST,
  port: process.env.DB_USER_PORT,
  dialect: "mysql",
  dialectModule: require("mysql2")
});

// const pool = mysql.createConnection({
//   host: process.env.DB_USER_HOST,
//   port: process.env.DB_USER_PORT,
//   user: process.env.DB_USER_USER,
//   password: process.env.DB_USER_PASSWORD,
//   database: process.env.DB_USER_DB_NAME,
// });

// // 定期发送心跳包
// setInterval(async () => {
//   try {
//     const promisePool = pool.promise();
//     await promisePool.execute('SELECT 1');
//   } catch (err) {
//     console.error('Heartbeat failed, attempting to reconnect...');
//     // 这里可以添加重连逻辑
//   }
// }, 40000); // 每40秒发送一次心跳

// // 监听错误事件
// pool.on('error', (err) => {
//   console.error('Connection pool has err = ', err);
//   if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//     // 这里可以添加重连逻辑
//     createPollConnection();
//   }
// });

export async function userSignin({ email, password }) {
  // 现在获取一个链接池的 Promise 包装实例
  // const promisePool = pool.promise();

  // 使用 Promise 查询数据库
  const passwordHash = md5(md5(password));
  // const passwordHash = password
  // const [rows, fields] = await promisePool.execute(
  //   "SELECT * FROM `ha_user` WHERE `email` = ? AND `password` = ?",
  //   [email, passwordHash]
  // );
  const rows = await sequelize.query('SELECT * FROM `ha_user` WHERE `email` = :email AND `password` = :password', {
    replacements: { email, password: passwordHash }, // 使用命名参数
    type: Sequelize.QueryTypes.SELECT
  })
  // console.log('rows = ', rows)

  if (rows && rows.length > 0) {
    const user = rows[0];
    const expireDate = Date.now() + EXPIRE_DATE;
    const token = jwt.sign(
      { sub: user.id, expire_date: expireDate },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    // console.log('login success token = ', token)
    // promisePool.execute('UPDATE `ha_user` SET `token` = ?, `expire_date` = ? WHERE `id` = ?', [token, expireDate, user.id]);
    const session = await db.session.findOne({ where: { userId: user.id } });
    if (!session) {
      await db.session.create({
        userId: user.id,
        token,
        expireDate,
      });
    } else {
      // session.token = token
      // session.expireDate = expireDate
      // await session.save()
      await db.session.update(
        { token, expireDate },
        {
          where: {
            userId: user.id,
          },
        }
      );
    }
    return {
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    };
  }
}

export async function validateJwt(jwtStr) {
  if (!jwtStr) {
    throw new Error("无权限操作，请先登入系统");
  }
  const decodedToken = jwt.verify(jwtStr, process.env.JWT_SECRET_KEY);
  // console.log("validate decode = ", decodedToken);
  if (!decodedToken || !decodedToken.sub) {
    throw new Error("登入信息无效，请重新登入");
  }
  const id = decodedToken.sub;
  const now = Date.now();
  if (decodedToken.expire_date < now) {
    throw new Error(`登入已过期，请重新登入`);
  }

  const session = await db.session.findOne({ where: { userId: id } });
  if (session) {
    const { token, expireDate } = session;
    // console.log('validate jwt session = ', session)
    if (token !== jwtStr) {
      let errMsg = `当前账号已在其他设备登入，请重新登入`
      const user = await getUserById(id).catch(err => null);
      if (user) {
        errMsg = `当前账号(${user.email})已在其他设备登入，请重新登入`
      }
      throw new Error(errMsg);
    }
    if (expireDate < Date.now()) {
      throw new Error(`登入已过期，请重新登入`);
    }
  } else {
    throw new Error("登入无效，请重新登入");
  }

  return true;
}

export async function getUserByJwt(token) {
  // console.log('decoded = ', decoded)
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const id = decodedToken.sub;
  const user = await getUserById(id);
  return user;
}

async function getUserById(id) {
  // const promisePool = pool.promise();
  // const [rows, fields] = await promisePool.execute(
  //   "SELECT * FROM `ha_user` WHERE id=?",
  //   [id]
  // );
  const rows = await sequelize.query('SELECT * FROM `ha_user` WHERE `id` = :id', { replacements: { id }, type: Sequelize.QueryTypes.SELECT })
  if (rows && rows.length === 1) {
    return {
      id: rows[0].id,
      email: rows[0].email,
      avatar: rows[0].avatar,
    };
  }
  return null;
}
