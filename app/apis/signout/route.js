import { cookies } from 'next/headers';

export async function GET(request) {
    cookies().delete('jwt');
    return new Response(
      JSON.stringify({
          code: '0',
          message: '登出成功',
      }),
      {
          headers: {
              'Content-type': 'application/json',
          },
      }
  );
}