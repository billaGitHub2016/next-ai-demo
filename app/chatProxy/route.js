function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const encoder = new TextEncoder();

async function* makeIterator() {
  yield encoder.encode("<p>One</p>");
  await sleep(2000);
  yield encoder.encode("<p>Two</p>");
  await sleep(2000);
  yield encoder.encode("<p>Three</p>");
}

function getDataStream() {
  return fetch("https://baidu.com?wd=123")
    .then((response) => response.body)
}

export async function POST() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)
  console.log('~~~~~~~~~~~~stream =', stream)

  return new Response(stream)
    // const body = await getDataStream()

    // return new Response(body, {
    //     headers: {
    //         "Content-Type": "text/event-stream"
    //     }
    // })
}
