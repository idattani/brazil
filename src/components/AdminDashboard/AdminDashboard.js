import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import withAuthorization from '../withAuthorization';

import { makeStyles } from '@material-ui/core/styles';

import { Trans, useTranslation } from 'react-i18next';
import { Chart } from "react-google-charts";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import GaugeChart from 'react-gauge-chart';
import Progress from '../Progress/Progress';

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
  cardRoot: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  }
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


const AdminDashboard = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const uid = firebase.auth().currentUser.uid;
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [privacySurvey, setPrivacySurvey] = useState(null);
    const [overAllDataBreechScore, setOverAllDataBreechScore] = useState(null);
    const [riskImageSrc, setRiskImageSrc] = useState(null);
    const [dataBreachImageSrc, setDataBreachImageSrc] = useState(null);
    useEffect(() => {
        const loadData = async () => {
            const userData = await getCurrentUser();
            await getAllNonAdminUsers();
            setUser(userData);
            const riskScore = 100 - userData.securityRiskScore;
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
            
        });
    };

    const getAllNonAdminUsers = async () => {
        console.log('inside getAllNonAdminUsers ----')
        const $usersRef = db.collection('users').where('isAdmin', '==', false);
        const usersRef = await $usersRef.get();
        let userList = [];
        usersRef.forEach((user) => {
            if (user.data().isPrivacySurveyCompleted || user.data().isSecuritySurveyCompleted) {
                userList.push({id: user.id, ...user.data()});
            }
        });
        setUsers(userList);
    }


    return(
        <div style={pageStyle}>
            <div>
                <h3>{t('Administrator Dashboard')}</h3>
            </div>
            
            <div style={contentStyle}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '25px'}}>
                    <h5>{t('List of Users')}</h5>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                {
                    users && users.length > 0 &&
                    users.map((user) => (
                    <Card key={user.id} className={classes.cardRoot}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                {user.company}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {
                                user.isPrivacySurveyCompleted &&
                                <Button size="small"><Link to={{pathname: "/AdminPrivacyDashboard", search: `?id=${user.id}`}}>{t('Privacy Dashboard')}</Link></Button>
                            }
                            {
                                user.isSecuritySurveyCompleted &&
                                <Button size="small"><Link to={{pathname: "/AdminSecurityDashboard", search: `?id=${user.id}`}}>{t('Security Dashboard')}</Link></Button>
                            }
                        </CardActions>
                    </Card>
                    ))
                        
                }
            </div>
        </div>
    )
};
const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(AdminDashboard);
