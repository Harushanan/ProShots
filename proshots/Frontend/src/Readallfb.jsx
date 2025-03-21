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
    <div>
      <h1>lol</h1>
      <table border={1}>
      <th>Id</th><th>name</th><th>subject</th><th>Date</th>
       {feedbacks.map((feedback) => (
        
      <tr> 
        <td> feedback </td>
      <td>{feedback.file}ggf</td>
      <td>{feedback.subject}</td>
      <td>{feedback.message}</td>
      <td>{feedback.date}</td>
      </tr>
      
      ))} 
      </table>
    </div>
  );
};

export default Readallfb;

