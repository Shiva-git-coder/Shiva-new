import React, { useState, useEffect } from "react";
function Remainder(){
    

      const [response, setResponse] = useState(null);
      const [date, setDate] = useState("");
    
      useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem("medicationCheck"));
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    
        if (savedData && savedData.date === today) {
          setResponse(savedData.response);
          setDate(savedData.date);
        } else {
          setDate(today);
        }
      }, []);
    
      const handleResponse = (answer) => {
        const today = new Date().toISOString().split("T")[0];
        setResponse(answer);
        localStorage.setItem(
          "medicationCheck",
          JSON.stringify({ date: today, response: answer })
        );
      };
    
      if (response) {
        return <p>Thank you! You answered "{response}" for today.</p>;
      }
    
      return (
        <div>
          <h2>Have you taken your medication today?</h2>
          <button style={{backgroundColor:'green' , color:'white' ,padding:'5px 10px',border:'none',borderRadius:'5px',margin:'0px 2px'}} onClick={() => handleResponse("Yes")}>Yes</button>
          <button  style={{backgroundColor:'red' , color:'white' ,padding:'5px 10px',border:'none',borderRadius:'5px'}} onClick={() => handleResponse("No")}>No</button>
        </div>
      );
    };
    
    
export default Remainder;