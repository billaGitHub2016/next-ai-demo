import { NextResponse } from 'next/server'
// import { getUserByJwt } from './services/user'
 
export async function middleware(request) {
  let cookie = request.cookies.get('jwt')
  const jwt = cookie?.value;
  console.log('~~~~~~~~~~~~~~~~~~~~middleware, jwt = ', jwt)
  if (jwt) {
    // const user = await getUserByJwt(jwt).catch(error => {
    //   console.error('~~~~~~~~ user error = ', error)
    // });
    // console.log('~~~~~~~~~~~~~~~~~~~~user = ', user)
    // if (user) {
    //   return NextResponse.next()
    // }
    // return NextResponse.next()
  }
  return new NextResponse(JSON.stringify({
    code: '401',
    message: '无权限操作，请先登录'
  }), {
    status: 401
  })
}
 
export const config = {
  matcher: ['/chatProxy', '/apis/topic'],
}