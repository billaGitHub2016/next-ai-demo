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
  const requestUrl = new URL(request.url)
  const message = requestUrl.searchParams.get("message")
  const user_id = requestUrl.searchParams.get("user_id")
  const flag = requestUrl.searchParams.get("flag")
  const signature = requestUrl.searchParams.get("signature")

  const apiUrl = `http://13.73.239.158:3000/proxyChat?message=${encodeURI(message)}&user_id=${encodeURI(user_id)}&flag=${encodeURI(flag)}&sign=${encodeURI(signature)}`
  const stream = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "text/event-stream",  
    }
  }).then(res => res.body)

  return new Response(stream)
}