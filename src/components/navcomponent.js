import React from 'react';
//import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import * as routes from '../constants/routes';

export default class NavComponent extends React.Component {
    render(){
       return(
         <nav>
         <ul class="topnav">

           <li>  <Link to = {routes.FAQS}> FAQs </Link> </li>
          <li><Link to = {routes.RESOURCES}> Resources </Link></li>
         </ul>
        </nav>



        )
     }
}
