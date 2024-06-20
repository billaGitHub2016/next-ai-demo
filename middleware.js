import { NextResponse } from 'next/server'
// import { getUserByJwt } from './services/user'
 
export async function middleware(request) {
  let cookie = request.cookies.get('jwt')
  const token = cookie?.value;
  // console.log('~~~~~~~~~~~~~~~~~~~~middleware, token = ', token)
  if (process.env.AI_API_AUTH === 'N' && (request.url.indexOf('/chatProxy') > -1)) {
    // console.log('不校验@@@@@@@@@@@@@@@@@@@')
    return NextResponse.next()
  }
  if (token) {   
    return NextResponse.next()
    // const user = await getUserByJwt(jwt).catch(error => {
    //   console.error('~~~~~~~~ user error = ', error)
    // });
    // console.log('~~~~~~~~~~~~~~~~~~~~user = ', user)
    // if (user) {
    //   return NextResponse.next()
    // }
  }
  return new NextResponse(JSON.stringify({
    code: '401',
    message: '无权限访问，请先登录'
  }), {
    status: 401
  })
}

// const matcher = ['/apis/topic']

export const config = {
  matcher: ['/apis/topic', '/chatProxy']
}