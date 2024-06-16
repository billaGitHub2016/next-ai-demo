import React, { useState, useImperativeHandle, useRef, forwardRef } from "react";  
import { Tooltip } from "react-tooltip";  
import { createSignature } from '@/app/utils/createSignature'

const Form = forwardRef((props, ref) => {
  const [message, setMessage] = useState("");  

  const handleSendMessage = async (e) => {
    if (e) {
      e.preventDefault();  
    }
  
    if (!message.trim()) {  
      alert("Please enter a message.");  
      return;  
    }

    const topicId = new Date().getTime();
    props.onStartChat({
      id: topicId,
      topic: message.trim()
    })
  
    try {  
      console.log('inside the hanlde message fun')
      const params = {
        'message':message.trim(),
        'user_id': '12',
        'flag':'1'
      };

      const signature = createSignature(params);  
      const params_for_posting={...params,'signature':signature}
      const query = new URLSearchParams(params_for_posting).toString();
      const response = await fetch(`/chatProxy?${query}`, {  
        method: "GET",  
        headers: {  
          "Content-Type": "text/event-stream",
          "cache": "no-cache",
        },  
      });  
      console.log('before the response..')
      console.log(response)

      const reader = response.body.getReader();
      const utf8decoder = new TextDecoder(); 
      const text = await new Promise((resolve) => {
        new ReadableStream({
          start(controller) {
            let chunks = ''
            // The following function handles each data chunk
            function push() {
              // "done" is a Boolean and value a "Uint8Array"
              reader.read().then(({ done, value }) => {
                // If there is no more data to read
                if (done) {
                  console.log("done", done);
                  controller.close();
                  return resolve(chunks);
                }
                // Get the data and send it to the browser via the controller
                controller.enqueue(value);
                // Check chunks by logging to the console
                console.log(done, value);
                const decodeValue = utf8decoder.decode(value)
                console.log(decodeValue);
                const removeFormatValue = decodeValue.replace(/data:/ig, '');
                const removeSpacesInTags = (htmlString) => {
                  // 正则表达式匹配所有HTML标签，并去除标签名中的空格
                  return htmlString.replace(/<\s*(\w+)(\s*[^>]*)?>/g, (match, tagName, rest) => {
                    // 去除标签名中的空格
                    const cleanTagName = tagName.replace(/\s+/g, '');
                    // 重组标签，去除空格
                    return `<${cleanTagName}${rest ? rest : ''}>`;
                  });
                }
                // const removeSpacesInHref = (htmlString) => {
                //   const regex = /<a\s?\\n?href="([^"]*)">/;
                //   const match = htmlString.match(regex);

                //   if (match) {
                //     // 去除匹配到的href值中的所有空白字符（包括换行符）
                //     const hrefValue = match[1].replace(/[\r\n\t ]+/g, '');
                //     console.log(hrefValue);
                //   }
                // }
                let formatTagValue = removeSpacesInTags(removeFormatValue)
                // const formatHrefValue = removeSpacesInHref(formatTagValue)
                console.log('formatTagValue = ', formatTagValue);
                chunks += formatTagValue

                props.onResponse({
                  id: topicId,
                  text: formatTagValue
                });
                
                push();
              });
            }
            push();
          },
        });  
      })
      console.log('after the response..')       
      console.log('text = ', text)

      fetch('/apis/topicLog', {
        method: "POST",
        body: JSON.stringify({ topic: props.topic, topicLog: { question: message.trim(), answer: text } }),
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }).then(res => res.json()).catch(err => {
        
      })

      props.onFinishChat({
        id: topicId
      })
  
      // if (!response.ok) {  
      //   throw new Error("Network response was not ok");  
      // }  
  
      // const data = await response.json();
      // console.log("Message sent successfully:", data);  
      setMessage(""); // Clear the textarea after sending the message  
    } catch (error) {  
      console.error("Error sending message:", error);
    }  
  };
  
  const regenerateMessage = async (message) => {
    if (!message.trim()) {  
      alert("Please enter a message.");  
      return;  
    }

    const topicId = new Date().getTime();
    props.onStartChat({
      id: topicId,
      topic: message.trim()
    })
  
    try {  
      console.log('inside the hanlde message fun')
      const params = {
        'message':message.trim(),
        'user_id': '12',
        'flag':'1'
      };

      const signature = createSignature(params);  
      const params_for_posting={...params,'signature':signature}
      const query = new URLSearchParams(params_for_posting).toString();
      const response = await fetch(`/chatProxy?${query}`, {  
        method: "GET",  
        headers: {  
          "Content-Type": "text/event-stream",
          "cache": "no-cache",
        },  
      });  
      console.log('before the response..')
      console.log(response)

      const reader = response.body.getReader();
      const utf8decoder = new TextDecoder(); 
      const text = await new Promise((resolve) => {
        new ReadableStream({
          start(controller) {
            let chunks = ''
            // The following function handles each data chunk
            function push() {
              // "done" is a Boolean and value a "Uint8Array"
              reader.read().then(({ done, value }) => {
                // If there is no more data to read
                if (done) {
                  console.log("done", done);
                  controller.close();
                  return resolve(chunks);
                }
                // Get the data and send it to the browser via the controller
                controller.enqueue(value);
                // Check chunks by logging to the console
                console.log(done, value);
                const decodeValue = utf8decoder.decode(value)
                console.log(decodeValue);
                const removeFormatValue = decodeValue.replace(/data:/ig, '');
                const removeSpacesInTags = (htmlString) => {
                  // 正则表达式匹配所有HTML标签，并去除标签名中的空格
                  return htmlString.replace(/<\s*(\w+)(\s*[^>]*)?>/g, (match, tagName, rest) => {
                    // 去除标签名中的空格
                    const cleanTagName = tagName.replace(/\s+/g, '');
                    // 重组标签，去除空格
                    return `<${cleanTagName}${rest ? rest : ''}>`;
                  });
                }
                // const removeSpacesInHref = (htmlString) => {
                //   const regex = /<a\s?\\n?href="([^"]*)">/;
                //   const match = htmlString.match(regex);

                //   if (match) {
                //     // 去除匹配到的href值中的所有空白字符（包括换行符）
                //     const hrefValue = match[1].replace(/[\r\n\t ]+/g, '');
                //     console.log(hrefValue);
                //   }
                // }
                let formatTagValue = removeSpacesInTags(removeFormatValue)
                // const formatHrefValue = removeSpacesInHref(formatTagValue)
                chunks += formatTagValue

                props.onResponse({
                  id: topicId,
                  text: formatTagValue
                });
                
                push();
              });
            }
            push();
          },
        });  
      })

      fetch('/apis/topicLog', {
        method: "POST",
        body: JSON.stringify({ topic: props.topic, topicLog: { question: message.trim(), answer: text } }),
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }).then(res => res.json()).catch(err => {
        
      })

      props.onFinishChat({
        id: topicId
      }) 
    } catch (error) {  
      console.error("Error regenerate message:", error);
    }  
  }

  useImperativeHandle(ref, () => ({
    regenerateMessage,
  }))
  
  return (  
    <>  
      {/* <Tooltip id="my-tooltip" className="custom-tooltip tooltip-inner" />   */}
      <form className="new-chat-form border-gradient" onSubmit={handleSendMessage}>  
        <textarea  
          rows="1"  
          placeholder="Send a message..."  
          value={message}  
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage()
            }
          }}
        ></textarea>  
        <div className="left-icons">  
          <div title="ChatenAI" className="form-icon icon-gpt">  
            <i className="feather-aperture"></i>  
          </div>  
        </div>  
        <div className="right-icons">  
          <div  
            className="form-icon icon-plus"  
            data-tooltip-id="my-tooltip"  
            data-tooltip-content="Choose File"  
          >  
            <input type="file" className="input-file" name="myfile" multiple/>  
            <i className="feather-plus-circle"></i>  
          </div>  
          <a  
            className="form-icon icon-mic"  
            data-tooltip-id="my-tooltip"  
            data-tooltip-content="Voice Search"  
          >  
            <i className="feather-mic"></i>  
          </a>  
          <button  
            type="submit"  
            className="form-icon icon-send"  
            data-tooltip-id="my-tooltip"  
            data-tooltip-content="Send message"

          >  
            <i className="feather-send"></i>  
          </button>  
        </div>  
      </form>  
    </>  
  );  
});  
  
export default Form;  