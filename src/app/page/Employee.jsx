import React ,{useEffect, useState} from 'react';
import styles from './css/overview.module.css';
import pageStyles from './css/page.module.css';
import Tooltip from '@mui/material/Tooltip';
import MuiDatePicker  from '../common/MuiDatePicker';
import Data from '../data/Data';
import Moment from 'moment';
import infoImg from './img/INFO_ICON.png';
import Chart from '../chart/Chart';
import NavigationBar from '../common/NavigationBar';


export default function Employee (props) {

    const [projects, setProjects] = useState({});
    const [selectedProject, setSelectedProject] = useState('');

    const [totalTransactionCount, setTotalTransactionCount] = useState(0);
    const [employeeElementsCount, setEmployeeElementsCount] = useState(0);
    const [employeeElementsCountByDate, setEmployeeElementsCountByDate] = useState({});

    const [mostWorkedModel, setMostWorkedModel] = useState("-");
    const [mostWorkedAnnotation, setMostWorkedAnnotation] = useState("-");

    
    const [startDate, setStartDate] = useState(Moment().subtract(1, 'month').startOf('day').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(Moment().subtract(1, 'day').startOf('day').format('YYYY-MM-DD'));
    const [isUpdated, setIsUpdated] = useState(true);
    const [isDateUpdated, setIsDateUpdated] = useState(true);
    const [isBackButtonVisible, setIsBackButtonVisible] = useState(props.isBackButtonVisible == undefined ? false : props.isBackButtonVisible);

    const user = props.selectedUser == undefined ? props.user : props.selectedUser;
    const loginId = user.resultMail.substring(0, user.resultMail.indexOf('@'));
    const profileImg = "https://hub.haeahn.com/Storage/GW/ImageStorage/Employee/" + loginId + ".jpg";
    const employeeId = props.selectedUser == undefined ? '20000102' : user.resultMessage;
    const employeeName = user.resultUserName;

    const dailyTransactionXYChart = (chart, date, tooltipText, isAverage) => {
        let employeeSeriesData = Chart.SeriesData(date, isAverage);
        let employeeXySeries = Chart.XYSeries(chart, employeeSeriesData, isAverage)
        employeeXySeries.tooltipText = tooltipText + ":{value}"
    }

    const CreatePieChartData = (data, colors, key) => {

        var modelData = [];
        var othersCount = 0;

        for(let i=0; i<data.length; i++){
            if(i < 4){
                modelData.push({
                    "category": data[i].category_name,
                    "value": data[i].category_count,
                    "color": colors[i]
                })
            }
            else{
                othersCount += data[i].category_count
            }
        }

        if(data.length > 4){
            modelData.push({
                "category": "Others",
                "value": othersCount,
                "color": colors[4]
            })
        }

        if(data.length== 0){
            modelData.push({
                "category": "-",
                "value": 1,
                "color": "#cccccc"
            })
        }

        return modelData;
    }

    const UpdateCharts = (projectCode) => {
        Data.GetTransactionStatsByDate(employeeId, projectCode, startDate, endDate).then(response => {

            let employeeTransactionCount = {};
            let teamTransactionCount = {};
            let averageTransactionCount = {};
            
            response.data.map((data) => {
                employeeTransactionCount[data.occurred_on] = data.employee_transaction_count;
                teamTransactionCount[data.occurred_on] = data.team_transaction_count;
                averageTransactionCount[data.occurred_on] = data.average_transaction_count;
            })

            let chart = Chart.XYChart("transaction-xy-chart");
            dailyTransactionXYChart(chart, employeeTransactionCount, employeeName, false);
            dailyTransactionXYChart(chart, teamTransactionCount, "??? ?????? ?????? ???", false);
            dailyTransactionXYChart(chart, averageTransactionCount, "??? ?????? ?????? ???", true);
        });

        Data.GetModelByCount(employeeId, projectCode, startDate, endDate).then(response => {
            let data = response.data;
            (data.length == 0) ? setMostWorkedModel('-') : setMostWorkedModel(data[0].category_name);
            let pieChartData = CreatePieChartData(data, [], "category_name");
            let pieChart = Chart.PieChart("model-pie-chart", pieChartData);
            Chart.PieSeries(pieChart);
        });

        Data.GetAnnotationByCount(employeeId, projectCode, startDate, endDate).then(response => {
            let data = response.data;
            (data.length == 0) ? setMostWorkedAnnotation('-') : setMostWorkedAnnotation(data[0].category_name);
            let colors = [ "#aaaaaa","#bbbbbb","#cccccc","#dddddd", "#eeeeee"]
            let pieChartData = CreatePieChartData(data, colors, "category_name");
            let pieChart = Chart.PieChart("annotation-pie-chart", pieChartData);
            Chart.PieSeries(pieChart);
        });

        Data.GetViewCountByType(employeeId, projectCode, startDate, endDate).then(response => {
            let data = response.data;
            let colors = [ "#fec8cd", "#d291bc", "#e0bbe4", "#957dad", "#ffdfd3"]
            let pieChartData = CreatePieChartData(data, colors, "category_name");
            let pieChart = Chart.PieChart("view-pie-chart", pieChartData);
            Chart.PieSeries(pieChart);
        });
    }

    function OnProjectClick(event, props){
        setIsUpdated(true);
        setSelectedProject(props);
    }

    useEffect(() => {
        if(isUpdated){
            if(isDateUpdated){
                Data.GetEmployeeProjects(employeeId, startDate, endDate).then(response => {
                    var projects = props.selectedUser == undefined ? response.data : [(response.data).find((projects) => projects.project_code == '21118')];
                    var defaultProject = projects[0];

                    if(projects.length > 0){
                        Data.GetTotalTransactionCount(employeeId, defaultProject.project_code, startDate, endDate).then(response => {
                            setTotalTransactionCount(response.data[0].total_transaction_count);
                        });
                        setProjects(projects);
                        setSelectedProject(defaultProject);
                        UpdateCharts(defaultProject.project_code);
                    }
                    else{
                        setProjects({});
                        setSelectedProject('');
                        setEmployeeElementsCount(0);
                        setEmployeeElementsCount(0);
                    }
                    setIsUpdated(false);
                    setIsDateUpdated(false);           
                });
            }
            else{
                Data.GetTotalTransactionCount(employeeId, selectedProject.project_code, startDate, endDate).then(response => {
                    setTotalTransactionCount(response.data[0].total_transaction_count);
                });
                UpdateCharts(selectedProject.project_code);
                setIsUpdated(false);
            }
        }
    }, [selectedProject, startDate, endDate]);

    return (
        <section className={pageStyles.page_container}>
            <div className={styles.block_column_wrapper}>
                <NavigationBar user={props.user} selectedProject={props.selectedProject} isBackButtonVisible={isBackButtonVisible}/>
            </div>
            <main className={pageStyles.page_wrapper}>
                <section className={pageStyles.page_container} style={{borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}}>
                    <div className={styles.block_column_wrapper}  style={{backgroundColor: "white"}}>
                        {/* ?????? */}
                        <div className={styles.block_row_wrapper} style={{height: '100px'}}>
                            <div className={styles.title_label}  style={{ width: '350px' }}>{props.selectedUser == undefined ? 'Personal' : employeeName + "'s "} Performance Overview</div>
                            <Tooltip title="?????? 12??? 10??? ?????? ???????????? ?????? ?????????.">
                                <img className={styles.info_img} src={infoImg} alt="info"/>
                            </Tooltip>
                            <MuiDatePicker date={startDate} setDate={setStartDate}  style={{width: '100px'}} setIsUpdated={setIsUpdated} setIsDateUpdated={setIsDateUpdated}/>
                            <div style={{height: '10px', paddingTop: '42px', paddingLeft: '20px', paddingRight: '20px'}}>~</div>
                            <MuiDatePicker date={endDate} setDate={setEndDate} setIsUpdated={setIsUpdated} setIsDateUpdated={setIsDateUpdated}/>
                            <div className={styles.block_column_wrapper} style={{width: '240px', paddingLeft: '100px'}}>
                                <img className={styles.profile_img} src={profileImg} alt="profile"/>
                                
                                <div className={styles.profile_label}>{props.selectedUser == undefined ? "???????????????, " + employeeName + " ???" : employeeName + " ??? ?????? ?????????"}</div>
                            </div> 
                        </div>

                        {/* ?????? */}
                        <div className={styles.block_row_wrapper}>
                            {/* ?????? ??? ?????????  */}
                            <div className={styles.block_column_wrapper}>
                                {/* ????????? ????????? */}
                                <div className={styles.block_row_wrapper} style={{marginLeft: '5px'}}>
                                    <div className={styles.block_column_wrapper}>
                                        <div className={styles.block_row_wrapper}>
                                            <div className={styles.content_wrapper} style={{width: '90px'}}>
                                                <div className={styles.stats_value}>{projects.length != undefined ? projects.length : 0}</div>
                                                <div className={styles.stats_title}>??? ???????????? ???</div>
                                            </div>
                                            <Tooltip title={totalTransactionCount}>
                                                <div className={styles.content_wrapper} style={{width: '90px'}}>
                                                    <div className={styles.stats_value}>{totalTransactionCount}</div>
                                                    <div className={styles.stats_title}>????????? ?????? ???</div>
                                                </div>
                                            </Tooltip>
                                            <Tooltip title={mostWorkedModel}>
                                                <div className={styles.content_wrapper} style={{width: '226px'}}>
                                                    <div className={styles.stats_value} >{mostWorkedModel}</div>
                                                    <div className={styles.stats_title}>?????? ?????? ????????? ?????? ????????????</div>
                                                </div>
                                            </Tooltip>
                                            <Tooltip title={mostWorkedAnnotation}>
                                                <div className={styles.content_wrapper} style={{width: '226px'}}>
                                                    <div className={styles.stats_value}>{mostWorkedAnnotation}</div>
                                                    <div className={styles.stats_title}>?????? ?????? ????????? ?????? ????????????</div>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                                {/* ????????? ????????? */}
                                <div className={styles.block_column_wrapper} style={{width: '656px', marginLeft: '5px'}}>
                                    {/* ???????????? ????????? */}
                                    <div className={styles.content_wrapper} style={{textAlign: 'left', height: '250px'}}>
                                        <h2 className={styles.content_title} style={{paddingLeft: '15px'}}>????????????</h2>
                                        <div className={styles.block_row_wrapper} style={{height: "15px"}}>
                                            <div className={styles.content_sub_title} style={{width: "80px"}}>
                                                Project Code 
                                            </div>
                                            <div className={styles.content_sub_title} style={{width: "400px"}}>
                                                Project Name
                                            </div>
                                            <div className={styles.content_sub_title} style={{width: "120px"}}>
                                                Last Modified Date
                                            </div>
                                        </div>
                                        {projects.length != undefined ? projects.map((project, i) => {
                                                return (
                                                    <Tooltip key={i} title={project.project_name}>
                                                        <div className={styles.list_wrapper} style={{borderRadius:'10px', borderWidth:'1px', border: selectedProject.project_code == project.project_code ? '1px solid #1974d2' : '1px solid #F1F1F1'}} onClick={(e) => OnProjectClick(e, project)}>
                                                            <div className={styles.block_row_wrapper} style={{width: '650px'}}>
                                                                <div className={styles.list_content} style={{lineHeight: "37px", width: "80px"}}>{project.project_code}</div>
                                                                <div className={styles.list_content}  style={{lineHeight: "37px", width: "400px"}}>{project.project_name}</div>
                                                                <div className={styles.list_content}  style={{lineHeight: "37px", width: "120px"}}>{Moment(project.occurred_on).format('YYYY-MM-DD')}</div>
                                                            </div>
                                                        </div>
                                                    </Tooltip>
                                                );
                                            }) : <div className={styles.project_content} style={{paddingTop: '80px'}} >?????? ?????? ???????????? BIM ??????????????? ???????????? ????????????.</div>
                                        }
                                    </div>
                                    {/* ???????????? ????????? */}
                                    {/* ??????????????? ?????? */}
                                    <div className={styles.content_wrapper} style={{paddingLeft: '15px', textAlign: 'left', height: '378px', overflow: 'hidden'}}>
                                        <h2 className={styles.content_title}>?????? ?????????</h2>
                                        <div className="transaction-xy-chart" style={{top:"-10px", height:"340px"}}></div>
                                    </div>
                                    {/* ??????????????? ?????? */}
                                </div>
                            </div>
                            {/* ?????? ??? ?????????  */}
                            {/* ?????? ??? ????????? */}
                            <div className={styles.block_column_wrapper}>
                                <div className={styles.content_wrapper} style={{width: '430px', textAlign: 'left', height: '690px'}}>
                                    <h2 className={styles.content_title} style={{paddingLeft: '15px'}}>??????</h2>
                                    <div className="model-pie-chart" style={{height:"213px", width:'100%', borderWidth:'1px', borderBottom: '1px solid #F1F1F1'}}></div>
                                    <div className="annotation-pie-chart" style={{height:"213px", width:'100%', borderWidth:'1px', borderBottom: '1px solid #F1F1F1'}}></div>
                                    <div className="view-pie-chart" style={{height:"213px" , width:'100%'}}></div>
                                </div>
                            </div>
                            {/* ?????? ??? ????????? */}
                        </div>
                    </div>
                </section>
            </main>
        </section>
    )
}