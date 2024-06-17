// function iteratorToStream(iterator) {
//   return new ReadableStream({
//     async pull(controller) {
//       const { value, done } = await iterator.next();

//       if (done) {
//         controller.close();
//       } else {
//         controller.enqueue(value);
//       }
//     },
//   });
// }

// function sleep(time) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, time);
//   });
// }

// const encoder = new TextEncoder();

// async function* makeIterator() {
//   yield encoder.encode("<p>One</p>");
//   await sleep(2000);
//   yield encoder.encode("<p>Two</p>");
//   await sleep(2000);
//   yield encoder.encode("<p>Three</p>");
// }

// export async function POST() {
//   const iterator = makeIterator()
//   const stream = iteratorToStream(iterator)
//   return new Response(stream)
// }

export async function GET(request) {
    const requestUrl = new URL(request.url);
    const message = requestUrl.searchParams.get('message');
    const user_id = requestUrl.searchParams.get('user_id');
    const flag = requestUrl.searchParams.get('flag');
    const signature = requestUrl.searchParams.get('signature');

    let apiUrl = `http://13.73.239.158:3000/proxyChat?message=${encodeURI(
        message
    )}&user_id=${encodeURI(user_id)}&flag=${encodeURI(flag)}&sign=${encodeURI(signature)}`;
    if (process.env.RUN_ENV !== 'DEV') {
        apiUrl = `http://104.46.232.133/api/demo/chat?message=${encodeURIComponent(
            message
        )}&user_id=${encodeURIComponent(user_id)}&sign=${encodeURIComponent(
            signature
        )}&flag=${encodeURIComponent(flag)}`;
    }

    try {
        // 发起请求到目标URL
        const response = await fetch(apiUrl);

        if (!response.ok) {
            // 如果响应状态码不是200-299，返回错误
            // return res.status(response.status).json({ error: 'Failed to fetch resource' });
            return new Response(JSON.stringify({ error: 'Failed to fetch resource' }), {
                status: response.status,
            });
        }

        // 转发响应头（除了'content-length'和'transfer-encoding'）
        const headers = Object.keys(response.headers)
            .filter(
                key =>
                    key.toLowerCase() !== 'content-length' &&
                    key.toLowerCase() !== 'transfer-encoding'
            )
            .reduce((acc, key) => {
                acc[key] = response.headers[key];
                return acc;
            }, {});

        // 设置响应头
        // res.status(200).set(headers);
        return new Response(response.body, { status: 200, headers });

        // // 将目标服务器的流式响应转发给客户端
        // response.body.pipe(res);
    } catch (error) {
        // 请求失败时返回错误
        console.error('请求失败:', error);
        // res.status(500).json({ error: '请求失败' });
        return new Response(JSON.stringify({ error: '请求失败' }), { status: 500 });
    }
}
