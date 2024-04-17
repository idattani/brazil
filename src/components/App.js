import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
// import { withStyles } from '@material-ui/styles';
import { orange, teal, green } from '@material-ui/core/colors';







//import { Router } from 'react-router-dom';
//import history from './history';


import Navigation from './Navigation';
import Footer from './Footer/Footer';
import LandingPage from './Landing';
import LandingPagePortugese from './LandingPortugese';
import SignUpPage from './SignUp';
import SignInPage from './SignIn';
import PasswordForgetPage from './PasswordForget';
import HomePage from './Home';
import HomeSecurityPage from './HomeSecurity';
import HomePrivacyPageP from './HomePrivacyP';
import HomeSecurityPageP from './HomeSecurityP';
import AccountPage from './Account';
import RepositoryPage from './Repository';
import FAQs from './faqs';
import Resources from './resources';
import SelectionPage from './SelectionPage';
import GlossaryPage from './Glossary';
import DashboardPage from './Dashboard/Dashboard';
import PrivacyAndDataProtectionDashboardPage from './PrivacyAndDataProtectionDashboard/PrivacyAndDataProtectionDashboard';
import SecurityDashboardPage from './SecurityDashboard/SecurityDashboard';
import FurtherInsights from './FurtherInsights/FurtherInsights';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import AdminPrivacyAndDataProtectionDashboardPage from './AdminDashboard/AdminPrivacyAndDataProtectionDashboard';
import AdminSecurityDashboardPage from './AdminDashboard/AdminSecurityDashboard';
import ResponsiveAppBar from './ResponsiveAppBar/ResponsiveAppBar';
//import ScorePage from './ScorePage';
import CyberInsurancePage from './CyberInsurance/CyberInsurance';

import * as routes from '../constants/routes';

import withAuthentication from './withAuthentication';
//import { pure } from 'recompose';


//************************************ */


// when App is transformed with authentication the Navigation Consumer gets authUser

const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: teal[700],
    },
  },
  status: {
    danger: orange[500],
  },
});




class App extends React.Component {
//const App = () =>


//setMyLanguage=(v) =>{
//  this.setState({lan:v})
  
 // }


constructor(props) {
  super(props);
  //this.state = {lan: "none"};
  //this.setMyLanguage = this.setMyLanguage.bind(this);
}


render()
{

  return (
    <div className="App">


  <div>
  {/*  hello
  
  {(this.state.lan==="none")? <MyComponent  l={this.state.lan}  setMyLanguage={this.setMyLanguage}/>:""}
  */}
    </div>
  
    
    <ThemeProvider theme={theme}>
      
      <Router>
        
        {/* <hr/> */}
        <div>
          {/* <ResponsiveAppBar /> */}
        <Navigation>
        
        <Route exact path={routes.ROOT} component={() => <LandingPage />} />
        <Route exact path={routes.LANDING} component={() => <LandingPage />} />
        <Route exact path={routes.LANDINGPORTUGESE} component={() => <LandingPagePortugese />} />
        <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
        <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
        <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
        <Route exact path={routes.REPOSITORY} component={() => <RepositoryPage />} />
        <Route exact path={routes.HOME} component={() => <HomePage />} />
        <Route exact path={routes.HOMESECURITY} component={() => <HomeSecurityPage />} />
        <Route exact path={routes.CYBER_INSURANCE} component={() => <CyberInsurancePage />} />
        <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
        <Route exact path={routes.FAQS} component={() => <FAQs />} />
        <Route exact path={routes.RESOURCES} component={() => <Resources />} />
        <Route exact path={routes.SELECTION} component={() => <SelectionPage />} />
        <Route exact path={routes.GLOSSARY} component={() => <GlossaryPage />} />
        <Route exact path={routes.DASHBOARD} component={() => <DashboardPage />} />
        <Route exact path={routes.PRIVACY_DASHBOARD} component={() => <PrivacyAndDataProtectionDashboardPage />} />
        <Route exact path={routes.SECURITY_DASHBOARD} component={() => <SecurityDashboardPage />} />
        <Route exact path={routes.FURTHER_INSIGHTS} component={()=> <FurtherInsights />} />
        <Route exact path={routes.ADMIN_DASHBOARD} component={()=> <AdminDashboard />} />
        <Route exact path={routes.ADMIN_PRIVACY} component={()=> <AdminPrivacyAndDataProtectionDashboardPage />} />
        <Route exact path={routes.ADMIN_SECURITY} component={()=> <AdminSecurityDashboardPage />} />

        </Navigation>

        </div>
    </Router>
    <Footer />
    </ThemeProvider>
  




 </div>

)
  }
}

//export default withAuthentication(withStyles(styles)(App));
//****************************** */
export default  withAuthentication(App);

//<Route exact path={routes.SCORE} component={() => <ScorePage />} />  