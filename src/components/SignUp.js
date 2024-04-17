import React, { Component, useState  } from 'react';
import { Link,withRouter, } from 'react-router-dom';

import * as routes from '../constants/routes';
import { auth } from '../firebase';
import firebase from 'firebase';

import { Form } from 'semantic-ui-react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { COUNTRIES } from '../constants/countries.js';

const db = firebase.firestore();


const styles = (theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	progess: {
		position: 'absolute'
	}
});


const INITIAL_STATE = {
  username: '',
  company: '',
  telephoneNumber: '',
  eligible: '',
  email: '',
  shouldemail: 'no',
  shouldemailSecurity:'no',
  questionnaire:"[0,0,0,0,0,0,0,0,0,0,   0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0]",
  questionnaireSecurity:"[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,   -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,  -1]",
  passwordOne: '',
  passwordTwo: '',
  currentQuestion: '0',
  currentQuestionSecurity: '0',
  cyberInsuranceQuestionnaire: {
    answers: [{
      address: '',
      annualRevenue: '',
      companyName: '',
      registrationNumber: '',
      revenueFromUSA: '',
      sector: '',
      website: ''
    }, 0,0,0,0,0,0,0,0,0,0,0],
    currentQuestion: '0',
    currentSection: '0'
  },
  currentBlock:'0',
  error: null,
  language:"Portugese",
  loading: false
};





const MyComponent= (props)=>{

  const { t, i18n } = useTranslation();
  const [l,setLanguage]=useState("none");
  return (<div> <h4>Please choose your language/Por favor escolha seu idioma </h4>  
      
    <Form.Group inline>
     <label>{t("Language Choice")}</label>
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Form.Radio label="English" checked={l === 'en'} value="en" 
     onClick={() => {setLanguage('en'); props.setMyLanguage("English");
     i18n.changeLanguage("en");} }/>
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Form.Radio label="Portugese" checked={l === 'por'} value="por" 
     onClick={() => {setLanguage('por'); props.setMyLanguage("Portugese");
      i18n.changeLanguage("por")} }/>
    </Form.Group>


   </div>)
}



const SignUpPage = ({ history }) =>{

  const { t, i18n } = useTranslation();

return(
  <div>
    {/* <h4>Sign Up Here To Start a Risk Assessment/Inscreva-se aqui para iniciar uma avaliação de risco</h4> */}
    <SignUpForm history={history} t={t} i18n = {i18n} />
    <div style={{marginBottom: "25px", color: '#02397f'}}>
      <Typography variant="caption">
        {t("Please enter")}
      </Typography>
      <Typography variant="caption">
        {t("The report will be sent to the email address that you provide here.")}
      </Typography>
      <Typography variant="caption">
        {t("After signing up you simply sign out whenever you want you can sign in again to complete the assessment.")}
      </Typography>
    </div>

  </div>
)}

  const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});


class SignUpForm extends Component {

  constructor(props) {
    super(props);
    const { i18n } = this.props;
    this.state = { ...INITIAL_STATE, language: i18n.language };
    this.setMyLanguage = this.setMyLanguage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  //setMyLanguage=(v) =>{this.setState({lan:v}) }
  setMyLanguage=(v) =>{this.setState({language:v}) }

  onSubmit =  (event) => {
    const {
      username,
      company,
      telephoneNumber,
      eligible,
      email,
      shouldemail,
      shouldemailSecurity,
      questionnaire,
      questionnaireSecurity,
      passwordOne,
      currentQuestion,
      currentQuestionSecurity,
      cyberInsuranceQuestionnaire,
      currentBlock,
      language,
      country,
      companySize
      } = this.state;


 


    const {
          history
        } = this.props;
        console.log('props', this.props);

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)

//*******************************************************

.then ( ()=>{
   firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.error("email of user  signed in SignUpPage  " + user.email);
    console.error("firebase uid of user Sign Up  " + user.uid);

      //var ref = firebase.database().ref('/combinedusers/' + user.uid);
      //console.log("firebase reference   " + ref);

      const sud=new Date().toJSON();
// username contains the name to be used to address the person
      const cust = {
        username: username,
        company: company,
        telephoneNumber: telephoneNumber,
        id: user.email,
        signupdate: sud,
        questionnaire:questionnaire,
        questionnaireSecurity:questionnaireSecurity,
        shouldemail: shouldemail,
        shouldemailSecurity: shouldemailSecurity,
        date: new Date().toJSON(),
        eligible: eligible,
        currentQuestion: currentQuestion,
        currentQuestionSecurity: currentQuestionSecurity,
        cyberInsuranceQuestionnaire: cyberInsuranceQuestionnaire,
        currentBlock:currentBlock,
        language:language,
        companySize,
        country,
        isAdmin: false,
        }

        //console.error("langage chosen   " + language);
// isOpen: false,refresh:0

         // const usersRef = firebase.database().ref('combinedusers/' + user.uid);
          //usersRef.set(cust);

  firebase.database().ref('/combinedusers/' + user.uid  ).set(cust);

  
  db.collection("users").doc(user.uid).set({
    fullName: username,
    company,
    telephoneNumber,
    language,
    companySize,
    email,
    country,
    password: passwordOne,
    isPrivacySurveyCompleted: false,
    isSecuritySurveyCompleted: false,
    isCyberInsuranceApplicationCompleted: false,
    isAdmin: false,
    dashboardEmailSent: false,
    displayDashboardNotification: false,
    displayDashboardDialog: true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
      console.log("User successfully created!");
  })
  .catch((error) => {
      console.error("Error writing document: ", error);
  });
        
 


/*
  const u = {  username:username }
  //const usersRef = firebase.database().ref('users/' + user.uid);
 const usersRef2 = firebase.database().ref('usernames/' + user.uid);
 usersRef2.set(u)
*/


console.error("exit signUP"  );

}


else {
    // No user is signed in
    console.log('No user ! SignUp ' + user.email);
  }
}
)})

//**********************************************************
.then(authUser => {
  this.setState(() => ({ ...INITIAL_STATE }));
  //history.push(routes.HOME);

  this.setState({loading: false});
  let userId = firebase.auth().currentUser.uid; 
  let usersRef =  firebase.database().ref('/combinedusers/' + userId );
  usersRef.once("value").then( (snapshot)=> {
    let childData = snapshot.val();
    console.log("childData.language   ........" +childData.language)
    //this.setState({language:childData.language, userExists:true})
    console.error(" language.............************88" +  childData.language)
    history.push(routes.LANDING);
  // {childData.language=== "English"?
  // history.push(routes.LANDING):""};   //HOME  SELECTION
  // {childData.language=== "Portugese"?
  // history.push(routes.LANDINGPORTUGESE):""};

  })


})


//*******************************************************

      .catch(error => {
        this.setState(byPropKey('error', error));
        this.setState({loading: false});
      });

      event.preventDefault();
     }    ///end of onSubmit

  render() {

    const {
      username,
      company,
      telephoneNumber,
//      eligible,
      email,
//      shouldemail,
//      questionnaire,
      passwordOne,
      passwordTwo,
      error,
      loading,
      country,
      companySize
    } = this.state;


    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '' ||
      country === '' ||
      companySize === '' ||
      company==='';
// telephoneNumber is deliberately left out as optional
    const classes = styles;
    const { t } = this.props;
    return (<div style={{color: '#02397f'}}>
       {/* <MyComponent   setMyLanguage={this.setMyLanguage}/> */}

      <Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
            {t('Sign Up Here To Start a Risk Assessment')}
					</Typography>
					<form className={classes.form} noValidate onSubmit={this.onSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="username"
									label={t("Full Name")}
									name="username"
									autoComplete="username"
									error={error ? true : false}
									onChange={event => this.setState(byPropKey('username', event.target.value))}
								/>
							</Grid>

              <Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="company"
									label={t("Company")}
									name="company"
									autoComplete="company"
									error={error ? true : false}
									onChange={event => this.setState(byPropKey('company', event.target.value))}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									variant="outlined"
                  required
									fullWidth
									id="telephoneNumber"
									label={t("Telephone Number")}
									name="telephoneNumber"
									autoComplete="telephoneNumber"
									pattern="[7-9]{1}[0-9]{9}"
									error={error ? true : false}
									onChange={event => this.setState(byPropKey('telephoneNumber', event.target.value))}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="email"
									label={t("Email Address")}
									name="email"
									autoComplete="email"
									error={error ? true : false}
									onChange={event => this.setState(byPropKey('email', event.target.value))}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="password"
									label={t("Password")}
									type="password"
									id="password"
									autoComplete="current-password"
									error={error ? true : false}
									onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="confirmPassword"
									label={t("Confirm Password")}
									type="password"
									id="confirmPassword"
									autoComplete="current-password"
									onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
								/>
							</Grid>
              <Grid item xs={12}>
								<Select
                  variant="outlined"
                  required
                  fullWidth
                  name="country"
                  label={t("Country")}
                  id="country"
                  onChange={event => this.setState(byPropKey('country', event.target.value))}
                >
                  {
                    COUNTRIES.map(country => {
                      return <MenuItem value={country} key={country}>{country}</MenuItem>
                    })
                  }
                </Select>
							</Grid>
              <Grid item xs={12}>
                <Select
                  variant="outlined"
                  required
                  fullWidth
                  name="companySize"
                  label={t("Company Size")}
                  id="companySize"
                  onChange={event => this.setState(byPropKey('companySize', event.target.value))}
                >
                  <MenuItem value={'small'}>Small</MenuItem>
                  <MenuItem value={'medium'}>Medium</MenuItem>
                  <MenuItem value={'large'}>Large</MenuItem>
                </Select>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
              style={{marginTop: "10px"}}
							className={classes.submit}
                            disabled={loading || 
                                !this.state.email || 
                                !this.state.telephoneNumber ||
                                !this.state.passwordOne ||
                                !this.state.company || 
                                !this.state.username}
						>
							{t("Sign Up")}
							{loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link to={routes.SIGN_IN} variant="body2">
                <Typography variant="caption" display="block" gutterBottom>
                    {t("Already have an account? Sign in")}
                  </Typography>
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>

      </div>
    );
  }
}

const SignUpLink = () =>
  <p>
    Do not have an account?/Não tem uma conta?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up/Cadastre-se</Link>
  </p>


export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};
