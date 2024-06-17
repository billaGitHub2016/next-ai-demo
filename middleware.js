import { NextResponse } from 'next/server'
// import { getUserByJwt } from './services/user'
 
export async function middleware(request) {
  // let cookie = request.cookies.get('jwt')
  // const jwt = cookie?.value;
  // // console.log('~~~~~~~~~~~~~~~~~~~~middleware, jwt = ', jwt)
  // if (jwt) {
  //   // const user = await getUserByJwt(jwt).catch(error => {});
  //   // if (user) {
  //   //   return NextResponse.next()
  //   // }
  //   return NextResponse.next()
  // }
  // return NextResponse.redirect(new URL('/authPage', request.url))
  return NextResponse.next()
}
 
export const config = {
  // matcher: ['/chatProxy'],
}