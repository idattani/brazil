import React  from 'react';
import './Block.css';
import { useTranslation } from 'react-i18next';

const block=(props) => {
    const { t } = useTranslation();
    return(
<div className="Block">
    <p hidden>props.blockNumber</p>
    <h3 style={{color: '#02397f'}}><strong> {t(`privacy_data_protection.${props.blockHeader}`)}</strong></h3>
    <p id="p_wrap" style={{color: '#02397f'}}>{t(`privacy_data_protection.${props.blockBody}`)}</p>
</div>
)
};
export default block;
