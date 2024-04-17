import React, { useState, useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';


const RiskMeter = (props) => {

    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const score = props.score;
    let marginLeft = null;
    let color = null;
    if (score >= 46.948) {
        color = '#ac1e2c';
        marginLeft = '42px'
    } else if (score >= 21.053 && score < 46.948) {
        color = '#e67225';
        marginLeft = '146px';
    } else if (score >= 9.036 && score < 21.053) {
        marginLeft = null;
        color = '#f5a81b';
    } else if (score >=3.718 && score < 9.036) {
        marginLeft = '357px'
        color = '#9eb251';
    } else {
        marginLeft = '462px'
        color = '#799b3d';
    }

    return(
        <div style={{marginBottom: '25px', width: '525.6px', height: '49.6px'}}>
            <div style={{display: 'flex', width: '100%', marginBottom: '6px'}}>
                <div className="drop" style={{backgroundColor: color, marginLeft: marginLeft}}></div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                <div style={{backgroundColor: '#ac1e2c', marginLeft: '0.25rem', width: '100%', height: '14px'}}></div>
                <div style={{backgroundColor: '#e67225', marginLeft: '0.25rem', width: '100%', height: '14px'}}></div>
                <div style={{backgroundColor: '#f5a81b', marginLeft: '0.25rem', width: '100%', height: '14px'}}></div>
                <div style={{backgroundColor: '#9eb251', marginLeft: '0.25rem', width: '100%', height: '14px'}}></div>
                <div style={{backgroundColor: '#799b3d', marginLeft: '0.25rem', width: '100%', height: '14px'}}></div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                <div style={{marginLeft: '-0.25rem', width: '100%', height: '14px', fontSize: '11px', color: '#606060'}}><span style={{fontWeight: '600'}}>100</span><span style={{marginLeft: '20px', color: '#8a8687'}}>{t('Very High')}</span></div>
                <div style={{marginLeft: '-0.25rem', width: '100%', height: '14px', fontSize: '11px', color: '#606060'}}><span style={{fontWeight: '600'}}>46.948</span><span style={{marginLeft: '20px', color: '#8a8687'}}>{t('High')}</span></div>
                <div style={{marginLeft: '-0.25rem', width: '100%', height: '14px', fontSize: '11px', color: '#606060'}}><span style={{fontWeight: '600'}}>21.053</span><span style={{marginLeft: '8px', color: '#8a8687'}}>{t('Moderate')}</span></div>
                <div style={{marginLeft: '-0.25rem', width: '100%', height: '14px', fontSize: '11px', color: '#606060'}}><span style={{fontWeight: '600'}}>9.036</span><span style={{marginLeft: '20px', color: '#8a8687'}}>{t('Low')}</span></div>
                <div style={{marginLeft: '-0.25rem', width: '100%', height: '14px', fontSize: '11px', color: '#606060'}}><span style={{fontWeight: '600'}}>3.718</span><span style={{marginLeft: '10px', color: '#8a8687'}}>{t('Very Low')}</span><span style={{marginLeft: language === 'pt-BR' ? '7px' : '20px', color: '#606060'}}>0</span></div>
            </div>
        </div>
    )
};
export default RiskMeter;
