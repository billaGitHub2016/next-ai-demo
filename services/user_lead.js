import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

// 创建连接池，设置连接池的参数
const pool = mysql.createPool({
  host: process.env.DB_USER_HOST,
  user: process.env.DB_USER_USER,
  database: process.env.DB_USER_DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  maxIdle: 5, // 最大空闲连接数，默认等于 `connectionLimit`
  idleTimeout: 60000, // 空闲连接超时，以毫秒为单位，默认值为 60000 ms
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});


export async function userSignin({ email, password }) {
  // 现在获取一个链接池的 Promise 包装实例
  const promisePool = pool.promise();

  // 使用 Promise 查询数据库
  const [rows, fields] = await promisePool.execute(
    'SELECT * FROM `ha_user` WHERE `email` = ? AND `password` = ?',
    [email, password]
  );

  if (rows && rows.length > 0) {
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });   
    return {
        user: rows[0],
        token
    }
  }
}