import React  from 'react';
import './Block.css';
import { useTranslation } from 'react-i18next';

const block = (props) => {
    const { t } = useTranslation();
    return(
        <div className="Block" style={{width: '95vw'}}>
            <p hidden>props.blockNumber</p>
            <h3 style={{color: '#02397f'}}><strong> {t(`cyber_insurance_application.${props.blockHeader}`)}</strong></h3>
            {
                props.blockBody && <p id="p_wrap" style={{color: '#02397f'}}>{t(`cyber_insurance_application.${props.blockBody}`)}</p>
            }
        </div>
    )
};
export default block;
