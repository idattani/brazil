import React, { Component } from 'react';

//import AuthUserContext from './AuthUserContext';
import withAuthorization from './withAuthorization';
import firebase from 'firebase';
import { Link} from 'react-router-dom';
import * as routes from '../constants/routes';

import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
 

//https://appdividend.com/2018/10/19/react-dropdown-select-example-tutorial/

//import { auth } from '../firebase';


const myLanguage = [
  { label: "English", value: "English" },
  { label: "Idioma Portugues", value: "Portugese" },

];

const myFunctionEnglish = [
  { label: "Privacy and Data Protection Assessment", value: "Privacy" },
  { label: "Security Assessment", value: "Security" },

];
const myFunctionPortugese = [
  { label: "Avaliação de Privacidade e Proteção de Dados", value: "Privacy" },
  { label: "Avaliação de segurança", value: "Security" },

];


class SelectionPage extends Component {
  constructor(props) {
  super(props);
 // history = useHistory(); 
  // Don't call this.setState() here!
  this.state = { selectedOptionLanguage: '', 
                  selectedOptionFunction: '', 
                  userExists:'' };
  this.handleChangeLanguage = this.handleChangeLanguage.bind(this);
  this.handleChangeFunction = this.handleChangeFunction.bind(this);
  this.notify = this.notify.bind(this);
  this.readFB = this.readFB.bind(this);
}



  handleChangeLanguage = (selectedOption) => {//runs on every keystroke
  
    this.setState({ selectedOptionLanguage:selectedOption.value }
     );
    //console.log("Option selected:"+selectedOption.label + "   "+ selectedOption.value);

  }

  handleChangeFunction = (selectedOption) => {//runs on every keystroke
    this.setState({ selectedOptionFunction:selectedOption.value });
    //console.error("Option selected:"+ selectedOption.label + "  "+selectedOption.value);
    //this.forceUpdate();
  }




  readFB= ()=>{
    firebase.auth().onAuthStateChanged((user) =>{
     if (user) {
         //console.log(user);
         var userId = firebase.auth().currentUser.uid; 
         //alert(userId);    //you should have your user here!

         var usersRef =  firebase.database().ref('/combinedusers/' + userId );
         usersRef.once("value").then( (snapshot)=> {
           let childData = snapshot.val();
            return childData;
           
       })
         .then( (childData) =>
         {//let l=childData.language;
         //let a=childData.assessment;
         //console.error(" assessment chosen  selection page  FB  "+ a)
         //alert(" l  " +l)
           this.setState({ userExists:'true'})
          // console.error(" userExists  "+ this.state.userExists)
         //alert(" l  " +l)
           }
        )
     } else {
         console.log('No user is signed in.');
     }
 });

 }







  // Don't call this.setState() here!
  componentDidMount= ()=>{
    firebase.auth().onAuthStateChanged((user) =>{
     if (user) {
         //console.log(user);
         var userId = firebase.auth().currentUser.uid; 
         //alert(userId);    //you should have your user here!

         var usersRef =  firebase.database().ref('/combinedusers/' + userId );
         usersRef.once("value").then( (snapshot)=> {
           let childData = snapshot.val();
            return childData;
           
       })
         .then( (childData) =>
         {var l=childData.language;
         var a=childData.assessment;
         console.error(" assessment chosen  selection page  mount "+ a)

         //alert(" l  " +l)
            this.setState((prevState) => { return {selectedOptionLanguage:l,selectedOptionFunction:a, userExists:'true'}}  //, () => this.clearResult(500) called immediately after
            , () => console.error(" setState called language "+ this.state.selectedOptionFunction)
            )
         }
        )
     } else {
         console.log('No user is signed in.');
     }
 });
//this.forceUpdate()
 }
  

notify = () => {
  //event.preventDefault();
  //if (this.state.userExists==='' ||this.state.userExists=== undefined){return;} 
  let userId = firebase.auth().currentUser.uid; //This is the firebase unique user ID
  //console.error('User  uid !  (notify) ' + userId);
//SEE https://stackoverflow.com/questions/40589397/firebase-db-how-to-update-particular-value-of-child-in-firebase-database
    
//console.error("iN NOTIFY  language " + this.state.selectedOptionLanguage)
//console.error("iN NOTIFY  function  " + this.state.selectedOptionFunction)
const usersRef = firebase.database().ref('/combinedusers/' + userId );
if(this.state.selectedOptionLanguage!== undefined && this.state.selectedOptionFunction!== undefined ){
    usersRef.update({'language': this.state.selectedOptionLanguage, 
      'assessment': this.state.selectedOptionFunction
     });

    }
    
  }



    
 

	render() {
    let languageChoice = this.state.selectedOptionLanguage;
    let assessmentChoice= this.state.selectedOptionFunction;
    //console.error(" in render  " +this.state.userExists)
    if(this.state.userExists===''){ //this.readFB(); 
      return (
        <div  >
                <h4 >Loading ......</h4>
                {/*{this.readFB()} */ }
                
                 </div>    
               
        );

    } 
    
    else{ 
  	return (
    	<div>
  
<br/><br/><br/>

              <div className="container">
              <div className="root">


              <p>Choose your preferred language
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src={ require('./britishflag.png')  } alt="" width="40" height="38"/>
              
                </p> 
              <p style={{ color: 'red' }}>Escolha o seu idioma preferido 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <img src={ require('./portugeseflag.png')  } alt="" width="40" height="22"/>
              </p>
   
              <div className="col-md-4" />
              <Select className="mt-4 col-md-3 col-offset-4"
                onChange={this.handleChangeLanguage}
                options={myLanguage}
                autoFocus={true}
              /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Selecione
              </div>
              </div>
              
  
  <p></p>
  <p></p>
  <p></p>
  
  <div className="container">
  <div className="root">
     

{languageChoice === "English" ? <p>  Choose if you want to conduct a privacy and data protection assessment or a security assessment </p> :""}

{languageChoice === "English"?  
  
<Select className="mt-4 col-md-3 col-offset-4"
  onChange={this.handleChangeFunction}
  options={myFunctionEnglish}
  autoFocus={true}
  /> 
      :""}


{languageChoice === "Portugese" ?  <p style={{ color: 'red' }}> Escolha se deseja realizar uma avaliação de privacidade ou segurança </p> :""}

  {languageChoice === "Portugese"?
<Select className="mt-4 col-md-3 col-offset-4"
  onChange={this.handleChangeFunction}
  options={myFunctionPortugese}
  autoFocus={true}
  />:""}
      </div>
    </div>
    { this.notify()}
    
    <div className="container">
  <div className="root">
    <div className="col-md-4  col-offset-16" />
    <p></p>
    &nbsp; &nbsp; &nbsp; 
    {languageChoice === "English" && assessmentChoice==='Privacy'? 
    <Link to={routes.HOME} className="btn btn-outline-primary  btn-lg ">GO!</Link>:""}

        {languageChoice === "English" && assessmentChoice==='Security'? 
    <Link to={routes.HOMESECURITY} className="btn btn-outline-primary btn-lg ">GO!</Link>:""}  
        {languageChoice === "Portugese" && assessmentChoice==='Privacy'? 
    <Link to={routes.HOMEPRIVACYP} className="btn btn-outline-primary btn-lg">IR!</Link>:""}
        {languageChoice === "Portugese" && assessmentChoice==='Security'? 
    <Link to={routes.HOMESECURITYP} className="btn btn-outline-primary btn-lg">IR!</Link>:""}

       </div>    </div>

 
 

</div>

    )
  } // end of else   
  }	
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(SelectionPage);


//<SelectionForm onSubmit={this.doSomething} />
// <button onClick={() => this.handleClick()}>Click Me!</button>
// then do not need to bind

/*
    <form className="mt-4 col-md-3 col-offset-4" onSubmit={this.handleSubmit}>
         
    {languageChoice === "English" ?  <p > After choosing language and assessment click "go" </p> :""}
    
    {languageChoice === "Portugese" ?  <p style={{ color: 'red' }}> Depois de escolher o idioma e a avaliação, clique em "ir" </p> :""}
         
    {languageChoice === "English" ? <button>Go!</button> :""}
    {languageChoice === "Portugese" ?  <button>Ir!</button> :""}

       </form>

*/

/*
//https://blog.logrocket.com/getting-started-with-react-select/
 handleSubmit = async (event) => {
  event.preventDefault();

  var userId = firebase.auth().currentUser.uid; //This is the firebase unique user ID
  console.log('User  uid !  (saveSubmit) ' + userId);


//SEE https://stackoverflow.com/questions/40589397/firebase-db-how-to-update-particular-value-of-child-in-firebase-database
    const usersRef = firebase.database().ref('/combinedusers/' + userId );

    usersRef.update({language: this.state.selectedOptionLanguage, 
      assessment: this.state.selectedOptionFunction
     });
 

  if(this.state.selectedOptionLanguage==='English' && 
  this.state.selectedOptionFunction=== 'Privacy') window.open('/Home');

  if(this.state.selectedOptionLanguage==='Portugese' && 
  this.state.selectedOptionFunction=== 'Privacy') window.open('/HomePrivacyP');

  if(this.state.selectedOptionLanguage==='English' && 
  this.state.selectedOptionFunction=== 'Security') window.open('/HomeSecurity');

  if(this.state.selectedOptionLanguage==='Portugese' && 
  this.state.selectedOptionFunction=== 'Security') window.open('/HomeSecurityP');

//alert ("this.state.selectedOptionFunction" + this.state.selectedOptionFunction)
//alert ("this.state.selectedOptionLanguage" + this.state.selectedOptionLanguage)
};


handleClick= (event) => {event.preventDefault();}
handleClose= (event) => {event.preventDefault();}

*/


/*


 Button = withRouter(({ history }) => (

  <button
    type='button'
    onClick={() => {
      
      {this.state.selectedOptionLanguage === "English" && this.state.selectedOptionFunction==='Privacy'? 
      history.push('/Home'):""}
  
          {this.state.selectedOptionLanguage === "English" && this.state.selectedOptionFunction==='Security'? 
          history.push('/HomeSecurity'):""}  
          {this.state.selectedOptionLanguage === "Portugese" && this.state.selectedOptionFunction==='Privacy'? 
          history.push('/HomePrivacyP'):""}
          {this.state.selectedOptionLanguage === "Portugese" && this.state.selectedOptionFunction==='Security'? 
          history.push('/HomeSecurityP'):""}
      history.push('/HomeSecurity') }}
  >
    Click Me!
  </button>
))

*/

