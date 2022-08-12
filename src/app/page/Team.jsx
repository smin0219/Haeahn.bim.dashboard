import React, { useState, useEffect } from 'react';

import styles from './css/overview.module.css';
import pageStyles from './css/page.module.css';
import NavigationBar from '../common/NavigationBar';
import EmployeeSearchBar from '../common/EmployeeSearchBar';
import ProjectSearchBar from '../common/ProjectSearchBar';
import MuiDatePicker from '../common/MuiDatePicker';
import ProjectComboBox from '../common/ProjectComboBox';

import Tooltip from '@mui/material/Tooltip';
import Moment from 'moment';
import { Audio } from 'react-loader-spinner'
import Data from '../data/Data';
import infoImg from './img/INFO_ICON.png';

function Team(props) {

    const [projects, setProjects] = useState({});
    const [selectedProject, setSelectedProject] = useState('');
    const [isUpdated, setIsUpdated] = useState(true);

    const [startDate, setStartDate] = useState(Moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(Moment().subtract(1, 'day').startOf('day').format('YYYY-MM-DD'));
    const [isDateUpdated, setIsDateUpdated] = useState(true);


    const OnProjectClick = (event, props) => {
        setSelectedProject(props);
    }

    const user = props.user;
    const employeeId = '20000102';//user.resultMessage;
    const employeeName = user.resultUserName;
    const loginId = user.resultMail.substring(0, user.resultMail.indexOf('@'));
    const profileImg = "https://hub.haeahn.com/Storage/GW/ImageStorage/Employee/" + loginId + ".jpg";

    useEffect(() => {
        if (isUpdated) {
            Data.GetTeamProjects(employeeId).then(response => {
                var projects = response.data;
                var defaultProject = projects[0];

                if (projects.length > 0) {
                    setProjects(projects);
                    setSelectedProject(defaultProject);
                }
                else {
                    setProjects({});
                    setSelectedProject('');
                }
                setIsUpdated(false);
            });

        }
    }, [selectedProject]);

    return (
        <main className={pageStyles.page_wrapper}>
            <section className={pageStyles.page_container}>
                <div className={styles.block_column_wrapper}>
                    <div className={styles.block_row_wrapper} style={{ height: '100px' }}>
                        <div className={styles.title_label} style={{ width: '300px' }}>Team Performance Overview</div>
                        <Tooltip title="전일 12시 10분 이전 데이터만 표시 됩니다.">
                            <img className={styles.info_img} src={infoImg} alt="info" />
                        </Tooltip>
                        <MuiDatePicker date={startDate} setDate={setStartDate} setIsDateUpdated={setIsDateUpdated} />
                        <div style={{ height: '10px', paddingTop: '42px', paddingLeft: '20px', paddingRight: '20px' }}>-</div>
                        <MuiDatePicker date={endDate} setDate={setEndDate} setIsDateUpdated={setIsDateUpdated} />
                        <div className={styles.block_column_wrapper} style={{ width: '240px', marginLeft: '10px' }}>
                            <img className={styles.profile_img} src={profileImg} alt="profile" />
                            <div className={styles.profile_label}>환영합니다, {employeeName} 님</div>
                        </div>
                    </div>
                    <div className={styles.column_row_wrapper} style={{ marginLeft: '5px' }}>
                        <div className={styles.block_column_wrapper}>
                            <div className={styles.block_row_wrapper}>
                                <div className={styles.content_wrapper} style={{ textAlign: 'left', height: '120px' }}>
                                    <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>프로젝트</h2>
                                    <div className={styles.block_row_wrapper} style={{ height: "15px" }}>
                                        <div className={styles.content_sub_title} style={{ width: "60px", padding: 0, paddingLeft: "15px" }}>
                                            Project Code
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "400px" }}>
                                            Project Name
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "90px", paddingLeft: 5 }}>
                                            Start Date
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "90px", paddingLeft: 5 }}>
                                            End Date
                                        </div>
                                    </div>
                                    <div style={{ paddingLeft: '2px' }}>
                                        <ProjectComboBox />
                                    </div>
                                </div>
                                <div className={styles.content_wrapper} style={{ width: '350px', textAlign: 'left', height: '315px' }}>
                                    <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>BIM 작업량 추이</h2>
                                    <div className="transaction-xy-chart" style={{ top: "-10px", height: "290px" }}></div>
                                </div>
                            </div>
                            <div className={styles.block_row_wrapper}>
                                <div className={styles.content_wrapper} style={{ textAlign: 'left', height: '315px' }}>
                                    <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>팀원</h2>

                                    <div className={styles.block_row_wrapper} style={{ height: "15px" }}>
                                        <div className={styles.content_sub_title} style={{ width: "40px" }}>
                                            Name
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "40px" }}>
                                            Position
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "395px" }}>
                                            Recent Project
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "70px" }}>
                                            Main Skill
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "70px" }}>
                                            Elements
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
export default Team;