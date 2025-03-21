import React from "react";
import { getFeedbacks } from "./services/feedbackservices";

const ReportForm = () => {
const [feedbacks, setFeedbacks] = React.useState([]);
  function getfeedbacks() {
    getFeedbacks().then((response) => { 
      console.log(response.data.message);
      setFeedbacks(response.data.message);
    }).catch((error) => {
        console.log(error);
      }
    );
  }
  getfeedbacks();
  return (
   hello
  );
};

export default insertfb;

