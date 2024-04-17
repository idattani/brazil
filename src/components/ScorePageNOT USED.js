import React, { Component } from 'react';

//import AuthUserContext from './AuthUserContext';
import withAuthorization from './withAuthorization';
//import firebase from 'firebase';
//import { Link} from 'react-router-dom';
//import * as routes from '../constants/routes';

//import 'bootstrap/dist/css/bootstrap.min.css';
//import Select from 'react-select';
 //NB NOT USED

class ScorePage extends Component {


render() {
    
    return <h1>Hello </h1>;
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(ScorePage);

