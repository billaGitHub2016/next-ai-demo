import Form from "@/app/Form";
import React from "react";

const StaticbarDashboard = (props) => {
  return (
    <>
      <div className="rbt-static-bar">
        <Form {...props} />

        <p className="b3 small-text">
          ChatenAi can make mistakes. Consider checking important information.
        </p>
      </div>
    </>
  );
};

export default StaticbarDashboard;
