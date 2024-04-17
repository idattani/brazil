import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { useTranslation } from 'react-i18next';


const useStyles = makeStyles({
    root: {
      width: '100vw',
      position: 'fixed',
      height: '50px',
      bottom: '0px',
      left: '0px',
      right: '0px',
      marginBottom: '0px',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'transparent'
    },
    footer: {
        background: 'transparent'
    }
});

const Footer = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const { t, i18n } = useTranslation();
    return(
        <AppBar position="static" className={classes.footer}>
          <Container maxWidth="md">
            <Toolbar style={{alignItems: 'center', justifyContent: 'space-between'}}>
              <div></div>
              <Typography variant="body1" color="inherit">
                &copy; {t("Copyright")}, {new Date().getFullYear()} CyberSeguro. {t("All Rights Reserved")}
              </Typography>
              <div></div>
            </Toolbar>
          </Container>
        </AppBar>
        // <BottomNavigation
        // value={value}
        // onChange={(event, newValue) => {
        //     setValue(newValue);
        // }}
        // color="primary"
        // className={classes.root}
        // >
        //     <div></div>
        //     <Typography variant="body2" gutterBottom>
        //         &copy; {t("Copyright")}, {new Date().getFullYear()} CyberSeguro. {t("All Rights Reserved")}
        //     </Typography>
        //     <div>
        //         {/* <img id="logo" src={require('../cyberseguro1.png')}  alt="Cyber Seguro" height={"125"} width={"125"}/> */}
        //     </div>
        // </BottomNavigation>
    )
};


export default Footer;