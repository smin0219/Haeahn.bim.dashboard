import React, {useState, useEffect} from 'react';

import styles from './css/overview.module.css';
import pageStyles from './css/page.module.css';
import NavigationBar from '../common/NavigationBar';
import EmployeeSearchBar from '../common/EmployeeSearchBar';
import ProjectSearchBar from '../common/ProjectSearchBar';

import Tooltip from '@mui/material/Tooltip';
import Moment from 'moment';
import { Audio } from  'react-loader-spinner'
import Data from '../data/Data';

function Team (props) {

    const [projects, setProjects] = useState({});
    const [selectedProject, setSelectedProject] = useState('');
    const [isUpdated, setIsUpdated] = useState(true);

    const OnProjectClick = (event, props) => {
        setSelectedProject(props);
    }

    const user = props.user;
    const employeeId = '20000102';//user.resultMessage;
    const employeeName = user.resultUserName;
    const loginId = user.resultMail.substring(0, user.resultMail.indexOf('@'));
    const profileImg = "https://hub.haeahn.com/Storage/GW/ImageStorage/Employee/" + loginId + ".jpg";

    useEffect(() => {
        if(isUpdated){
            Data.GetTeamProjects(employeeId).then(response => {
                var projects = response.data;
                var defaultProject = projects[0];
    
                if(projects.length > 0){
                    setProjects(projects);
                    setSelectedProject(defaultProject);
                }
                else{
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
                        <div className={styles.title_label} style={{ width: '350px' }}>Team Performance Overview</div>
                        <div className={styles.block_column_wrapper} style={{ width: '240px', marginLeft: '438px' }}>
                            <img className={styles.profile_img} src={profileImg} alt="profile" />
                            <div className={styles.profile_label}>환영합니다, {employeeName} 님</div>
                        </div>
                    </div>
                    <div className={styles.column_row_wrapper} style={{ marginLeft: '5px' }}>
                        <div className={styles.block_column_wrapper}>
                        <div className={styles.block_row_wrapper}>
                                <div className={styles.content_wrapper} style={{textAlign: 'left', height: '315px'}}>
                                    <h2 className={styles.content_title} style={{paddingLeft: '15px'}}>프로젝트</h2>
                                    <ProjectSearchBar/>
                                    <div className={styles.block_row_wrapper} style={{height: "15px"}}>
                                        <div className={styles.content_sub_title} style={{width: "60px", padding: 0, paddingLeft: "15px"}}>
                                            Project Code 
                                        </div>
                                        <div className={styles.content_sub_title} style={{width: "400px"}}>
                                            Project Name
                                        </div>
                                        <div className={styles.content_sub_title} style={{width: "90px", paddingLeft: 5}}>
                                            Start Date
                                        </div>
                                        <div className={styles.content_sub_title} style={{width: "90px", paddingLeft: 5}}>
                                            End Date
                                        </div>
                                    </div>
                                    {projects.length != undefined ? projects.map((project, i) => {
                                            return (
                                                <Tooltip key={i} title={project.PROJ_NM}>
                                                    <div className={styles.project_content_wrapper} style={{borderRadius:'10px', borderWidth:'1px', border: selectedProject.PROJ_CD == project.PROJ_CD ? '1px solid #1974d2' : '1px solid #F1F1F1'}} onClick={(e) => OnProjectClick(e, project)}>
                                                        <div className={styles.block_row_wrapper} style={{width: '700px'}}>
                                                            <div className={styles.project_content} style={{lineHeight: "37px", width: "60px", paddingLeft: "15px"}}>{project.PROJ_CD}</div>
                                                            <div className={styles.project_content}  style={{lineHeight: "37px", width: "420px" }}>{project.PROJ_NM}</div>
                                                            <div className={styles.project_content}  style={{lineHeight: "37px", width: "90px"}}>{Moment(project.START_DT).format('YYYY-MM-DD')}</div>
                                                            <div className={styles.project_content}  style={{lineHeight: "37px", width: "90px"}}>{project.END_DT == null ? "진행 중" : Moment(project.END_DT).format('YYYY-MM-DD')}</div>
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            );
                                        }) : <div className={styles.project_content} style={{paddingTop: '80px'}} >기간 내에 참여하신 BIM 프로젝트가 존재하지 않습니다.</div>
                                    }                                    
                                </div>
                                <div className={styles.content_wrapper} style={{width: '350px', textAlign: 'left', height: '315px'}}>
                                    <h2 className={styles.content_title} style={{paddingLeft: '15px'}}>BIM 작업량 추이</h2>
                                    <div className="transaction-xy-chart" style={{top:"-10px", height:"290px"}}></div>
                                </div>                                
                            </div>
                            <div className={styles.block_row_wrapper}>
                                <div className={styles.content_wrapper} style={{textAlign: 'left', height: '315px'}}>
                                    <h2 className={styles.content_title} style={{paddingLeft: '15px'}}>팀원</h2>
                                    <EmployeeSearchBar buttonLabel="필터"/>
                                    <div className={styles.block_row_wrapper} style={{height: "15px"}}>
                                        <div className={styles.content_sub_title} style={{width: "40px"}}>
                                            Name 
                                        </div>
                                        <div className={styles.content_sub_title} style={{width: "40px"}}>
                                            Position
                                        </div>
                                        <div className={styles.content_sub_title} style={{width: "395px"}}>
                                            Recent Project
                                        </div>                                        
                                        <div className={styles.content_sub_title} style={{width: "70px"}}>
                                            Main Skill
                                        </div>
                                        <div className={styles.content_sub_title} style={{width: "70px"}}>
                                            Elements 
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.content_wrapper} style={{width: '350px', textAlign: 'left', height: '315px'}}>
                                    <h2 className={styles.content_title} style={{paddingLeft: '15px'}}>Team Performance</h2>
                                    {/* 여기에 레이더 차트 */}
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