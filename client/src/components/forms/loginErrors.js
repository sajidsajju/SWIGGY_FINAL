import React from "react";

const Error = ({ touched, message }) => {
  if (!touched) {
    return <div>&nbsp;</div>;
  }

  if (message) {
    return <div style={{ color: "#d8000c" }}>{message}</div>;
  }

  return <div style={{ color: "#36454f" }}>Perfect</div>;
};
export default Error;
