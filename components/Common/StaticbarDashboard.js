import Form from "@/app/Form";
import React, { useImperativeHandle, useRef, forwardRef } from "react";

const StaticbarDashboard = forwardRef((props, ref) => {
  const messageForm = useRef(null);

  useImperativeHandle(ref, () => ({
    messageForm,
  }))
  
  return (
    <>
      <div className="rbt-static-bar">
        <Form {...props} ref={messageForm}/>

        <p className="b3 small-text">
          ChatenAi can make mistakes. Consider checking important information.
        </p>
      </div>
    </>
  );
});

export default StaticbarDashboard;
