import React from "react";
import { createFeedback } from "../services/feedbackservices";

const Insertfb = () => {
  const [reporttype, setReporttype] = React.useState("");
  const [file, setFile] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  function insertfb(e) {
    e.preventDefault();
    const feedback = {
      
      "date":"20.2.2022",
   "reporttype":reporttype,
   "file":file,
   "subject":subject,
   "message":message
   }
   if(reporttype==""||file==""||subject==""||message==""){
    window.alert("Please fill all the fields");
    return;
  }
   createFeedback(feedback).then((response) => {
    console.log(response.data.message);
  }).catch((error) => {
      console.log(error);
    }
  );
   
  }

  return (
    <div>   
    <form style={{textAlign:"center",marginTop:"50px", border:"2px solid black", padding:"20px", width:"30%", margin:"auto"}}>  
      <h1>Feedback Form</h1> <br/>
      <select name="reporttype" value={reporttype} onChange={(e) => setReporttype(e.target.value)} required>
          <option value="">Select Report Type</option>
          <option value="Bug Report">Bug Report</option>
          <option value="Feature Request">Feature Request</option>
          <option value="General Feedback">General Feedback</option>
        </select>
        <br /><br />
      <input type="date" placeholder="Date" name="date" required/><br/><br/>
      <input type="text" placeholder="File" name="file" onChange={(e)=>setFile(e.target.value)} required/><br/><br/>
      <input type="text" placeholder="Subject" name="subject" onChange={(e)=>setSubject(e.target.value)} required/><br/><br/>
      <textarea placeholder="Message" name="message" onChange={(e)=>setMessage(e.target.value)} required/><br/><br/>
      <button type="submit" onClick={insertfb}>Submit</button>

    </form>
  </div>
  );
};

export default Insertfb;