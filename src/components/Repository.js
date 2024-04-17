import React from 'react';
//import { Link } from 'react-router-dom';
import {
 // BrowserRouter as Router,
 // Route,
} from 'react-router-dom';
import NavComponent from './navcomponent';
//import FAQs from './faqs';
//import Resources from './resources';
//<div className="admin-panel-container">

const pageStyle = {
  //backgroundImage: 'url(' + imgUrl + ')',
  padding: "80px",
  margin: "20px",
  textAlign: "justify",
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

const RepositoryPage = () =>
{const eligible = localStorage.getItem("eligible");
  if ( eligible!=="true")
     {return (
<div style={pageStyle}>
<h2> GDPR support repository information</h2>
<p> </p>
<p> You currently do not have access to the resources. Should you wish to use the services provided by Assentian please email support@assentian.com </p>
<p> Sample resources available are available on request. </p>


</div>
)

   }

   else
   {return (
<div>
     <navbar>
     <NavComponent />
     </navbar>
     <div style={pageStyle}>


       <h2>Welcome to the GDPR support repository</h2>
       <p> </p>
       <p> Click on the links above to look at common FAQs related to GDPR and to the resources and services offered by Assentian</p>
     </div>
</div>
)
}

}









export default RepositoryPage;
