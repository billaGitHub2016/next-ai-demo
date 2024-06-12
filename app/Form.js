import React, { useState } from "react";  
import { Tooltip } from "react-tooltip";  
import { createSignature } from '@/app/utils/createSignature'
  
const Form = (props) => {  
  const [message, setMessage] = useState("");  
  
  const handleSendMessage = async (e) => {
    e.preventDefault();  
  
    if (!message.trim()) {  
      alert("Please enter a message.");  
      return;  
    }

    const topicId = new Date().getTime();
    props.onStartChat({
      id: topicId,
      topic: message
    })
  
    try {  
      console.log('inside the hanlde message fun')
      const params = {
        'message':message,
        'user_id': '12',
        'flag':'1'
      };
      const signature = createSignature(params);  
      const params_for_posting={...params,'signature':signature}
      const response = await fetch("/chatProxy", {  
        method: "POST",  
        headers: {  
          "Content-Type": "text/event-stream",  
        },  
        body: JSON.stringify({ params_for_posting }),  
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
                chunks += decodeValue;

                props.onResponse({
                  id: topicId,
                  text: decodeValue
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
  
  return (  
    <>  
      {/* <Tooltip id="my-tooltip" className="custom-tooltip tooltip-inner" />   */}
      <form className="new-chat-form border-gradient" onSubmit={handleSendMessage}>  
        <textarea  
          rows="1"  
          placeholder="Send a message..."  
          value={message}  
          onChange={(e) => setMessage(e.target.value)}
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
            <input type="file" className="input-file" name="myfile" multiple />  
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
};  
  
export default Form;  