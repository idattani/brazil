import React , { Component }from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthUserContext from './AuthUserContext';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StorageIcon from '@material-ui/icons/Storage';
import SecurityIcon from '@material-ui/icons/Security';
import InfoIcon from '@material-ui/icons/Info';
import ListIcon from '@material-ui/icons/List';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DashboardIcon from '@material-ui/icons/Dashboard';
import * as routes from '../constants/routes';
import './Navigation.css';
import firebase from 'firebase';
import { auth } from '../firebase';

import { useTranslation } from 'react-i18next';



import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';



const db = firebase.firestore();

   //<li><Link to={routes.HOMESECURITY}>Security Questionnaire</Link></li>
    //<li><Link to={routes.PORTUGESEPRIVACY}>Questionário de privacidade</Link></li>
   // <li><Link to={routes.PORTUGESESECURITY}>Questionário de Segurança</Link></li>


//    <li><Link to={routes.HOME}>Home</Link></li>

// https://stackoverflow.com/questions/41466055/how-do-i-pass-state-through-react-router
// https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/#react-firebase-password

// const { t, i18n } = useTranslation();

//https://www.valentinog.com/blog/await-react/

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundImage: 'url(rain-backdrop.jpeg)',
  },
  drawerContainer: {
    overflow: 'auto',
    color: '#23ae13'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    color: "secondary"
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

class Navigation extends Component {
  constructor(props) {
  super(props);
  this.state={language:null, assessment:null, userExists:false, firestoreUser: null};
  }




  // Don't call this.setState() here!
  componentDidMount= ()=>{
    firebase.auth().onAuthStateChanged(async (user) =>{
     if (user) {
         //console.log(user);
         var userId = firebase.auth().currentUser.uid; 
         const $userRef = db.collection("users").doc(userId);
         const firestoreUserSubscription = $userRef.onSnapshot((firestoreUserRef) => {
          let displayDashboardDialog = false;
          console.log('firestore data', firestoreUserRef.data());
          console.log('isPrivacySurveyCompleted', firestoreUserRef.data().isPrivacySurveyCompleted, 'isSecuritySurveyCompleted', firestoreUserRef.data().isSecuritySurveyCompleted, 'displayDashboardDialog', firestoreUserRef.data().displayDashboardDialog);
          if (firestoreUserRef.data().isPrivacySurveyCompleted && firestoreUserRef.data().isSecuritySurveyCompleted && firestoreUserRef.data().displayDashboardDialog){
            displayDashboardDialog = true;
          }
          console.log('displayDashboardDialog', displayDashboardDialog);
          this.setState({firestoreUser: {...firestoreUserRef.data(), id: userId}, displayDashboardDialog});
         });
         
         //alert(userId);    //you should have your user here!

         var usersRef =  firebase.database().ref('/combinedusers/' + userId );
         usersRef.once("value").then( (snapshot)=> {
           let childData = snapshot.val();
            return childData;
           
       })
         .then( (childData) =>
         { let l;
          //if (childData===null){l="English";}else{l=childData.language;}
          l=childData.language
         //let a=childData.assessment;
         //console.error(" assessment chosen  "+ a)
         //alert(" l  " +l)
           this.setState({language:l,userExists:true})  //assessment:a, 
           }
        )
     } else {
         console.log('No user is signed in.');
     }
 });

 }

 toggleDialog() {
  this.setState({
    displayDashboardDialog: !this.state.displayDashboardDialog
  });
 }
  








render() {
  
 
  if (this.state.language === null && this.state.userExists===true) { 
    return (
        <div>
            <h4>Loading your navigation </h4> </div> 
        );
      // Render loading state ...
    } else {

  return(
   
    <AuthUserContext.Consumer>
      {authUser => authUser
        ? <NavigationAuth language={this.state.language} firestoreUser={this.state.firestoreUser} displayDashboardDialog={this.state.displayDashboardDialog} toggleDialog={() => this.toggleDialog()}
         >{this.props.children}</NavigationAuth>
        : <NavigationNonAuth>{this.props.children}</NavigationNonAuth>
      }
    </AuthUserContext.Consumer>
 
  
  
  )}
    }  
    }  //end of component



//<li><Link to={routes.REPOSITORY}>GDPR Resources</Link></li>


  const NavigationAuth = (props) =>{
    const classes = useStyles();
    const { t } = useTranslation();
    const firestoreUser = props.firestoreUser;
    const history = useHistory();
    
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [assessmentAnchorEl, setAssessmentAnchorEl] = React.useState(null);
    const [administrationAnchorEl, setAdministrationAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isAssessmentMenuOpen = Boolean(assessmentAnchorEl);
    const isAdministrationMenuOpen = Boolean(administrationAnchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    
    const updateUser = () => {
      const $usersRef = db.collection("users").doc(firestoreUser.id);
      console.log('updateUser');
      $usersRef.update({displayDashboardDialog: false});
    };

    const handleAssessmentMenuOpen = (event) => {
      setAssessmentAnchorEl(event.currentTarget);
    };

    const handleAdministrationMenuOpen = (event) => {
      setAdministrationAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
      setAssessmentAnchorEl(null);
      setAdministrationAnchorEl(null);
      handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
      setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleNavigation = (path)  => {
      handleMenuClose();
      navigateTo(path);
    }

    const navigateTo = (path) => {
      history.push(path);
    }
  
    const handleDialogClose = () => {
      props.toggleDialog();
      updateUser();
    };

    const renderAssessmentDialog = (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={props.displayDashboardDialog || false}
          onClose={handleDialogClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              {t('You can access Dashboard by going to Assessments > Dashboard')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary" autoFocus>
              {t('Close')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );

    const menuId = 'primary-search-account-menu';

    const renderAssessmentMenu = (
      <Menu
        anchorEl={assessmentAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isAssessmentMenuOpen}
        onClose={handleMenuClose}
        MenuListProps={{ onMouseLeave: handleMenuClose }}
      >
        {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
        <MenuItem style={{color: "#23ae13"}} onClick={() => handleNavigation(routes.HOME)}>
          <StorageIcon /> {t('Privacy and Data Protection')}
        </MenuItem>
        <MenuItem style={{color: "#23ae13"}} onClick={() => handleNavigation(routes.HOMESECURITY)}>
          <SecurityIcon />{t('Security')}
        </MenuItem>
        <MenuItem style={{color: "#23ae13"}} onClick={() => handleNavigation(routes.CYBER_INSURANCE)}>
          <VerifiedUserIcon />{t('Cyber Insurance Application')}
        </MenuItem>
        {
          firestoreUser && firestoreUser.isPrivacySurveyCompleted && firestoreUser.isSecuritySurveyCompleted &&
          <MenuItem style={{color: "#23ae13"}} onClick={() => handleNavigation(routes.DASHBOARD)}>
            <DashboardIcon /> {t('Dashboard')}
          </MenuItem>
        }
        <MenuItem style={{color: "#23ae13"}} onClick={() => handleNavigation(routes.LANDING)}>
          <InfoIcon /> {t('About the Tools')}
        </MenuItem>
        <MenuItem style={{color: "#23ae13"}} onClick={() => handleNavigation(routes.GLOSSARY)}>
          <ListIcon />{t('Glossary')}
        </MenuItem>
      </Menu>
    );

    const renderAdministrationMenu = (
      <Menu
        anchorEl={administrationAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isAdministrationMenuOpen}
        onClose={handleMenuClose}
        MenuListProps={{ onMouseLeave: handleMenuClose }}
      >
        {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
        <MenuItem style={{color: "#23ae13"}} onClick={() => handleNavigation(routes.ACCOUNT)}>
          <AccountCircleIcon /> {t('Account Management')}
        </MenuItem>
        {
          firestoreUser && firestoreUser.isAdmin &&
          <MenuItem style={{color: "#23ae13"}} onClick={() => handleNavigation(routes.ADMIN_DASHBOARD)}>
            <DashboardIcon /> {t('Admin Dashboard')}
          </MenuItem>
        }
      </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem onClick={handleAssessmentMenuOpen}>
          <div style={{color: "#23ae13"}}>
            <AssessmentIcon /> {t('Assessments')}
          </div>
        </MenuItem>
        <MenuItem onClick={handleAdministrationMenuOpen}>
          <div style={{color: "#23ae13"}}>
            <SettingsIcon /> {t('Administration')}
          </div>
        </MenuItem>
        <MenuItem>
          <Link style={{color: "#23ae13"}} to="#" onClick={() => auth.doSignOut()}>
            <ExitToAppIcon/> {t('Sign Out')}
          </Link>
        </MenuItem>
      </Menu>
    );

    const AssessmentMenuItem = () => {
      if (firestoreUser && firestoreUser.isPrivacySurveyCompleted && firestoreUser.isSecuritySurveyCompleted && firestoreUser.displayDashboardNotification) {
        return (
            <Badge badgeContent={1} color="error"> <AssessmentIcon /> {t('Assessments')} </Badge>
        );
      }
      return (
          <span><AssessmentIcon /> {t('Assessments')}</span>
      );
      
    };
  
    return(
    <div className={classes.grow}>
      <AppBar position="static" style={{backgroundImage: 'url(rain-backdrop-rotated.jpeg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
        <Toolbar style={{minHeight: '75px', color: '#23ae13'}}>
          <div>
            <img id="logo" src={require('./cyberseguro2.png')}  alt="Cyber Seguro" width={"150"}/>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop} style={{justifyContent: 'space-around'}}>
            <div style={{padding: '5px', cursor: 'pointer'}} aria-label="Assessments" aria-controls={menuId} aria-haspopup="true" onMouseOver={handleAssessmentMenuOpen}>
              <AssessmentMenuItem />
            </div>
            <div style={{padding: '5px', cursor: 'pointer'}} aria-label="Assessments" aria-controls={menuId} aria-haspopup="true" onMouseOver={handleAdministrationMenuOpen}>
              <SettingsIcon /> {t('Administration')}
            </div>
            <div style={{padding: '5px'}}>
              <Link style={{color: "#23ae13"}} to="#" onClick={() => auth.doSignOut()}>
                <ExitToAppIcon/> {t('Sign Out')}
              </Link>
            </div>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderAssessmentDialog}
      {renderMobileMenu}
      {renderAssessmentMenu}
      {renderAdministrationMenu}
      <main className={classes.content}>
        <Toolbar />
        {props.children}

      </main>
    </div>
   
 
   
    )
};



                   
//  <li><Link to={routes.LANDING}>About the Assessments</Link></li>  removed from below
const NavigationNonAuth = (props) =>{
  const classes = useStyles();
  const { t } = useTranslation();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Link style={{color: "#23ae13"}} to={routes.SIGN_IN}>
          {t('Sign In')}
        </Link>
        
      </MenuItem>
    </Menu>
  );
// Let's find chosen language
 return(
    <div className={classes.grow}>
      <AppBar position="static" style={{backgroundImage: 'url(rain-backdrop-rotated.jpeg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
        <Toolbar style={{minHeight: '75px', color: '#23ae13'}}>
          <div>
            <img id="logo" src={require('./cyberseguro2.png')}  alt="Cyber Seguro" width={"150"}/>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Link style={{color: "#23ae13"}} to={routes.SIGN_IN}>
              <ExitToAppIcon /> {t('Sign In')}
            </Link>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      <main className={classes.content}>
        {props.children}
      </main>
    </div>
   
  )
}
export default Navigation;
