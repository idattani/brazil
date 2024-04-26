import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import withAuthorization from '../withAuthorization';

import { makeStyles } from '@material-ui/core/styles';

import { Chart } from "react-google-charts";
import Typography from '@material-ui/core/Typography';

import { Trans, useTranslation } from 'react-i18next';
import ReactVirtualizedTable from '../VirtualizedTable/VirtualizedTable';
import Highcharts, { setOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import GaugeChart from 'react-gauge-chart';

import Button from '@material-ui/core/Button';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import firebase from 'firebase';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import RiskMeter from '../RiskMeter/RiskMeter';

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
    width: '200px',
    marginTop: '10px'
};

const pageStyle = {
    textAlign: "justify",
    WebkitTransition: 'all', // note the capital 'W' here
    msTransition: 'all', // 'ms' is the only lowercase vendor prefix
    color: '#02397f',
    minHeight: '77vh',
    marginTop: '-64px'
};

const contentStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    flexFlow: 'row wrap',
    /* flexDirection: 'column', */
    color: 'black'
};

/* Maintain Data Governance (7)
Acquire, Identify and Classify Data (6)
Manage Personal Data Risk (4)
Manage Data Security (6)
Manage the (Personal) Data Supply Chain (5)
Manage Incidents and Breaches (4)
Create and Maintain Awareness/Training (3)
Organize DPO Function (5)
Maintain Internal Controls (6) */

const calculateOverallDataBreechScore = (data) => {
    const totalProgressScore = data.map(category => category.progressScore).reduce((prev, progressScore) => prev = prev + progressScore, 0);
    return totalProgressScore/data.length;
};

const calculateProbabilityOfCyberAttack = (securityRiskScore, percentageOfLikelihoodOfAttackInThereCountry, percentageOfLikelihoodOfAttackInThereSector, percentageOfLikelihoodOfAttackByThereSize) => {
    {/* Risk Score - 38 */}
    {/* Brasil 85.3 - % of Enterprises compromised by at least one cyber attack */}
    {/* Sector 8.7 */}
    {/* Likelhood by Size - 43 */}
    const actualSecurityRiskScore = 100 - securityRiskScore;
    const probabilityOfCyberAttack = (actualSecurityRiskScore + ((percentageOfLikelihoodOfAttackInThereCountry + percentageOfLikelihoodOfAttackInThereSector + percentageOfLikelihoodOfAttackByThereSize)/3))/2;
    return probabilityOfCyberAttack;
};

const calculateImpactOfCyberAttack = (companySize, costOfCyberAttackByCountry, costOfCyberAttackBySector, costOfCyberAttackBySize) => {
    {/* Cost of Country - $7.24 million */}
    {/* Cost for Sector - $32814 */}
    {/* Cost for business size $38000 */}
    const avg = ((costOfCyberAttackByCountry * 1000000) + costOfCyberAttackBySector + costOfCyberAttackBySize)/3;
    const riskScore = 38;
    // const companySize = 'small';
    let result = 0;
    if (riskScore > 40) {
        if (companySize === 'large') {
            result = avg + 200000;
        } else {
            result = avg + 20000;
        }
    } else {
        result = avg;
    }

    return (result/1000000).toFixed(2);
};

const arrayMove = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};


const SecurityDashboardPage = ({history}) => {
    const uid = firebase.auth().currentUser.uid;
    const classes = useStyles();
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [riskImageSrc, setRiskImageSrc] = useState(null);
    const [riskScoreMeter, setRiskScoreMeter] = useState(null);
    const [riskOfCyberInThereCountryOptions, setRiskOfCyberInThereCountryOptions] = useState(null);
    const [costOfCyberAttackByCountryOptions, setCostOfCyberAttackByCountryOptions] = useState(null);
    const [costOfCyberAttackBySectorOptions, setCostOfCyberAttackBySectorOptions] = useState(null);
    const [immediateCostOfCyberAttackOptions, setImmediateCostOfCyberAttackOptions] = useState(null);

    let percentageOfLikelihoodOfAttackInThereCountry = null;
    let percentageOfLikelihoodOfAttackInThereSector = null;
    let percentageOfLikelihoodOfAttackByThereSize = null;
    const [probabilityOfCyberAttack, setProbabilityOfCyberAttack] = useState(null);

    const [costImpactOfCyberAttackByCountry, setCostImpactOfCyberAttackByCountry] = useState(null);
    const [costImpactOfCyberAttackBySector, setCostImpactOfCyberAttackBySector] = useState(null);
    const [costImpactOfCyberAttackBySize, setCostImpactOfCyberAttackBySize] = useState(null);
    const [impactOfCyberAttack, setImpactOfCyberAttack] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const userData = await getCurrentUser();
            if (userData) {
                if (userData.country === 'United Kingdom') {
                    userData.country = 'UK';
                }

                if (userData.country === 'United States of America') {
                    userData.country = 'USA';
                }
                setUser(userData);
                const riskScore = 100 - userData.securityRiskScore;
                setRiskScoreMeter(riskScore);
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
                await getRiskOfCyberInThereCountry(userData.country);
                await getCostOfCyberAttackByCountry(userData.country);
                await getCostOfCyberAttackBySector(userData.sector);
                await getImmediateCostOfCyberAttack(userData.companySize);
                await getLikelihoodOfAttackBySize(userData.companySize);
                await getLikelihoodOfAttackBySector(userData.sector);
                setProbabilityOfCyberAttack(calculateProbabilityOfCyberAttack(userData.securityRiskScore, percentageOfLikelihoodOfAttackInThereCountry, percentageOfLikelihoodOfAttackInThereSector, percentageOfLikelihoodOfAttackByThereSize));
                setImpactOfCyberAttack(calculateImpactOfCyberAttack(userData.companySize, costImpactOfCyberAttackByCountry, costImpactOfCyberAttackBySector, costImpactOfCyberAttackBySize));
            }
        };
        loadData()
            .catch(console.error);
    }, [db]);

    const getCurrentUser = async() => {
        const $userRef = db.collection('users').doc(uid);
        const userRef = await $userRef.get();
        if (userRef.exists) {
            const userData = userRef.data();
            return userData;
        }
        console.log('Please login')
        return null;
    };

    const getRiskOfCyberInThereCountry = async (country) => {
        const $riskOfCyberInThereCountry = db.collection('statistics').doc('enterprisesComprisedByAtleastOneCyberAttack');
        const riskOfCyberInThereCountryRef = await $riskOfCyberInThereCountry.get();
        if (riskOfCyberInThereCountryRef.exists) {
            const riskOfCyberInThereCountry = riskOfCyberInThereCountryRef.data();
            const index = riskOfCyberInThereCountry.data.findIndex(obj =>  obj.title.toLowerCase() === country.toLowerCase());
            arrayMove(riskOfCyberInThereCountry.data, index, 0);
            percentageOfLikelihoodOfAttackInThereCountry = riskOfCyberInThereCountry.data[0].value;
            const options = {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Risk of Cyber Attack'
                },
                xAxis: {
                    categories: [],
                    title: {
                        text: null
                    },
                    labels: {
                        useHTML: true,
                        formatter: function () {
                            return this.value;
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Risk of Cyber Attack',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: '%'
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Risk of Cyber Attack',
                    data: []
                }]
            };

            riskOfCyberInThereCountry.data.forEach((obj) => {
                options.xAxis.categories.push(`${obj.title} <img src="${obj.emojiImageURL}" width="14" height="14" />`);
                options.series[0].data.push(obj.value);
            });
            setRiskOfCyberInThereCountryOptions(options);
        }
        
    };

    const getCostOfCyberAttackByCountry = async (country) => {
        const $costOfCyberAttackByCountry = db.collection('statistics').doc('annualCostOfCyberAttackOnCompanies');
        const costOfCyberAttackByCountryRef = await $costOfCyberAttackByCountry.get();
        if (costOfCyberAttackByCountryRef.exists) {
            const costOfCyberAttackByCountry = costOfCyberAttackByCountryRef.data();
            const index = costOfCyberAttackByCountry.data.findIndex(obj =>  obj.title.toLowerCase() === country.toLowerCase());
            // arrayMove(costOfCyberAttackByCountry.data, index, 0);
            setCostImpactOfCyberAttackByCountry(costOfCyberAttackByCountry.data[index].value);
            costOfCyberAttackByCountry.data.splice(index, 1);
            const options = {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: t('Average Annualised Cost of Cyber Attacks around the World')
                },
                xAxis: {
                    categories: [],
                    title: {
                        text: null
                    },
                    labels: {
                        useHTML: true,
                        formatter: function () {
                            return this.value;
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Cost of Cyber Attack (millions)',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ' millions'
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: t('Cost of Cyber Attack by Country'),
                    data: []
                }],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 600
                        },
                        chartOptions: {
                            legend: {
                                align: 'center',
                                verticalAlign: 'bottom',
                                layout: 'horizontal'
                            },
                            yAxis: {
                                labels: {
                                    align: 'left',
                                    x: 0,
                                    y: -5
                                },
                                title: {
                                    text: null
                                }
                            },
                            subtitle: {
                                text: null
                            },
                            credits: {
                                enabled: false
                            }
                        }
                    }]
                }
            };
            costOfCyberAttackByCountry.data.forEach((obj) => {
                options.xAxis.categories.push(`${obj.title} <img src="${obj.emojiImageURL}" width="14" height="14" />`);
                options.series[0].data.push(obj.value);
            });
            setCostOfCyberAttackByCountryOptions(options);
        }
    };

    const getCostOfCyberAttackBySector = async (sector) => {
        if (!sector) {
            sector = 'Energy';
        }
        const $costOfCyberAttackBySector = db.collection('statistics').doc('avgCostOfCyberIncidentsToOrganisationInTheUK');
        const costOfCyberAttackBySectorRef = await $costOfCyberAttackBySector.get();
        if (costOfCyberAttackBySectorRef.exists) {
            const costOfCyberAttackBySector = costOfCyberAttackBySectorRef.data();
            const index = costOfCyberAttackBySector.data.findIndex(obj =>  obj.title.toLowerCase() === sector.toLowerCase());
            // arrayMove(costOfCyberAttackBySector.data, index, 0);
            setCostImpactOfCyberAttackBySector(costOfCyberAttackBySector.data[index].value);
            costOfCyberAttackBySector.data.splice(index, 1);
            const options = {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Cost of Cyber Attack by Sector'
                },
                xAxis: {
                    categories: [],
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Cost of Cyber Attack',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ''
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Cost of Cyber Attack by Sector',
                    data: []
                }]
            };
            costOfCyberAttackBySector.data.forEach((obj) => {
                options.xAxis.categories.push(`${obj.title}`);
                options.series[0].data.push(obj.value);
            });
            setCostOfCyberAttackBySectorOptions(options);
        }
    };

    const getImmediateCostOfCyberAttack = async (companySize) => {
        const $immediateCostOfCyberAttack = db.collection('statistics').doc('immediateCostOfCyberAttack');
        const immediateCostOfCyberAttackRef = await $immediateCostOfCyberAttack.get();
        if (immediateCostOfCyberAttackRef.exists) {
            const immediateCostOfCyberAttack = immediateCostOfCyberAttackRef.data();
            const index = immediateCostOfCyberAttack.data.findIndex(obj =>  obj.title.toLowerCase() === companySize.toLowerCase());
            // arrayMove(immediateCostOfCyberAttack.data, index, 0);
            setCostImpactOfCyberAttackBySize(immediateCostOfCyberAttack.data[0].value);
            immediateCostOfCyberAttack.data.splice(index, 1);
            const options = {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Immediate Cost of Cyber Attack by Company Size'
                },
                xAxis: {
                    categories: [],
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Immediate Cost of Cyber Attack',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ''
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Immediate Cost of Cyber attack by Company Size',
                    data: []
                }]
            };
            immediateCostOfCyberAttack.data.forEach((obj) => {
                options.xAxis.categories.push(obj.title);
                options.series[0].data.push(obj.value);
            });
            setImmediateCostOfCyberAttackOptions(options);
        }
    };

    const getLikelihoodOfAttackBySize = async (companySize) => {
        const $likelihoodOfAttackBySize = db.collection('statistics').doc('likelihoodBySize');
        const likelihoodOfAttackBySizeRef = await $likelihoodOfAttackBySize.get();
        if (likelihoodOfAttackBySizeRef.exists) {
            const likelihoodOfAttackBySize = likelihoodOfAttackBySizeRef.data();
            if (companySize === 'small'|| companySize === 'medium') {
                percentageOfLikelihoodOfAttackByThereSize = likelihoodOfAttackBySize.data[0].value;
            }
            if (companySize === 'large') {
                percentageOfLikelihoodOfAttackByThereSize = likelihoodOfAttackBySize.data[1].value;
            }
        }
    }

    const getLikelihoodOfAttackBySector = async (sector) => {
        console.log('sector', sector);
        if (!sector) {
            sector = 'Finance and insurance';
        }
        const $likelihoodOfAttackBySector = db.collection('statistics').doc('likelihoodBySector');
        const likelihoodOfAttackBySectorRef = await $likelihoodOfAttackBySector.get();
        if (likelihoodOfAttackBySectorRef.exists) {
            const likelihoodOfAttackBySector = likelihoodOfAttackBySectorRef.data();
            const index = likelihoodOfAttackBySector.data.findIndex(obj =>  obj.title.toLowerCase() === sector.toLowerCase());
            percentageOfLikelihoodOfAttackInThereSector = likelihoodOfAttackBySector.data[index].value;
        }
    }

    const columns = [
        {
          width: 462,
          label: 'Category',
          dataKey: 'category',
        },
        {
          width: 154,
          label: 'Progress',
          dataKey: 'progress',
        }
    ];

    const rows = [
        {
            hundredPercent: 3,
            fiftyToNinetyNinePercent: 0,
            category: "Maintain Data Governance",
            progress: '0 - 9%',
            progressScore: 0,
            tenToFourtyNinePercent: 0,
            id: 0,
            zeroToNinePercent: 4,
        },
        {
            hundredPercent: 2,
            fiftyToNinetyNinePercent: 2,
            category: "Acquire, Identify and Classify Data",
            progress: '10 - 49%',
            progressScore: 25,
            tenToFourtyNinePercent: 2,
            id: 1,
            zeroToNinePercent: 0,
        },
        {
            hundredPercent: 2,
            fiftyToNinetyNinePercent: 1,
            category: "Manage Personal Data Risk",
            progress: '100%',
            progressScore: 100,
            tenToFourtyNinePercent: 1,
            id: 2,
            zeroToNinePercent: 0,
        },
        {
            hundredPercent: 6,
            fiftyToNinetyNinePercent: 0,
            category: "Manage Data Security",
            progress: '100%',
            progressScore: 100,
            tenToFourtyNinePercent: 0,
            id: 3,
            zeroToNinePercent: 0,
        },
        {
            hundredPercent: 2,
            fiftyToNinetyNinePercent: 1,
            category: "Manage the (Personal) Data Supply Chain",
            progress: '100%',
            progressScore: 100,
            tenToFourtyNinePercent: 1,
            id: 4,
            zeroToNinePercent: 1,
        },
        {
            hundredPercent: 0,
            fiftyToNinetyNinePercent: 0,
            category: "Manage Incidents and Breaches",
            progress: '0 - 9%',
            progressScore: 0,
            tenToFourtyNinePercent: 0,
            id: 5,
            zeroToNinePercent: 4,
        },
        {
            hundredPercent: 0,
            fiftyToNinetyNinePercent: 0,
            category: "Create and Maintain Awareness/Training",
            progress: '10 - 49%',
            progressScore: 25,
            tenToFourtyNinePercent: 2,
            id: 6,
            zeroToNinePercent: 1,
        },
        {
            hundredPercent: 0,
            fiftyToNinetyNinePercent: 0,
            category: "Organize DPO Function",
            progress: '0 - 9%',
            progressScore: 0,
            tenToFourtyNinePercent: 0,
            id: 7,
            zeroToNinePercent: 5,
        },
        {
            hundredPercent: 6,
            fiftyToNinetyNinePercent: 0,
            category: "Maintain Internal Controls",
            progress: '100%',
            progressScore: 100,
            tenToFourtyNinePercent: 0,
            id: 8,
            zeroToNinePercent: 0,
        }
    ];

    const overAllDataBreechScore = calculateOverallDataBreechScore(rows);
    console.log('overAllDataBreechScore', overAllDataBreechScore);
    return(
        <div style={pageStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '25px'}}>
                <div>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => history.goBack()}
                        style={{marginTop: "10px"}}
                        className={classes.submit}
                        >
                            {t("Back")}
                    </Button>
                </div>
                <div style={{display: 'flex', alignSelf: 'flex-end', justifyContent: 'center', flexGrow: '1'}}>
                    <h3>{t('Cyber Security Dashboard')}</h3>
                </div>
            </div>
            <div style={contentStyle}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <div>
                        {
                            (user && user.securityRiskScore > -1) &&
                            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                                <div style={{alignSelf: 'center'}}>
                                    <p>{t('Cyber Security Residual Risk')}</p>
                                </div>
                                <div style={{alignSelf: 'center'}}>
                                    <p style={{color: 'rgb(64, 84, 106)', fontWeight: 'bold'}}>{100 - user.securityRiskScore}%</p>
                                </div>
                            </div>
                        }
                        {
                            <RiskMeter score={riskScoreMeter} />
                        }
                    </div>
                    <div>
                        {
                            /* (riskOfCyberInThereCountryOptions && riskOfCyberInThereCountryOptions.series[0].data && riskOfCyberInThereCountryOptions.series[0].data.length > 0) &&  
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={riskOfCyberInThereCountryOptions}
                            /> */

                            costImpactOfCyberAttackByCountry &&
                            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: '25px'}}>
                                <div style={{alignSelf: 'center'}}>
                                    <p>{t('Average Annualised Cost of Cyber Attack in')} ({user.country})</p>
                                </div>
                                <div style={{alignSelf: 'center'}}>
                                    <p style={{color: 'rgb(64, 84, 106)', fontWeight: 'bold'}}>{costImpactOfCyberAttackByCountry} {t('millions USD$')}</p>
                                </div>
                            </div>
                                
                        }
                    </div>
                    <div>
                        {
                            (costOfCyberAttackByCountryOptions && costOfCyberAttackByCountryOptions.series[0].data && costOfCyberAttackByCountryOptions.series[0].data.length > 0) &&
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={costOfCyberAttackByCountryOptions}
                            />
                        }
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <div>
                        <p style={{textAlign: 'center'}}>{t('Likelihood of Attack in the next 12 months')}</p>
                        {
                            probabilityOfCyberAttack &&
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <GaugeChart id="risk-score"
                                    nrOfLevels={3}
                                    style={{width: 250}}
                                    arcsLength={[0.34, 0.33, 0.33]}
                                    cornerRadius={0}
                                    textColor={'#010101'}
                                    /* colors={['#5BE12C', '#F5CD19', '#EA4228']} */
                                    colors={['#109618', '#ff9900', '#dc3912']}
                                    percent={probabilityOfCyberAttack/100}
                                    arcPadding={0.02}
                                />
                            </div>
                        }
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '44px'}}>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                </TableHead>
                                <TableBody>
                                    {
                                        (costOfCyberAttackBySectorOptions && costOfCyberAttackBySectorOptions.series[0].data && costOfCyberAttackBySectorOptions.series[0].data.length > 0) &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {t('Average Annualised Cost of Cyber Attacks in Your Sector')}
                                            </TableCell>
                                            <TableCell align="right" style={{color: 'rgb(64, 84, 106)', fontWeight: 'bold'}}>{costImpactOfCyberAttackBySector} USD$</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        (immediateCostOfCyberAttackOptions && immediateCostOfCyberAttackOptions.series[0].data && immediateCostOfCyberAttackOptions.series[0].data.length > 0) &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {t('Immediate Cost of Cyber Attacks for your company size')}
                                            </TableCell>
                                            <TableCell align="right" style={{color: 'rgb(64, 84, 106)', fontWeight: 'bold'}}>{costImpactOfCyberAttackBySize} USD$</TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {
                            /* (costOfCyberAttackBySectorOptions && costOfCyberAttackBySectorOptions.series[0].data && costOfCyberAttackBySectorOptions.series[0].data.length > 0) &&
                            <div>
                                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                                    <div style={{alignSelf: 'center'}}>
                                        <p>Average Annualised Cost of Cyber Attacks in Your Sector</p>
                                    </div>
                                    <div style={{alignSelf: 'center'}}>
                                        <p style={{color: 'rgb(64, 84, 106)', fontWeight: 'bold'}}>{costImpactOfCyberAttackBySector} USD$</p>
                                    </div>
                                </div>
                                {<HighchartsReact
                                    highcharts={Highcharts}
                                    options={costOfCyberAttackBySectorOptions}
                                />}
                            </div> */
                        }
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Link to="/FurtherInsights" style={buttonStyle}>{t('FIND OUT MORE HERE')}</Link>
                        </div>
                    </div>
                    <div>
                        {
                            /* (immediateCostOfCyberAttackOptions && immediateCostOfCyberAttackOptions.series[0].data && immediateCostOfCyberAttackOptions.series[0].data.length > 0) &&
                            <div style={{display: 'flex', alignContent: 'center'}}>
                                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                                    <div style={{alignSelf: 'center'}}>
                                        <p>Immediate Cost of Cyber Attacks for your company size</p>
                                    </div>
                                    <div style={{alignSelf: 'center'}}>
                                        <p style={{color: 'rgb(64, 84, 106)', fontWeight: 'bold'}}>{costImpactOfCyberAttackBySize} USD$</p>
                                    </div>
                                </div>
                                { <HighchartsReact
                                    highcharts={Highcharts}
                                    options={immediateCostOfCyberAttackOptions}
                                />}
                            </div> */
                        }
                        
                    </div>
                    {/* <div>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Link to="/FurtherInsights" style={buttonStyle}>FIND OUT MORE HERE</Link>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
};
const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(withRouter(SecurityDashboardPage));
