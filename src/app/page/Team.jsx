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
import GanttChart from '../chart/GanttChart';
import Employee from './Employee';
import Chart from '../chart/Chart';
import { ColorSet } from '@amcharts/amcharts4/core';
import chartStyles from '../chart/chart.css';
import { flatten } from '@amcharts/amcharts4/.internal/core/utils/Iterator';

function Team(props) {

    const [projects, setProjects] = useState({});
    const [selectedProject, setSelectedProject] = useState('');
    const [startDate, setStartDate] = useState(Moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(Moment().subtract(1, 'day').startOf('day').format('YYYY-MM-DD'));
    const [isUpdated, setIsUpdated] = useState(true);
    const [isDateUpdated, setIsDateUpdated] = useState(true);
    const [isMemberSelected, setIsMemberSelected] = useState(false);
    const [selectedMember, setSelectedMember] = useState({});
    const [teamMembers, setTeamMembers] = useState(true);
    const [isBackButtonVisible, setIsBackButtonVisible] = useState(false);

    const OnProjectClick = (event, props) => {
        setSelectedProject(true);
    }

    const Member = function(m) {
        const resultMessage = m.EMP_NO;
        const resultUserName = m.USER_NM;
        const resultMail = m.MAIL;
        const resultDeptName = m.DEPT_NM;
        const resultTitleName = m.TITLE_NM;
        return {resultMessage, resultUserName, resultMail, resultDeptName, resultTitleName};
    }

    const OnMemberSelect = (event, selectedMember) => {
        let member = Member(selectedMember);
        setSelectedMember(member);
        setIsMemberSelected(true);
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
                    fromDate: Moment(data[i].occurred_on).format('YYYY-MM-DD'),
                    toDate: Moment(data[i].occurred_on).add(1, 'days').format('YYYY-MM-DD'),
                    color: colors[0]
                })
            }
        }
        if (parentCategory == "Annotation") {
            for (let i = 0; i < data.length; i++) {
                ganttData.push({
                    parentCategory: parentCategory,
                    fromDate: Moment(data[i].occurred_on).format('YYYY-MM-DD'),
                    toDate: Moment(data[i].occurred_on).add(1, 'days').format('YYYY-MM-DD'),
                    color: colors[1]
                })
            }
        }
        return ganttData;
    }

    const CreateSemiPieData = (data, parentCategory) => {
        var semiPieData = [];
        if (parentCategory == "Model"){
            semiPieData.push({
                category: "Model",
                value: data[0].total_model_count
            })
        }
        if (parentCategory == "Annotation"){
            semiPieData.push({
                category: "Annotation",
                value: data[0].total_annotation_count
            })
        }
        
        return semiPieData;
    }

    const SemiPieDatatest = [
        {
            category: "Model",
            value: 401
        },
        {
            category: "Annotation",
            value: 300
        }
    ]

    const dailyTransactionXYChart = (chart, date, tooltipText, isAverage) => {
        let employeeSeriesData = Chart.SeriesData(date, isAverage);
        let employeeXySeries = Chart.XYSeries(chart, employeeSeriesData, isAverage)
        employeeXySeries.tooltipText = tooltipText + ":{value}"
    }
 

    const UpdateCharts = (projectCode) => {

        let ganttChartData = []
        let ganttChartModelData = []
        let ganttChartAnnotationData = []
        let flattenData = []
        let colors = ["#fec8cd", "#d291bc", "#e0bbe4", "#957dad", "#ffdfd3"]

        let semiPieData = []
        let semiPieModelData = []
        let semiPieAnnotationData = []
        let flattenData1 = [] 

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

        Data.GetTransactionStatsByDate(employeeId, projectCode, startDate, endDate).then(response => {

            let employeeTransactionCount = {};
            let teamTransactionCount = {};
            let averageTransactionCount = {};
            
            response.data.map((data) => {
                teamTransactionCount[data.occurred_on] = data.team_transaction_count;
                averageTransactionCount[data.occurred_on] = data.average_transaction_count;
            })

            let chart = Chart.XYChart("transaction-xy-chart");
            dailyTransactionXYChart(chart, teamTransactionCount, "팀 전체 객체 수", false);
            dailyTransactionXYChart(chart, averageTransactionCount, "팀 평균 객체 수", true);

            
        });

        Data.GetTotalModelCountByTeam(projectCode, startDate, endDate).then(response => {
            let data = response.data
            semiPieModelData = CreateSemiPieData(data, "Model")
            semiPieData.push(semiPieModelData)
        })

        Data.GetTotalAnnotationCountByTeam(projectCode, startDate, endDate).then(response => {
            let data = response.data
            semiPieAnnotationData = CreateSemiPieData(data, "Annotation")
            semiPieData.push(semiPieAnnotationData)
            flattenData1 = semiPieData.flat(Infinity)

            let semiPieChart = Chart.SemiPieChart("semi-pie-chart", flattenData1);
            Chart.SemiPieSeries(semiPieChart);
        })

    }

    useEffect(() => {
        if(isUpdated){
            if(isDateUpdated){
                Data.GetTeamProjects(employeeId).then(response => {
                    var projects = response.data;
                    var defaultProject = projects[0];
    
                    if (projects.length > 0) {
                        Data.GetTeamMembers(defaultProject.PROJ_CD).then(response => {
                            setTeamMembers(response.data);
                        });
                        setProjects(projects);
                        setSelectedProject(defaultProject.PROJ_CD);
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
            else{
                Data.GetTeamMembers(selectedProject).then(response => {
                    setTeamMembers(response.data);
                });   
                UpdateCharts(selectedProject.project_code);
                setIsUpdated(false);
            }
        }
    }, [selectedProject, startDate, endDate, setIsMemberSelected]);

    

    if(!isMemberSelected){
        return (
            <section className={pageStyles.page_container}>
                <div className={styles.block_column_wrapper}>
                    <NavigationBar isBackButtonVisible={false}/>
                </div>
                <main className={pageStyles.page_wrapper}>
                    <section className={pageStyles.page_container} style={{borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}}>
                        <div className={styles.block_column_wrapper}>
                            <div className={styles.block_row_wrapper} style={{ height: '100px' }}>
                                <div className={styles.title_label} style={{ width: '350px' }}>Team Performance Overview</div>
                                <Tooltip title="전일 12시 10분 이전 데이터만 표시 됩니다.">
                                    <img className={styles.info_img} src={infoImg} alt="info" />
                                </Tooltip>
                                <MuiDatePicker date={startDate} setDate={setStartDate} setIsUpdated={setIsUpdated}  setIsDateUpdated={setIsDateUpdated} />
                                <div style={{ height: '10px', paddingTop: '42px', paddingLeft: '20px', paddingRight: '20px' }}>~</div>
                                <MuiDatePicker date={endDate} setDate={setEndDate} setIsUpdated={setIsUpdated}  setIsDateUpdated={setIsDateUpdated} />
                                <div className={styles.block_column_wrapper} style={{ width: '220px', marginLeft: '100px' }}>
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
                                                <div style={{ paddingLeft: '2px', paddingRight: '2px'}}>
                                                    <ProjectComboBox projects={projects} setSelectedProject={setSelectedProject} setIsUpdated={setIsUpdated}/>
                                                </div>
                                            </div>
                                            <div className={styles.block_row_wrapper}>
                                                <div className={styles.content_wrapper} style={{ width: '230px', textAlign: 'left', height: '315px' }}>
                                                    <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>BIM 작업량</h2>
                                                    <div className="semi-pie-chart"></div>
                                                </div>
                                                <div className={styles.content_wrapper} style={{ width: '400px', textAlign: 'left', height: '315px' }}>
                                                    <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>BIM 작업량 추이</h2>
                                                    <div className="transaction-xy-chart" style={{top:"-10px", height:"270px"}}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.content_wrapper} style={{ textAlign: 'left', height: '411px' }}>
                                            <h2 className={styles.content_title} style={{ paddingLeft: '15px' }}>팀원</h2>
                                            <div className={styles.block_row_wrapper} style={{ height: "15px"}}>
                                                <div className={styles.content_sub_title} style={{ width: "35px" }}>
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
                                                            <div key={i} className={styles.list_wrapper} style={{borderRadius:'10px', borderWidth:'1px', border: '1px solid #F1F1F1', cursor: "pointer"}} onClick={(e) => OnMemberSelect(e, member)}>
                                                                <div className={styles.block_row_wrapper} style={{width: '430px'}}>
                                                                    <div className={styles.list_content} style={{lineHeight: "37px", width: "60px"}}>{i+1}</div>
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
                                    <div className={styles.content_wrapper} style={{ textAlign: 'left', height: '275px', margin: '2px 4px 0 2px' }}>
                                        {teamMembers.length != undefined ? <div className="gantt-chart" style={{height:'275px'}} /> : <div className={styles.nodata_label} style={{padding: "120px 0px 0px 400px"}} >기간 내에 발생한 BIM 작업이 없습니다.</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </section>
        )
    }
    else{
        return(
            <Employee user={user} selectedUser={selectedMember} selectedProject={selectedProject} isBackButtonVisible={true}/>
        )
    }

    
}
export default Team;
