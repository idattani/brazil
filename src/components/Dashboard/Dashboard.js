import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import withAuthorization from '../withAuthorization';

import { makeStyles } from '@material-ui/core/styles';

import { Trans, useTranslation } from 'react-i18next';
import { Chart } from "react-google-charts";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import GaugeChart from 'react-gauge-chart';
import Progress from '../Progress/Progress';
import RiskMeter from '../RiskMeter/RiskMeter';

import firebase from 'firebase';

const db = firebase.firestore();


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));


const pageStyle = {
    /* textAlign: "justify", */
    WebkitTransition: 'all', // note the capital 'W' here
    msTransition: 'all', // 'ms' is the only lowercase vendor prefix
    color: '#02397f',
    minHeight: '77vh'
};

const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
};

const buttonStyleHover = {
    padding: '6px 16px',
    fontSize: '0.875rem',
    minWidth: '64px',
    boxSizing: 'border-box',
    backgroundColor: 'rgb(53, 122, 56)',
    fontWeight: 500,
    lineHeight: 1.75,
    borderRadius: '4px',
    letterSpacing: '0.02857em',
    textTransform: 'uppercase'
};

const buttonStyle = {
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: '#4caf50',
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    padding: '10px 16px',
    fontSize: '0.875rem',
    minWidth: '64px',
    boxSizing: 'border-box',
    fontWeight: 500,
    lineHeight: 1.75,
    borderRadius: '4px',
    letterSpacing: '0.02857em',
    textTransform: 'uppercase',
    width: '185px',
    marginTop: '10px'
};

const calculateOverallDataBreechScore = (data) => {
    const totalProgressScore = data.map(category => category.progressScore).reduce((prev, progressScore) => prev = prev + progressScore, 0);
    return (totalProgressScore/data.length).toFixed(2);
};

const updateDashboardUserNotification = () => {
    let updateDashboardNotification = firebase.functions().httpsCallable('updateDashboardNotification');
    updateDashboardNotification({ displayDashboardNotification: false })
    .then((result) => {
      console.log('updated notification', result);
    })
    .catch((error) => {
      // Getting the Error details.
      var code = error.code;
      var message = error.message;
      var details = error.details;
      console.log(code, message, details);
      // ...
    });
  }


const DashboardPage = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const uid = firebase.auth().currentUser.uid;
    const [user, setUser] = useState(null);
    const [privacySurvey, setPrivacySurvey] = useState(null);
    const [overAllDataBreechScore, setOverAllDataBreechScore] = useState(null);
    const [riskImageSrc, setRiskImageSrc] = useState(null);
    const [securityRiskScore, setSecurityRiskScore] = useState(null);
    const [privacyRiskScore, setPrivacyRiskScore] = useState(null);
    const [dataBreachImageSrc, setDataBreachImageSrc] = useState(null);
    updateDashboardUserNotification();
    useEffect(() => {
        const loadData = async () => {
            const userData = await getCurrentUser();
            setUser(userData);
            const riskScore = 100 - userData.securityRiskScore;
            setSecurityRiskScore(riskScore);
            if (riskScore >= 46.948) {
                setRiskImageSrc('./risk-very-high.png');
            } else if (riskScore >= 21.053 && riskScore < 46.948) {
                setRiskImageSrc('./risk-high.png');
            } else if (riskScore >= 9.036 && riskScore < 21.053) {
                setRiskImageSrc('./risk-moderate.png');
            } else if (riskScore >=3.718 && riskScore < 9.036) {
                setRiskImageSrc('./risk-low.png');
            } else {
                setRiskImageSrc('./risk-very-low.png');
            }
            await getPrivacySurvey();
        };

        loadData()
            .catch(console.error);
    }, [db]);

    const getCurrentUser = async () => {
        const $userRef = db.collection('users').doc(uid);
        const userRef = await $userRef.get();
        if (userRef.exists) {
            const userData = userRef.data();
            return userData;
        }
        console.log('Please login')
        return null;
    };

    const getPrivacySurvey = async () => {
        const $privacySurvey = db.collection('privacySurvey').where('userId', '==', uid).orderBy('createdAt', 'desc').limit(1);
        const privacySurveyRef = await $privacySurvey.get();
        privacySurveyRef.forEach((privacySurvey) => {
            console.log(privacySurvey.data());
            setPrivacySurvey(privacySurvey.data().data);
            const dataBreachScore = calculateOverallDataBreechScore(privacySurvey.data().data);
            setPrivacyRiskScore(dataBreachScore);
            setOverAllDataBreechScore(dataBreachScore);
            if (dataBreachScore >= 46.948) {
                setDataBreachImageSrc('./risk-very-high.png');
            } else if (dataBreachScore >= 21.053 && dataBreachScore < 46.948) {
                setDataBreachImageSrc('./risk-high.png');
            } else if (dataBreachScore >= 9.036 && dataBreachScore < 21.053) {
                setDataBreachImageSrc('./risk-moderate.png');
            } else if (dataBreachScore >=3.718 && dataBreachScore < 9.036) {
                setDataBreachImageSrc('./risk-low.png');
            } else {
                setDataBreachImageSrc('./risk-very-low.png');
            }
        });
    };


    return(
        <div style={pageStyle}>
            <div>
                <h3>{t('Dashboard')}</h3>
            </div>
            
            <div style={contentStyle}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '25px'}}>
                    <h5>{t('Data Privacy and Data Protection')}</h5>
                    {
                        overAllDataBreechScore &&
                        <p style={{color: 'black'}}>{t('LGPD Non-Compliance Risk')} = {overAllDataBreechScore}%</p>
                    }
                    <div style={{height: '50%', display: 'flex', justifyContent: 'center'}}>
                        {
                            privacyRiskScore &&
                            <RiskMeter score={privacyRiskScore} />
                        }
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                        <Link to="/PrivacyDashboard" style={buttonStyle}>{t('Get More Insights')}</Link>
                    </div>
                    
                    
                </div>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '25px'}}>
                    <h5>{t('Cyber Security')}</h5>
                    {
                        (user && user.securityRiskScore > -1) &&
                        <p style={{color: 'black'}}>{t('Cyber Security Residual Risk')} = {100 - user.securityRiskScore}%</p>
                    }
                    <div style={{height: '50%', display: 'flex', justifyContent: 'center'}}>
                        {
                           securityRiskScore &&
                           <RiskMeter score={securityRiskScore} />
                        }
                    </div>

                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                        <Link to="/SecurityDashboard" style={buttonStyle}>{t('Get More Insights')}</Link>
                    </div>
                    
                </div>
            </div>
        </div>
    )
};
const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(DashboardPage);
