import React from 'react';
//import { Link } from 'react-router-dom';
//<div className="admin-panel-container">

var pageStyle = {
  //backgroundImage: 'url(' + imgUrl + ')',
  padding: "20px",
  margin: "20px"
  //WebkitTransition: 'all', // note the capital 'W' here
  //msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

const FAQs = () =>
{const eligible = localStorage.getItem("eligible");
  if ( eligible!=="true")
     {return (
<div style= {pageStyle}>
I am afraid you cannot view this page, please contact support@assentian.com
</div>
)

   }

   else
   {
const faqs = ["Fact 1", "fact 2", "fact 3"];
const listItems = faqs.map((faqs) =>
  <li>{faqs}</li>
);

return (

  <div style= {pageStyle}>
    <h1>FAQs</h1>
    <ul>{listItems}</ul>
  </div>
)
}

}
export default FAQs;
