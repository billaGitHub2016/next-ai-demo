import React, { useState, useImperativeHandle, useRef, forwardRef, useEffect, useCallback } from "react";  
import { Tooltip } from "react-tooltip";  
import { createSignature } from '@/app/utils/createSignature'
import { useAppContext } from '@/context/Context';

const Form = forwardRef((props, ref) => {
  const [message, setMessage] = useState("");  
  const [loading, setLoading] = useState(false)
  const textInputRef = useRef()
  const { user } = useAppContext();
  const  newsDetailEventHandler = useCallback((e) => {
    console.log('go to detail = ', e)
    const question = e?.detail?.question
    if (question) {
      regenerateMessage(question)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('newsDetailEvent', newsDetailEventHandler);

    return () => {
      document.removeEventListener('newsDetailEvent', newsDetailEventHandler);
    }
  }, [])

  const handleSendMessage = async (e) => {
    if (e) {
      e.preventDefault();  
    }
  
    if (!message.trim()) {  
      alert("Please enter a message.");  
      return;  
    }

    const messgeCopy = message.trim()
    setMessage('') // Clear the textarea after sending the message
    setLoading(true)

    const topicId = new Date().getTime();
    props.onStartChat({
      id: topicId,
      topic: messgeCopy
    })
  
    try {  
      console.log('inside the hanlde message fun')
      const params = {
        'message':messgeCopy,
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
      // console.log(response)

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
                // console.log(done, value);
                const decodeValue = utf8decoder.decode(value)
                // console.log(decodeValue);
                let removeFormatValue = decodeValue;
                removeFormatValue = removeFormatValue.replace(/data: /gm, '');
                removeFormatValue = removeFormatValue.replace(/\n\n/gm, '');
                chunks += removeFormatValue

                props.onResponse({
                  id: topicId,
                  text: removeFormatValue
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

      if (user) {
        fetch('/apis/topicLog', {
          method: "POST",
          body: JSON.stringify({ topic: props.topic, topicLog: { question: message.trim(), answer: text } }),
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        }).then(res => res.json()).catch(err => {
          
        })
      }

      props.onFinishChat({
        id: topicId
      })
  
      // if (!response.ok) {  
      //   throw new Error("Network response was not ok");  
      // }  
  
      // const data = await response.json();
      // console.log("Message sent successfully:", data);  
    } catch (error) {  
      console.error("Error sending message:", error);
    } finally {
      setLoading(false)
      if (window.innerWidth > 768) {
        // 可能是移动端浏览器
        setTimeout(() => {
          textInputRef.current?.focus()
        }, 100)
      }
    }
  };
  
  const regenerateMessage = async (message) => {
    if (!message.trim()) {  
      alert("Please enter a message.");  
      return;  
    }

    setLoading(true)

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
                let removeFormatValue = decodeValue;
                removeFormatValue = removeFormatValue.replace(/data: /gm, '');
                removeFormatValue = removeFormatValue.replace(/\n\n/gm, '');
                chunks += removeFormatValue

                props.onResponse({
                  id: topicId,
                  text: removeFormatValue
                });
                
                push();
              });
            }
            push();
          },
        });  
      })
      
      if (user) {
        fetch('/apis/topicLog', {
          method: "POST",
          body: JSON.stringify({ topic: props.topic, topicLog: { question: message.trim(), answer: text } }),
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        }).then(res => res.json()).catch(err => {
          
        })
      }

      props.onFinishChat({
        id: topicId
      }) 
    } catch (error) {  
      console.error("Error regenerate message:", error);
    } finally {
      setLoading(false)
      if (window.innerWidth > 768) {
        // 可能是移动端浏览器
        setTimeout(() => {
          textInputRef.current?.focus()
        }, 100)
      }
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
          disabled={loading}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage()
            }
          }}
          ref={textInputRef}
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
            disabled={loading}
          >  
            <i className="feather-send"></i>  
          </button>  
        </div>  
      </form>  
    </>  
  );  
});  

export default Form;  