import { cookies } from 'next/headers';
import { userSignin, EXPIRE_DATE, getUserByJwt, validateJwt } from '../../../services/user_lead';

export async function POST(request) {
    // const requestUrl = new URL(request.url)
    const body = await request.json();
    const result = await userSignin({ email: body.email, password: body.password });
    const maxAge = EXPIRE_DATE / 1000; // 有效期7天

    if (result) {
        return new Response(
            JSON.stringify({
                code: '0',
                data: {
                    user: {
                        ...result.user,
                        id: undefined
                    },
                },
                message: '登录成功',
            }),
            {
                headers: {
                    'Set-Cookie': `jwt=${result.token}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Strict`,
                    'Content-type': 'application/json',
                },
            }
        );
    } else {
        return new Response(
            JSON.stringify({
                code: '1',
                message: '用户名或密码错误',
            }),
            {
                headers: {
                    'Content-type': 'application/json',
                },
            }
        );
    }
}

export async function GET(request) {
    // const requestUrl = new URL(request.url)
    let msg = ''
    const jwt = cookies().get('jwt')?.value;
    // console.log('jwt = ', jwt);
    if (jwt) {
        try {
            await validateJwt(jwt)
        } catch (err) {
            return new Response(
                JSON.stringify({
                    code: '1',
                    message: err.message,
                }),
                {
                    status: 401,
                    headers: {
                        'Content-type': 'application/json',
                    },
                }
            );
        }
        const user = await getUserByJwt(jwt).catch(error => {});
        if (user) {
          return new Response(
              JSON.stringify({
                  code: '0',
                  data: {
                      user,
                  },
                  message: '成功',
              }),
              {
                  headers: {
                      'Content-type': 'application/json',
                  },
              }
          );
        } else {
          msg = '用户不存在'
        }
    }

    return new Response(
        JSON.stringify({
            code: '1',
            message: '查询用户失败：' + msg,
        }),
        {
            headers: {
                'Content-type': 'application/json',
            },
        }
    );
}
