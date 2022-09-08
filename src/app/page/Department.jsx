import React, { useEffect, useState } from 'react';

import styles from './css/overview.module.css';
import pageStyles from './css/page.module.css';
import NavigationBar from '../common/NavigationBar';
import EmployeeSearchBar from '../common/EmployeeSearchBar';
import ProjectSearchBar from '../common/ProjectSearchBar';

import Tooltip from '@mui/material/Tooltip';
import Moment from 'moment';
import Data from '../data/Data';
import { MuiThemeProvider } from '@material-ui/core';

function Department(props) {

    const [projects, setProjects] = useState(true);
    const [selectedProject, setSelectedProject] = useState('');
    const [departmentMembers, setDepartmentMembers] = useState(true);

    const OnProjectClick = (event, props) => {
        setSelectedProject(props);
    }
    const departmentCode = 'D0510'; //추후 로그인 정보와 연동
    //const departmentCode = 'D3500';

    useEffect(() => {
        Data.GetDepartmentMembers(departmentCode).then(response => {
            setDepartmentMembers(response.data);
        })
        Data.GetDepartmentProjects(departmentCode).then(response => {
            setProjects(response.data);

        })
    }, []);

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
                                <div className={styles.content_wrapper} style={{ textAlign: 'left', height: '315px' }}>
                                    <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>부문 임직원</h2>
                                    <EmployeeSearchBar buttonLabel="팀 구성하기" />
                                    <div className={styles.block_row_wrapper} style={{ height: "15px" }}>
                                        <div className={styles.content_sub_title} style={{ width: "60px" }}>
                                            이름
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "40px" }}>
                                            직책
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "330px" }}>
                                            최근 프로젝트
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "80px" }}>
                                            총 객체 수
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "90px" }}>
                                            최근 작업 날짜
                                        </div>
                                    </div>
                                    <div style={{ marginTop: "5px", height: "220px", overflowY: "auto", overflowX: "hidden" }}>
                                        {departmentMembers.length != undefined ? departmentMembers.map((member, i) => {
                                            return (
                                                <div key={i} className={styles.list_wrapper} style={{ borderRadius: '10px', borderWidth: '1px', border: '1px solid #F1F1F1' }}>
                                                    <div className={styles.block_row_wrapper} style={{ width: '700px' }}>
                                                        <div className={styles.list_content} style={{ lineHeight: "37px", width: "65px" }}>{member.uname}</div>
                                                        <div className={styles.list_content} style={{ lineHeight: "37px", width: "45px" }}>{member.tname}</div>
                                                        <div className={styles.list_content} style={{ lineHeight: "37px", width: "340px" }}>{member.pname}</div>
                                                        <div className={styles.list_content} style={{ lineHeight: "37px", width: "85px" }}>{member.total_transaction_count}</div>
                                                        <div className={styles.list_content} style={{ lineHeight: "37px", width: "100px" }}>{Moment(member.max_date).format('YYYY-MM-DD')}</div>
                                                    </div>
                                                </div>
                                            );
                                        }) : <div className={styles.project_content} style={{ paddingTop: '80px' }} >기간 내에 참여하신 BIM 프로젝트가 존재하지 않습니다.</div>
                                        }
                                    </div>
                                </div>
                                <div className={styles.content_wrapper} style={{ width: '335px', textAlign: 'left', height: '315px' }}>
                                    <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>Department Performance</h2>
                                    {/* 여기에 레이더 차트 */}
                                </div>
                            </div>
                            <div className={styles.block_row_wrapper}>
                                <div className={styles.content_wrapper} style={{ textAlign: 'left', height: '315px' }}>
                                    <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>프로젝트</h2>
                                    <ProjectSearchBar />
                                    <div className={styles.block_row_wrapper} style={{ height: "15px" }}>
                                        <div className={styles.content_sub_title} style={{ width: "60px" }}>
                                            프로젝트 코드
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "390px" }}>
                                            프로젝트명
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "40px" }}>
                                            PM
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "90px" }}>
                                            최근 작업 날짜
                                        </div>
                                    </div>
                                    <div style={{ marginTop: "5px", height: "220px", overflowY: "auto", overflowX: "hidden" }}>
                                        {projects.length != undefined ? projects.map((project, i) => {
                                            return (
                                                <div key={i} className={styles.list_wrapper} style={{ borderRadius: '10px', borderWidth: '1px', border: '1px solid #F1F1F1', overflow: "hidden" }}>
                                                    <div className={styles.block_row_wrapper} style={{ width: '645px' }}>
                                                        <div className={styles.list_content} style={{ lineHeight: "37px", width: "65px" }}>{project.proj_cd}</div>
                                                        <div className={styles.list_content} style={{ lineHeight: "37px", width: "400px", textOverflow: "ellipsis", overflowY: "hidden"}}>{project.proj_nm}</div>
                                                        <div className={styles.list_content} style={{ lineHeight: "37px", width: "45px" }}>{project.user_nm}</div>
                                                        <div className={styles.list_content} style={{ lineHeight: "37px", width: "95px" }}>{Moment(project.start_dt).format('YYYY-MM-DD')}</div>
                                                    </div>
                                                </div>
                                            );
                                        }) : <div className={styles.project_content} style={{ paddingTop: '80px' }} >기간 내에 참여하신 BIM 프로젝트가 존재하지 않습니다.</div>
                                        }
                                    </div>
                                </div>
                                <div className={styles.content_wrapper} style={{ width: '350px', textAlign: 'left', height: '315px' }}>
                                    <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>BIM 작업량 추이</h2>
                                    <div className="transaction-xy-chart" style={{ top: "-10px", height: "290px" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main >
    )
}
export default Department;