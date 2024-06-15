import jwt from 'jsonwebtoken';
import { db } from '../db'
export const userSignin = async ({ email, password }) => {
  const user = await db.user.findOne({ where : { email, password }, attributes: ['id', 'email', 'avatar'], raw: true })
  if (user) {
    // 生成7天有效的token
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    return { user, token }
  }
}

export const getUserByJwt = async (token) => {
  console.log('token = ', token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log('decoded = ', decoded)
  const user = await db.user.findOne({ where: { id: decoded.sub }, attributes: ['email', 'avatar'], raw: true });
  return user;
}
