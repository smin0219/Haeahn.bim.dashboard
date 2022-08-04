import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import Moment from 'moment';
import Tooltip from '@mui/material/Tooltip';


import styles from './css/overview.module.css';
import pageStyles from './css/page.module.css';

import TabBar from '../common/TabBar';
import NavigationBar from '../common/NavigationBar';

import Employee from './Employee';
import Team from './Team';
import Department from './Department';

import Data from '../data/Data';

export default function Overview(){

    const location = useLocation();

    const [user, setUser] = useState(location.state.userObj);
    const [userLevel, setUserLevel] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);
    

    useEffect(() => {
        Data.GetTeamProjects(user.resultMessage).then(response => {
            if(response.data.length > 0){
                setUserLevel(1);
            }
        })
    }, [userLevel])
    
    function ShowPage(currentTab) {
        if(currentTab === 0){
            return <Employee user={user}/>
        }
        else if(currentTab === 1){
            return <Team user={user}/>
        }
        else{
            return <Department user={user}/>
        }
       
    }

    return (
        <main className={pageStyles.page_wrapper}>
            <div className={styles.block_column_wrapper}>
                <div style={{paddingLeft: "90px"}}>
                    <TabBar level={userLevel} currentTab={currentTab} setCurrentTab={setCurrentTab}/>
                </div>
                <section className={pageStyles.page_container}>
                    <div className={styles.block_column_wrapper}>
                        <NavigationBar />
                    </div>
                    {ShowPage(currentTab)}
                </section>
            </div>
        </main>
    )
}
