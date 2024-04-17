import React from 'react';
//import { Link } from 'react-router-dom';
//<div className="admin-panel-container">

//   {window.open('https://drive.google.com/file/d/0B6J2xjf5LANvVmxEN1lMenZyUzhfR3l5c3NZVGFuV3VkZDhn/view?usp=sharing', "_blank") }

const urlFile1='https://drive.google.com/file/d/0B6J2xjf5LANvVmxEN1lMenZyUzhfR3l5c3NZVGFuV3VkZDhn/view?usp=sharing'

const pageStyle = {
  //backgroundImage: 'url(' + imgUrl + ')',
  padding: "80px",
  margin: "20px",
  textAlign: "justify",
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

const Resources = () =>

{const eligible = localStorage.getItem("eligible");
  if ( eligible!=="true")
     {return (
<div style={pageStyle}>
I am afraid you cannot view this page, please contact support@assentian.com
</div>
)

   }

   else
   {return (
     <div style={pageStyle} >
       <h2>Resources</h2>
       <p> resource A <span>&nbsp;&nbsp; </span>
       <a href={urlFile1} download>  Click to download </a>
       </p>
       <p>
        resource B <span>&nbsp;&nbsp; </span>
       <a href={urlFile1} download>  Click to download </a>
       </p>



     </div>
)
}

}




export default Resources;
/*
<Link to='https://drive.google.com/file/d/0B6J2xjf5LANvVmxEN1lMenZyUzhfR3l5c3NZVGFuV3VkZDhn/view?usp=sharing' onClick={e => e.preventDefault()}
>
 </Link>

 //{window.open(file1)}
 */
