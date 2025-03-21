import React from "react";
import {getdelivery} from "../services/deliveryservices"; 

const Deliveryadmin = () => {
const [delivery, setdelivery] = React.useState([]);
  function getdeliverys() {
    getdelivery().then((response) => { 
      console.log(response.data.message);
      setdelivery(response.data.message);
    }).catch((error) => {
        console.log(error);
      }
    );
  }
  getdeliverys();   
  return ( <div>
      <table border={1}>
      <th>date</th><th> prodect</th><th>quantity</th><th>adress</th><th>phone</th><th>accept</th><th>onthe way</th><th>delivered</th>
       {delivery.map((delivery) => (
        
      <tr> 
        <td>{delivery.date}</td>
        <td>{delivery.prodect}</td>
      <td>{delivery.quantity}</td>
      <td>{delivery.adress}</td>
      <td>{delivery.phone}</td>
      <td><button></button></td> <td><button></button></td><td><button></button></td>

      </tr>
      
      ))} 
      </table>
    </div>
  );
};

export default Deliveryadmin;