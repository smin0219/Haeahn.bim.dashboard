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
import { ColorSet } from '@amcharts/amcharts4/core';
import Chart from '../chart/Chart';
import chartStyles from '../chart/chart.css';
import { flatten } from '@amcharts/amcharts4/.internal/core/utils/Iterator';

function Team(props) {

    const [projects, setProjects] = useState({});
    const [selectedProject, setSelectedProject] = useState('');
    const [startDate, setStartDate] = useState(Moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(Moment().subtract(1, 'day').startOf('day').format('YYYY-MM-DD'));
    const [isUpdated, setIsUpdated] = useState(true);
    const [isDateUpdated, setIsDateUpdated] = useState(true);
    const [teamMembers, setTeamMembers] = useState(true);

    const OnMemberClick = (event, props) => {
        console.log(event)
    }

    const user = props.user;
    const employeeId = '20000102';//user.resultMessage;
    const employeeName = user.resultUserName;
    const loginId = user.resultMail.substring(0, user.resultMail.indexOf('@'));
    const profileImg = "https://hub.haeahn.com/Storage/GW/ImageStorage/Employee/" + loginId + ".jpg";
    

    
    const CreateGanttChartData = (data, colors, parentCategory) => {
        var ganttData = [];
        if (parentCategory == "Model") {
            for (let i = 0; i < data.length; i++) {
                ganttData.push({
                    parentCategory: parentCategory,
                    //categoryName: data[i].category_name,
                    fromDate: Moment(data[i].occurred_on).format('YYYY-MM-DD'),
                    toDate: Moment(data[i].occurred_on).add(1, 'days').format('YYYY-MM-DD'),
                    color: colors[0]
                    //color: ColorSet.getIndex(0).brighten(0)
                })
            }
        }
        if (parentCategory == "Annotation") {
            for (let i = 0; i < data.length; i++) {
                ganttData.push({
                    parentCategory: parentCategory,
                    //categoryName: data[i].category_name,
                    fromDate: Moment(data[i].occurred_on).format('YYYY-MM-DD'),
                    toDate: Moment(data[i].occurred_on).add(1, 'days').format('YYYY-MM-DD'),
                    color: colors[1]
                    //color: ColorSet.getIndex(0).brighten(0)
                })
            }
        }
        else {

        }
        //console.log(ganttData);
        return ganttData;
        
    }

    const UpdateCharts = (projectCode) => {
        let ganttChartData = []
        let ganttChartModelData = []
        let ganttChartAnnotationData = []
        let flattenData = []
        let colors = ["#fec8cd", "#d291bc", "#e0bbe4", "#957dad", "#ffdfd3"]

        Data.GetModelLogByTeam(projectCode, startDate, endDate).then(response => {
            let data = response.data
            ganttChartModelData = CreateGanttChartData(data, colors, "Model")
            ganttChartData.push(ganttChartModelData)
        })

        Data.GetAnnotationLogByTeam(projectCode, startDate, endDate).then(response => {
            let data = response.data
            ganttChartAnnotationData = CreateGanttChartData(data, colors, "Annotation")
            ganttChartData.push(ganttChartAnnotationData)
            flattenData = ganttChartData.flat(Infinity)

            let ganttChart = Chart.GanttChart("gantt-chart", flattenData, startDate, endDate)
            Chart.GanttSeries(ganttChart)
        })        
    }

    useEffect(() => {
        if(isUpdated){
            if(isDateUpdated){ //날짜가 업데이트 되면
                Data.GetTeamProjects(employeeId).then(response => {
                    var projects = response.data;
                    var defaultProject = projects[0];                 
                    if (projects.length > 0) {                      
                        setProjects(projects);
                        setSelectedProject(defaultProject.PROJ_CD);

                        Data.GetTeamMembers(defaultProject.PROJ_CD)
                        .then(response => {
                            setTeamMembers(response.data);             
                        })
                        .catch(error => {
                            setTeamMembers(false);
                        });
                        UpdateCharts(defaultProject.PROJ_CD);   
                    }
                    else {
                        setProjects({});
                        setSelectedProject('');
                    }
                    setIsUpdated(false);
                    setIsDateUpdated(false);
                });
            }
            else{ //날짜가 업데이트 되지 않으면        
                if (projects.length > 0) {
                    Data.GetTeamMembers(selectedProject.PROJ_CD)
                    .then(response => {
                        setTeamMembers(response.data);
                    })
                    .catch(error => {
                        setTeamMembers(false);
                    });
                    UpdateCharts(selectedProject.PROJ_CD);   
                }
                setIsUpdated(false);
            }
        }
    }, [selectedProject, startDate, endDate]);

    return (
        <main className={pageStyles.page_wrapper}>
            <section className={pageStyles.page_container}>
                <div className={styles.block_column_wrapper}>
                    <div className={styles.block_row_wrapper} style={{ height: '100px' }}>
                        <div className={styles.title_label} style={{ width: '350px' }}>Team Performance Overview</div>
                        <Tooltip title="전일 12시 10분 이전 데이터만 표시 됩니다.">
                            <img className={styles.info_img} src={infoImg} alt="info" />
                        </Tooltip>
                        <MuiDatePicker date={startDate} setDate={setStartDate} setIsUpdated={setIsUpdated} setIsDateUpdated={setIsDateUpdated} />
                        <div style={{ height: '10px', paddingTop: '42px', paddingLeft: '20px', paddingRight: '20px' }}>~</div>
                        <MuiDatePicker date={endDate} setDate={setEndDate} setIsUpdated={setIsUpdated} setIsDateUpdated={setIsDateUpdated} />
                        <div className={styles.block_column_wrapper} style={{ width: '220px', marginLeft: '80px' }}>
                            <img className={styles.profile_img} src={profileImg} alt="profile" />
                            <div className={styles.profile_label}>환영합니다, {employeeName} 님</div>
                        </div>
                    </div>
                    <div className={styles.column_row_wrapper} style={{ marginLeft: '5px' }}>
                        <div className={styles.block_column_wrapper}>
                            <div className={styles.block_row_wrapper}>
                                <div className={styles.block_column_wrapper}>
                                    <div className={styles.content_wrapper} style={{ textAlign: 'left', height: '90px' }}>
                                        <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>프로젝트</h2>
                                        {/* <div className={styles.block_row_wrapper} style={{ height: "15px" }}>
                                            <div className={styles.content_sub_title} style={{ width: "60px", padding: 0, paddingLeft: "15px" }}>
                                                Project Code
                                            </div>
                                            <div className={styles.content_sub_title} style={{ width: "300px", paddingLeft: 5  }}>
                                                Project Name
                                            </div>
                                            <div className={styles.content_sub_title} style={{ width: "90px", paddingLeft: 5 }}>
                                                Start Date
                                            </div>
                                            <div className={styles.content_sub_title} style={{ width: "90px", paddingLeft: 5 }}>
                                                End Date
                                            </div>
                                        </div> */}
                                        <div style={{ paddingLeft: '2px', paddingRight: '2px'}}>
                                            <ProjectComboBox projects={projects} setSelectedProject={setSelectedProject} setIsUpdated={setIsUpdated}/>
                                        </div>
                                    </div>
                                    <div className={styles.block_row_wrapper}>
                                        <div className={styles.content_wrapper} style={{ width: '200px', textAlign: 'left', height: '315px' }}>
                                            <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>Team Performance</h2>
                                        </div>
                                        <div className={styles.content_wrapper} style={{ width: '400px', textAlign: 'left', height: '315px' }}>
                                            <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>BIM 작업량 추이</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.content_wrapper} style={{ textAlign: 'left', height: '411px' }}>
                                    <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>팀원</h2>
                                    <div className={styles.block_row_wrapper} style={{ height: "15px" }}>
                                        <div className={styles.content_sub_title} style={{ width: "55px" }}>
                                            구분
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "55px" }}>
                                            이름
                                        </div>
                                        <div className={styles.content_sub_title} style={{ width: "50px" }}>
                                            직책
                                        </div>
                                        <div className={styles.content_sub_title} style={{ paddingLeft: 30, width: "70px" }}>
                                            소속
                                        </div>
                                        <div className={styles.content_sub_title} style={{ paddingLeft: 20,width: "100px" }}>
                                            총 객체 수
                                        </div>
                                    </div>
                                    <div style={{marginTop: "5px"}}>
                                        {teamMembers.length != undefined ? teamMembers.map((member, i) => {
                                                return (
                                                    <div key={i} className={styles.list_wrapper} style={{borderRadius:'10px', borderWidth:'1px', border: '1px solid #F1F1F1'}} onClick={(e) => OnMemberClick(e, member)}>
                                                        <div className={styles.block_row_wrapper} style={{width: '450px'}}>
                                                            <div className={styles.list_content} style={{lineHeight: "37px", width: "80px"}}>{i+1}</div>
                                                            <div className={styles.list_content} style={{lineHeight: "37px", width: "80px"}}>{member.USER_NM}</div>
                                                            <div className={styles.list_content} style={{lineHeight: "37px", width: "80px"}}>{member.TITLE_NM}</div>
                                                            <div className={styles.list_content}  style={{lineHeight: "37px", width: "150px"}}>{member.DEPT_NM}</div>
                                                            <div className={styles.list_content}  style={{lineHeight: "37px", width: "120px"}}>{member.total_transaction_count}</div>
                                                        </div>
                                                    </div>
                                                );
                                            }) : <div className={styles.nodata_label} >기간 내에 발생한 BIM 작업이 없습니다.</div>
                                        }
                                    </div>
                                   
                                </div>
                            </div>
                            <div className={styles.content_wrapper} style={{ textAlign: 'left', height: '240px', margin: '2px 4px 0 2px' }}>
                                {teamMembers.length != undefined ? <div className="gantt-chart" /> : <div className={styles.nodata_label} style={{padding: "120px 0px 0px 400px"}} >기간 내에 발생한 BIM 작업이 없습니다.</div>}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
export default Team;