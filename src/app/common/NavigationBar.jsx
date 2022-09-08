import React ,{useEffect, useState} from 'react';
import styles from './navigation-bar.module.css';
import logoImg from '../../@assets/HAEAHN_LOGO.png';
import backButtonImg from '../../@assets/BACK_BUTTON.png';
import Tooltip from '@mui/material/Tooltip';
import Team from '../page/Team';

function NavigationBar(props){

    const [isBackButtonClicked, setIsBackButtonClicked] = useState(false);

    const OnBackButtonClick = () => {
        setIsBackButtonClicked(true)
    }

    const BackButton = () => {
        if(props.isBackButtonVisible){
            return(
                <Tooltip title="Team Performance Overview 로 돌아가기">
                    <img src={backButtonImg} alt="back" className={styles.back_button} onClick={OnBackButtonClick}/>
                </Tooltip>
            );
        }
        else{
            return(<div></div>);
        }
        
    }

    if(!isBackButtonClicked){
        return (
            <div className={styles.wrapper}>
                <div className={styles.block_column_wrapper} style={{paddingLeft: '20px'}}>
                    <img src={logoImg} alt="logo"/>
                    <BackButton/>
                </div>
            </div>
        );
    }
    else{
        return (
            <Team user={props.user} />
        )
    }
}

export default NavigationBar;