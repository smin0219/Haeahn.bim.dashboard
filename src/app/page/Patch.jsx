import React ,{useEffect, useState} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import styles from './css/login.module.css';
import pageStyles from './css/page.module.css';
import logoImg from './img/HAEAHN_LOGO.png';
import Data from '../data/Data';
import { fontSize } from '@mui/system';

function Patch(){
    return (
        <main className={pageStyles.page_wrapper}>
            <section className={pageStyles.page_container} style = {{justifyContent: 'center'}}>
                <div className={styles.content_wrapper} style={{margin:'auto', width: '500px', height: '500px'}}>
                    <div className={styles.block_column_wrapper}>
                        <img src={logoImg} className={styles.logo_img} alt='logo'></img>
                        <div style={{fontWeight: "500", paddingBottom: '30px' }}>Haeahn BIM Log Dashboard v1.0</div>
                        <h1 style={{color:"red"}}>정기 점검 (2022-08-01 ~ 2022-08-03)</h1>
                        <h4 style={{color:"red"}}>점검 내용: 데이터 업데이트 속도 최적화 및 버그 수정</h4>
                        {/* <form onSubmit={handleSubmit}>
                            <label>
                            <p>Username</p>
                            <input type="text" onChange={e => setUserId(e.target.value)} />
                            </label>
                            <label>
                            <p>Password</p>
                            <input type="password" onChange={e => setPassword(e.target.value)} />
                            </label>
                            <div style={{paddingTop: '20px'}}>
                            <button type="submit">Submit</button>
                            </div>
                            <div>
                            <br/>
                            {alertMsg}
                            </div>
                        </form> */}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Patch; 