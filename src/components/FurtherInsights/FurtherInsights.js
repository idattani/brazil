import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import withAuthorization from '../withAuthorization';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Trans, useTranslation } from 'react-i18next';

import Highcharts, { setOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

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
  table: {
    maxWidth: 380
  }
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
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    color: 'black'
};

const StyledTableCell = withStyles((theme) => ({
    root: {
      fontSize: 12,
      fontWeight: 600,
      borderBottom: "none",
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0
    },
    head: {
        lineHeight: '1.25em'
    }
}))(TableCell);


const SecurityDashboardPage = ({history}) => {
    const uid = firebase.auth().currentUser.uid;
    const classes = useStyles();
    const { t } = useTranslation();
    /* const [width, setWindowWidth] = useState(0)

    useEffect(() => { 

        updateDimensions();
   
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize",updateDimensions)
    }, []);
    
    const updateDimensions = () => {
        const width = window.innerWidth;
        setWindowWidth(width);
    }; */
    const dayTranslation = t('Day');
    const ransomwareImpact = {
        chart: {
            type: 'bar',
            width: 600,
            height: 250
        },
        colors: ['#09a6e1'],
        title: {
            align: 'left',
            style: {
                color: '#8a8c8e'
            },
            text: `${t('Ransomware Impact')} <sup>(${t('Median impact value per day duration')})</sup>`,
            useHTML: true
        },
        xAxis: {
            categories: [`30${dayTranslation}`, `21${dayTranslation}`, `14${dayTranslation}`, `7${dayTranslation}`, `4${dayTranslation}`, `2${dayTranslation}`, `1${dayTranslation}`],
            title: {
                align: 'high',
                text: t('Duration'),
                textAlign: "left",
                rotation: 0,
                offset: 0,
                margin: 0,
                y: -5,
                x: -50,
                style: {
                    color: '#000000'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                align: 'high',
                text: null,
            },
            labels: {
                overflow: 'justify',
                useHTML: true,
                formatter: function () {
                    if (this.value === 0){
                        return `${this.value}`;
                    }
                    const formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        notation: 'compact',
                        minimumFractionDigits: 1
                    });
                    return formatter.format(this.value);
                }
            },
            tickInterval: 210000,
        },
        tooltip: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    color: '#658fc7',
                    crop: false,
                    overflow: 'none',
                    formatter: function() {
                        const formatter = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        });
                        return formatter.format(this.y)
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            data: [991848, 764458, 600914, 356748, 209504, 100909, 52011 ],
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 450,
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

    const dosImpact = {
        chart: {
            type: 'bar',
            width: 600,
            height: 250
        },
        colors: ['#09a6e1'],
        title: {
            align: 'left',
            style: {
                color: '#8a8c8e'
            },
            text: `${t('Denial of Service Interruption Impact')} <sup>(${t('Median impact value per hour duration')})</sup>`,
            useHTML: true
        },
        xAxis: {
            categories: [`48HR`, `24HR`, `18HR`, `12HR`, `10HR`, `8HR`, `6HR`],
            title: {
                align: 'high',
                text: t('Duration'),
                textAlign: "left",
                rotation: 0,
                offset: 0,
                margin: 0,
                y: -5,
                x: -50,
                style: {
                    color: '#000000'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                align: 'high',
                text: null,
            },
            labels: {
                overflow: 'justify',
                useHTML: true,
                formatter: function () {
                    if (this.value === 0){
                        return `${this.value}`;
                    }
                    const formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        notation: 'compact',
                        minimumFractionDigits: 1
                    });
                    return formatter.format(this.value);
                }
            },
            tickInterval: 180000,
        },
        tooltip: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    color: '#658fc7',
                    crop: false,
                    overflow: 'none',
                    formatter: function() {
                        const formatter = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        });
                        return formatter.format(this.y)
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            data: [850562, 425281, 318961, 212641, 177200, 141760, 106320 ],
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 450,
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

    const otherImpact = {
        chart: {
            type: 'bar',
            width: 600,
            height: 250
        },
        colors: ['#09a6e1'],
        title: {
            align: 'left',
            style: {
                color: '#8a8c8e'
            },
            text: `${t('Other Interruption Impact')} <sup>(${t('Median impact value per hour duration')})</sup>`,
            useHTML: true
        },
        xAxis: {
            categories: [`336HR`, `168HR`, `72HR`, `48HR`, `24HR`, `12HR`, `8HR`],
            title: {
                align: 'high',
                text: t('Duration'),
                textAlign: "left",
                rotation: 0,
                offset: 0,
                margin: 0,
                y: -5,
                x: -50,
                style: {
                    color: '#000000'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                align: 'high',
                text: null,
            },
            labels: {
                overflow: 'justify',
                useHTML: true,
                formatter: function () {
                    if (this.value === 0){
                        return `${this.value}`;
                    }
                    const formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        notation: 'compact',
                        minimumFractionDigits: 1
                    });
                    return formatter.format(this.value);
                }
            },
            tickInterval: 60000,
        },
        tooltip: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    color: '#658fc7',
                    crop: false,
                    overflow: 'none',
                    formatter: function() {
                        const formatter = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        });
                        return formatter.format(this.y)
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            data: [276152, 144747, 89867, 62427, 34986, 34986, 34986 ],
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 450,
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

    function createData(ransomwareDuration, lowImpact, highImpact, worstCase) {
        return { ransomwareDuration, lowImpact, highImpact, worstCase };
    }

    function createDosData(interruptionDuration, lowImpact, highImpact, worstCase) {
        return { interruptionDuration, lowImpact, highImpact, worstCase };
    }
      
    const rows = [
        createData(`30 ${dayTranslation}`, '$27,520', '$2,950,272', '$21,502,479'),
        createData(`21 ${dayTranslation}`, '$18,485', '$2,363,433', '$20,993,049'),
        createData(`14 ${dayTranslation}`, '$12,012', '$1,942,036', '$20,490,525'),
        createData(`7 ${dayTranslation}`, '$5,020', '$1,227,091', '$15,534,018'),
        createData(`4 ${dayTranslation}`, '$3,145', '$717,666', '$9,041,170'),
        createData(`2 ${dayTranslation}`, '$1,457', '$350,433', '$4,504,138'),
        createData(`1 ${dayTranslation}`, '$761', '$182,102', '$2,304,427'),
    ];

    const dosRows = [
        createDosData(`48 HR`, '$316,004', '$1,385,121', '$3,882,708'),
        createDosData(`24 HR`, '$158,002', '$692,560', '$1,941,354'),
        createDosData(`18 HR`, '$118,501', '$519,420', '$1,456,015'),
        createDosData(`12 HR`, '$79,001', '$346,280', '$970,677'),
        createDosData(`10 HR`, '$65,834', '$288,567', '$808,897'),
        createDosData(`8 HR`, '$52,667', '$230,853', '$647,118'),
        createDosData(`6 HR`, '$39,500', '$173,140', '$485,338'),
    ];

    const otherImpactRows = [
        createDosData(`336 HR`, '$11,821', '$697,241', '$2,863,293'),
        createDosData(`168 HR`, '$5,950', '$361,922', '$2,190,979'),
        createDosData(`72 HR`, '$3,584', '$223,176', '$1,477,042'),
        createDosData(`48 HR`, '$2,401', '$153,803', '$988,996'),
        createDosData(`24 HR`, '$1,218', '$84,431', '$500,950'),
        createDosData(`12 HR`, '$1,218', '$84,431', '$500,950'),
        createDosData(`8 HR`, '$1,218', '$84,431', '$500,950'),
    ];

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
                    <h3>{t('Further Insights')}</h3>
                </div>
            </div>
            <div style={contentStyle}>
                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{display: 'flex'}}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={ransomwareImpact}
                            />
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <TableContainer style={{marginLeft: '30px'}}>
                                <Table className={classes.table} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center" style={{backgroundColor: '#e9eaea'}}>{t('Ransomware Duration')}</StyledTableCell>
                                            <StyledTableCell align="center" style={{color: '#8a8c8e'}}>{t('Low-impact Ransomware')}</StyledTableCell>
                                            <StyledTableCell align="center" style={{color: '#8a8c8e'}}>{t('High-impact Ransomware')}</StyledTableCell>
                                            <StyledTableCell align="center" style={{color: '#8a8c8e'}}>{t('Worst-case Ransomware')}</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow key={index}>
                                            <StyledTableCell style={{backgroundColor: '#e9eaea'}} component="th" scope="row" align="center">
                                                {row.ransomwareDuration}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{row.lowImpact}</StyledTableCell>
                                            <StyledTableCell align="center">{row.highImpact}</StyledTableCell>
                                            <StyledTableCell align="center">{row.worstCase}</StyledTableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <p style={{fontSize: '10px'}}><i>{t('Impact based on Industry Standard Datasets')}</i></p>
                    </div>
                    
                    {/* <figure><img src='./insights/ransomware_impact.png' style={{maxWidth: '100%', height: 'auto'}} alt="Ransomware Impact" /><figcaption style={{textAlign: 'center'}}><i style={{fontSize: '10px'}}>{t('Impact based on Industry Standard Datasets')}</i></figcaption></figure> */}
                </div>

                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{display: 'flex'}}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={dosImpact}
                            />
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <TableContainer style={{marginLeft: '30px'}}>
                                <Table className={classes.table} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center" style={{backgroundColor: '#e9eaea'}}>{t('Interruption Duration')}</StyledTableCell>
                                            <StyledTableCell align="center" style={{color: '#8a8c8e'}}>{t('Low-impact Interruption')}</StyledTableCell>
                                            <StyledTableCell align="center" style={{color: '#8a8c8e'}}>{t('High-impact Interruption')}</StyledTableCell>
                                            <StyledTableCell align="center" style={{color: '#8a8c8e'}}>{t('Worst-case Interruption')}</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {dosRows.map((row, index) => (
                                        <TableRow key={index}>
                                            <StyledTableCell style={{backgroundColor: '#e9eaea'}} component="th" scope="row" align="center">
                                                {row.interruptionDuration}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{row.lowImpact}</StyledTableCell>
                                            <StyledTableCell align="center">{row.highImpact}</StyledTableCell>
                                            <StyledTableCell align="center">{row.worstCase}</StyledTableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <p style={{fontSize: '10px'}}><i>{t('Impact based on Industry Standard Datasets')}</i></p>
                    </div>
                    
                    {/* <figure><img src='./insights/ransomware_impact.png' style={{maxWidth: '100%', height: 'auto'}} alt="Ransomware Impact" /><figcaption style={{textAlign: 'center'}}><i style={{fontSize: '10px'}}>{t('Impact based on Industry Standard Datasets')}</i></figcaption></figure> */}
                </div>

                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{display: 'flex'}}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={otherImpact}
                            />
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <TableContainer style={{marginLeft: '30px'}}>
                                <Table className={classes.table} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center" style={{backgroundColor: '#e9eaea'}}>{t('Interruption Duration')}</StyledTableCell>
                                            <StyledTableCell align="center" style={{color: '#8a8c8e'}}>{t('Low-impact Interruption')}</StyledTableCell>
                                            <StyledTableCell align="center" style={{color: '#8a8c8e'}}>{t('High-impact Interruption')}</StyledTableCell>
                                            <StyledTableCell align="center" style={{color: '#8a8c8e'}}>{t('Worst-case Interruption')}</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {otherImpactRows.map((row, index) => (
                                        <TableRow key={index}>
                                            <StyledTableCell style={{backgroundColor: '#e9eaea'}} component="th" scope="row" align="center">
                                                {row.interruptionDuration}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{row.lowImpact}</StyledTableCell>
                                            <StyledTableCell align="center">{row.highImpact}</StyledTableCell>
                                            <StyledTableCell align="center">{row.worstCase}</StyledTableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <p style={{fontSize: '10px'}}><i>{t('Impact based on Industry Standard Datasets')}</i></p>
                    </div>
                    
                    {/* <figure><img src='./insights/ransomware_impact.png' style={{maxWidth: '100%', height: 'auto'}} alt="Ransomware Impact" /><figcaption style={{textAlign: 'center'}}><i style={{fontSize: '10px'}}>{t('Impact based on Industry Standard Datasets')}</i></figcaption></figure> */}
                </div>
                
                {/* <div style={{display: 'flex', justifyContent: 'center'}}>
                    <figure><img src='./insights/denial_service_interruption_impact.png' style={{maxWidth: '100%', height: 'auto'}} alt="Denial of Service Interruption Impact" /><figcaption style={{textAlign: 'center'}}><i style={{fontSize: '10px'}}>{t('Impact based on Industry Standard Datasets')}</i></figcaption></figure>
                </div> */}
                {/* <div style={{display: 'flex', justifyContent: 'center'}}>
                    <figure><img src='./insights/other_interruption_impact.png' style={{maxWidth: '100%', height: 'auto'}} alt="Other Interruption Impact" /><figcaption style={{textAlign: 'center'}}><i style={{fontSize: '10px'}}>{t('Impact based on Industry Standard Datasets')}</i></figcaption></figure>
                </div> */}
            </div>
        </div>
    )
};
const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(withRouter(SecurityDashboardPage));
