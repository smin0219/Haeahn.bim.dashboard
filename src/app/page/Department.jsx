import React, {useState} from 'react';

import styles from './css/overview.module.css';
import pageStyles from './css/page.module.css';
import NavigationBar from '../common/NavigationBar';
import EmployeeSearchBar from '../common/EmployeeSearchBar';
import ProjectSearchBar from '../common/ProjectSearchBar';

import Tooltip from '@mui/material/Tooltip';
import Moment from 'moment';
import Data from '../data/Data';

function Department (props) {

    const [projects, setProjects] = useState({});
    const [selectedProject, setSelectedProject] = useState('');

    const GetProjects = (employeeId, startDate, endDate) => {
        return Data.GetProjects(employeeId, startDate, endDate);
    }
    const OnProjectClick = (event, props) => {
        setSelectedProject(props);
    }

    const user = props.user;
    const profileImg = "https://hub.haeahn.com/Storage/GW/ImageStorage/Employee/" + "jaehkim" + ".jpg";
    const employeeName = "김재희B"

    return (
        <main className={pageStyles.page_wrapper}>
            <section className={pageStyles.page_container}>
                <div className={styles.block_column_wrapper}>
                    <div className={styles.block_row_wrapper} style={{ height: '100px' }}>
                        <div className={styles.title_label} style={{ width: '350px' }}>Department Performance Overview</div>
                        <div className={styles.block_column_wrapper} style={{ width: '240px', marginLeft: '442px' }}>
                            <img className={styles.profile_img} src={profileImg} alt="profile" />
                            <div className={styles.profile_label}>환영합니다, {employeeName} 님</div>
                        </div>
                    </div>
                    <div className={styles.column_row_wrapper} style={{ marginLeft: '5px' }}>
                        <div className={styles.block_column_wrapper}>
                            <div className={styles.block_row_wrapper}>
                                <div className={styles.content_wrapper} style={{textAlign: 'left', height: '315px'}}>
                                    <h2 className={styles.content_title} style={{paddingLeft: '15px'}}>부문 임직원</h2>
                                    <EmployeeSearchBar buttonLabel="팀 구성하기"/>
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
                                    <h2 className={styles.content_title} style={{paddingLeft: '15px'}}>Department Performance</h2>
                                    {/* 여기에 레이더 차트 */}
                                </div>                                
                            </div>
                            <div className={styles.block_row_wrapper}>
                                <div className={styles.content_wrapper} style={{textAlign: 'left', height: '315px'}}>
                                    <h2 className={styles.content_title} style={{paddingLeft: '15px'}}>프로젝트</h2>
                                    <ProjectSearchBar/>
                                    <div className={styles.block_row_wrapper} style={{height: "15px"}}>
                                        <div className={styles.content_sub_title} style={{width: "60px"}}>
                                            Project Code 
                                        </div>
                                        <div className={styles.content_sub_title} style={{width: "405px"}}>
                                            Project Name
                                        </div>
                                        <div className={styles.content_sub_title} style={{width: "40px"}}>
                                            PM
                                        </div>
                                        <div className={styles.content_sub_title} style={{width: "130px"}}>
                                            Last Modified
                                        </div>
                                    </div>
                                    {projects.data != undefined ? projects.data.map((project, i) => {
                                            return (
                                                <Tooltip key={i} title={project.project_name}>
                                                    <div className={styles.project_content_wrapper} style={{borderRadius:'10px', borderWidth:'1px', border: selectedProject.project_code == project.project_code ? '1px solid #1974d2' : '1px solid #F1F1F1'}} onClick={(e) => OnProjectClick(e, project)}>
                                                        <div className={styles.block_row_wrapper} style={{width: '650px'}}>
                                                            <div className={styles.project_content} style={{lineHeight: "37px", width: "60px"}}>{project.project_code}</div>
                                                            <div className={styles.project_content}  style={{lineHeight: "37px", width: "405px" }}>{project.project_name}</div>
                                                            <div className={styles.project_content}  style={{lineHeight: "37px", width: "40px" }}>PM 이름</div>
                                                            <div className={styles.project_content}  style={{lineHeight: "37px", width: "106px"}}>{Moment(project.occurred_on).format('YYYY-MM-DD HH:mm')}</div>
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
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
export default Department;