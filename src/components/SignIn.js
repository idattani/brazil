import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

// import { SignUpLink } from './SignUp';
// import { PasswordForgetLink } from './PasswordForget';
//import { PasswordChangeLink } from './PasswordChange';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import firebase from 'firebase';
//import AuthUserContext from './AuthUserContext';
//import withAuthentication from './withAuthentication';
//import withAuthorization from './withAuthorization';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useTranslation } from 'react-i18next';


const styles = (theme) => ({
  paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	progess: {
		position: 'absolute'
	}
});



const SignInPage = ({ history }) =>{
const { t, i18n } = useTranslation();
return(
  <div style={{minHeight: '77vh'}}>
    {/* <h3>{t("Sign In Here/Faça o sign in aqui")}</h3> */}
    <SignInForm history={history} t={t} i18n={i18n} />
    {/* <PasswordForgetLink /> */}

    {/* <SignUpLink /> */}
  </div> )
}
const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  loading: false,
  language:null,
  assessment:null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  // Don't call this.setState() here!
  componentDidMount= ()=>{
    firebase.auth().onAuthStateChanged((user) =>{
     if (user) {
         //console.log(user);
         let userId = firebase.auth().currentUser.uid; 
         //alert(userId);    //you should have your user here!

         let usersRef =  firebase.database().ref('/combinedusers/' + userId );
         usersRef.once("value").then( (snapshot)=> {
           let childData = snapshot.val();
            return childData;
           
       })
         .then( (childData) =>
         {let l=childData.language;
         //let a=childData.assessment;
         console.error(" language chosen ................ "+ l)
         //alert(" l  " +l)
           //this.setState({language:l, userExists:true})
           }
        )
     } else {
         console.log('No user is signed in.');
     }
 });

 }


  onSubmit = (event) => {
    event.preventDefault();
    this.setState({loading: true});
    const {
      email,
      password,
      language
    } = this.state;

    const {
      history
    } = this.props;
    



    auth.doSignInWithEmailAndPassword(email, password)

      .then (()=>{firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          // NB After signUP we execute SignIn automatically
         
          //console.log("email of user  signedIn  " + user.email);
          //console.log("firebase uid of user in signedIn  " + user.uid);
        }
          else{
 
            // No user is signed in
             console.log('No user ! ' + user.email);
             }
          });
         })


.then(() => {
  //this.setState(() => ({ ...INITIAL_STATE }));
  this.setState(() => ({    ...{email: '',
  password: '',
  error: null, loading: false} }));
  const { i18n } = this.props;

  let userId = firebase.auth().currentUser.uid; 
  let usersRef =  firebase.database().ref('/combinedusers/' + userId );
  usersRef.once("value").then( (snapshot)=> {
    let childData = snapshot.val();
    console.log("childData.language   ........" +childData.language);
    i18n.changeLanguage(childData.language);
    //this.setState({language:childData.language, userExists:true})
    console.error(" language.............************88" +  childData.language)
    history.push(routes.LANDING);
  // {childData.language=== "English"?
  // history.push(routes.LANDING):""};   //HOME  SELECTION
  // {childData.language=== "Portugese"?
  // history.push(routes.LANDINGPORTUGESE):""};
  
  
  })
    


})
      .catch(error => {
        this.setState(byPropKey('error', error));
        this.setState({loading: false})
      });

    event.preventDefault();

  }   //end of onSubmit

/*
doSomething()
.then(result => doSomethingElse(result))
.then(newResult => doThirdThing(newResult))
.then(finalResult => {
  console.log(`Got the final result: ${finalResult}`);
})
.catch(failureCallback);
Important: Always return results, otherwise callbacks won't catch the result of a previous promise (with arrow functions () => x is short for () => { return x; }).
*/



  render() {
    
    const {
      email,
      password,
      error,
      loading
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';
    
    const classes = styles;
    const { t } = this.props;

    return (
      <Container component="main" maxWidth="xs">
				<CssBaseline />
        <div className={classes.paper}>
					{/* <Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar> */}
					<Typography component="h1" variant="h5" style={{color: '#02397f'}}>
            {t('Sign In Here')}
					</Typography>
          <form className={classes.form} noValidate onSubmit={this.onSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label={t('Email Address')}
							name="email"
							autoComplete="email"
							autoFocus
							error={error ? true : false}
							onChange={event => this.setState(byPropKey('email', event.target.value))}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label={t("Password")}
							type="password"
							id="password"
							autoComplete="current-password"
							error={error ? true : false}
							onChange={event => this.setState(byPropKey('password', event.target.value))}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							disabled={loading || !this.state.email || !this.state.password}
						>
							{t('Sign In')}
							{loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
						<Grid container>
							<Grid item xs={12} sm={6}>
								<Link to={routes.SIGN_UP}>
                  <Typography variant="caption" display="block" gutterBottom>
                    {t("Don't have an account? Sign Up")}
                  </Typography>
								</Link>
							</Grid>
              <Grid item xs={12} sm={6}>
                <Link to={routes.PASSWORD_FORGET}>
                  <Typography variant="caption" display="block" gutterBottom>
                    {t("Forgot Password?")}
                  </Typography>
								</Link>
							</Grid>
						</Grid>
						{error && error.message && (
							<Typography variant="body2" style={{color: 'red', fontSize: '0.8rem', marginTop: 10}}>
								{t(error.message.split('.')[0])}
							</Typography>
						)}
					</form>
				</div>
      </Container>
      // <form onSubmit={this.onSubmit}>
      //   <input
      //     value={email}
      //     size="30" 
      //     onChange={event => this.setState(byPropKey('email', event.target.value))}
      //     type="text"
      //     placeholder="Email Address/Endereço de email"

      //   />
      //   <input
      //     value={password}
      //     onChange={event => this.setState(byPropKey('password', event.target.value))}
      //     type="password"
      //     placeholder="Password/Senha"
      //   />
      //   <button disabled={isInvalid} type="submit">
      //     Sign In /Entrar
      //   </button>

      //   { error && <p>{error.message}</p> }
      // </form>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};
