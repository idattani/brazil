import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import withAuthorization from '../withAuthorization';

import { makeStyles } from '@material-ui/core/styles';

import { Trans, useTranslation } from 'react-i18next';
import ReactVirtualizedTable from '../VirtualizedTable/VirtualizedTable';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Button from '@material-ui/core/Button';

import GaugeChart from 'react-gauge-chart';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import RiskMeter from '../RiskMeter/RiskMeter';

import firebase from 'firebase';
import { auth } from '../../firebase/firebase';

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
    color: 'black'
};

const calculateOverallDataBreechScore = (data) => {
    const totalProgressScore = data.map(category => category.progressScore).reduce((prev, progressScore) => prev = prev + progressScore, 0);
    return (totalProgressScore/data.length).toFixed(2);
};

const getFlagEmoji = (countryCode) => {
    const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
    console.log('Flag', String.fromCodePoint(...codePoints));
    return String.fromCodePoint(...codePoints);
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


const PrivacyAndDataProtectionDashboardPage = ({history}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [options, setOptions] = useState(null);
    const [avgCostOverTimeOptions, setAvgCostOverTimeOptions] = useState(null);
    const [privacySurvey, setPrivacySurvey] = useState(null);
    const [overAllDataBreechScore, setOverAllDataBreechScore] = useState(null);
    const [dataBreachImageSrc, setDataBreachImageSrc] = useState(null);

    const [costOfDataBreachForCountry, setCostOfDataBreachForCountry] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const userData = await getCurrentUser();
            if (userData) {
                console.log('useEffect userData', userData);
                if (userData.country === 'United Kingdom') {
                    userData.country = 'UK';
                }
    
                if (userData.country === 'United States of America') {
                    userData.country = 'USA';
                }
                await getDataBreachByCountry(userData.country);
                await getAvgCostOverTimeByCompanySize(userData.companySize);
                await getPrivacySurvey();
            }
            
        };
        loadData()
            .catch(console.error);
        
    }, [db]);

    const getCurrentUser = async() => {
        console.log('inside getCurrentUser');
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
            let privacySurveyData = privacySurvey.data().data;
            privacySurveyData.forEach((row) => row.category = t(`privacy_data_protection.${row.category}`));
            setPrivacySurvey(privacySurveyData);
            const dataBreachScore = calculateOverallDataBreechScore(privacySurveyData);
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
    
    const getDataBreachByCountry = async (country) => {
        console.log('country', country);
        const $dataBreachByCountryRef = db.collection('statistics').doc('dataBreachByCountry');
        const dataBreachByCountryRef = await $dataBreachByCountryRef.get();
        if (dataBreachByCountryRef.exists) {
            const dataBreachByCountry = dataBreachByCountryRef.data();
            const index = dataBreachByCountry.data.findIndex(obj => obj.title.toLowerCase() === country.toLowerCase());
            setCostOfDataBreachForCountry(dataBreachByCountry.data.splice(index, 1)[0].value);
            // arrayMove(dataBreachByCountry.data, index, 0)
            let tempOptions = options;
            if (!options) {
                tempOptions = {
                    chart: {
                        type: 'bar',
                        width: 450,
                    },
                    title: {
                        text: t('Comparison with Rest of the World')
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
                            text: 'Cost of Data Breach (millions USD$)',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        useHtml: true,
                        valueSuffix: ' millions',
                        /* formatter: function () {
                            console.log('x ---- ', this.x);
                            const match = this.x.match(/src\s*=\s*"(.+?)"/);
                            return `<div>${this.x}</div>`
                            var img = '<img src = "https://static.pexels.com/photos/6606/flowers-garden-orange-tulips.jpg" height="82" width="122"/>'
                            return img
                            return `<tspan style="font-size: 10px;">${this.x} <tspan> <img src="${match[1]}" width="14" height="14" /></tspan></tspan><tspan class="highcharts-br" dy="15" x="8">​</tspan><tspan style="color: rgb(124, 181, 236); fill: rgb(124, 181, 236);">●</tspan> Avg. Cost of Breech: <tspan style="font-weight: bold;">${this.y} millions</tspan><tspan class="highcharts-br">​</tspan>`
                        } */
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
                        name: t('Cost of Data Breach'),
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
            }
            dataBreachByCountry.data.forEach((obj) => {
                if (!obj.hasOwnProperty('display')){
                    tempOptions.xAxis.categories.push(`${obj.title} <img src="${obj.emojiImageURL}" width="14" height="14" />`)
                    tempOptions.series[0].data.push(obj.value);
                }
            });
            console.log('options', tempOptions);
            setOptions(tempOptions);
        }
    };

    const getAvgCostOverTimeByCompanySize = async (companySize) => {
        const $avgCostOverTimeByCompanySizeRef = db.collection('statistics').doc('dataBreach');
        const avgCostOverTimeByCompanySizeRef = await $avgCostOverTimeByCompanySizeRef.get();
        if (avgCostOverTimeByCompanySizeRef.exists) {
            const avgCostOverTimeByCompanySize = avgCostOverTimeByCompanySizeRef.data();
            const tempOptions = {
                chart: {
                    type: 'bar',
                    width: 450,
                    height: 300
                },
                title: {
                    text: t('Potential Monetary Impact Over Time')
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
                        text: 'Cost of Data Breach (thousands USD$)',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ' k$'
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
                    name: t('Cost of Data Breach'),
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
            let data = null;
            if (companySize === 'small' || 'medium') {
                data = avgCostOverTimeByCompanySize.data[0];
            }
            if (companySize === 'large') {
                data = avgCostOverTimeByCompanySize.data[1];
            }
            if (!data) {
                return;
            }
            data.data.forEach(obj => {
                tempOptions.xAxis.categories.push(t(obj.title));
                tempOptions.series[0].data.push(obj.value)
            });
            
            setAvgCostOverTimeOptions(tempOptions);
        }
    };


    const uid = firebase.auth().currentUser.uid;
    const columns = [
        {
          width: 462,
          label: t('Category'),
          dataKey: 'category',
        },
        {
          width: 154,
          label: t('Progress'),
          dataKey: 'progress',
        }
    ];

    /* console.log('avg', avgCostOverTimeOptions) */
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
                    <h3>{t('Data Privacy and Data Protection Dashboard')}</h3>
                </div>
            </div>
            <div style={contentStyle}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <div style={{marginBottom: '25px'}}>
                        {   privacySurvey &&
                            ReactVirtualizedTable(columns, privacySurvey)
                        }
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        {
                            (avgCostOverTimeOptions && avgCostOverTimeOptions.series[0].data && avgCostOverTimeOptions.series[0].data.length > 0) &&
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={avgCostOverTimeOptions}
                            />
                        }
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div>
                        {
                            overAllDataBreechScore &&
                            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                                <div style={{alignSelf: 'center'}}>
                                    <p>{t('LGPD Non-Compliance Risk')}</p>
                                </div>
                                <div style={{alignSelf: 'center'}}>
                                    <p style={{color: 'rgb(64, 84, 106)', fontWeight: 'bold'}}>{overAllDataBreechScore} %</p>
                                </div>
                            </div>
                            // <img src="./risk graphic.png" width="524.8" height="32" />
                        }
                    </div>
                    <div>
                        {
                            overAllDataBreechScore &&
                            <RiskMeter score={overAllDataBreechScore} />
                        }
                    </div>
                    <div>
                        {/* <p>Average cost of data breech in <span className="emoji" role="img" aria-label="Brasil Flag" aria-hidden="true">🇧🇷</span> – 1.08 million($USD)</p> */}
                        {(options && options.series[0].data && options.series[0].data.length > 0) &&
                            <div style={{marginTop: '20px'}}>
                                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                                    <div style={{alignSelf: 'center'}}>
                                        <p>{t('Potential Overall Monetary Impact')}</p>
                                    </div>
                                    <div style={{alignSelf: 'center'}}>
                                        <p style={{color: 'rgb(64, 84, 106)', fontWeight: 'bold'}}>{costOfDataBreachForCountry} {t('millions USD$')}</p>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'center'}}>
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={options}
                                        />
                                    </div>
                                </div>
                                
                            </div>
                        }
                    </div>
                    
                </div>
                {/* <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        {   privacySurvey &&
                            ReactVirtualizedTable(columns, privacySurvey)
                        } 
                    </div>
                    <div style={{width: '37vw'}}>
                        {
                            overAllDataBreechScore &&
                            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                                <div style={{alignSelf: 'center'}}>
                                    <p>LGPD Non-Compliance Risk</p>
                                </div>
                                <div style={{alignSelf: 'center'}}>
                                    <p style={{color: 'rgb(64, 84, 106)', fontWeight: 'bold'}}>{overAllDataBreechScore} %</p>
                                </div>
                            </div>
                            // <img src="./risk graphic.png" width="524.8" height="32" />
                        }
                        {
                            overAllDataBreechScore && dataBreachImageSrc &&
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <img src={dataBreachImageSrc} width="400" height="49.6" />
                            </div>
                        }
                        {/* <p>Average cost of data breech in <span className="emoji" role="img" aria-label="Brasil Flag" aria-hidden="true">🇧🇷</span> – 1.08 million($USD)</p> */}
                        {/*((options && options.series[0].data && options.series[0].data.length > 0) &&
                            <div style={{marginTop: '20px'}}>
                                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                                    <div style={{alignSelf: 'center'}}>
                                        <p>Potential Overall Monetary Impact</p>
                                    </div>
                                    <div style={{alignSelf: 'center'}}>
                                        <p style={{color: 'rgb(64, 84, 106)', fontWeight: 'bold'}}>{costOfDataBreachForCountry} millions USD$</p>
                                    </div>
                                </div>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options}
                                />
                            </div>
                        }
                    </div>
                </div> */}
                {/* <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{width: '37vw'}}>
                        {
                            (avgCostOverTimeOptions && avgCostOverTimeOptions.series[0].data && avgCostOverTimeOptions.series[0].data.length > 0) &&
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={avgCostOverTimeOptions}
                            />
                        }
                        
                    </div>
                    
                </div> */}
            </div>
        </div>
    )
};

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(withRouter(PrivacyAndDataProtectionDashboardPage));
