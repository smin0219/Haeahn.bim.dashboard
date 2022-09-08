import React ,{useEffect, useState} from 'react';
import styles from './css/overview.module.css';
import pageStyles from './css/page.module.css';
import Tooltip from '@mui/material/Tooltip';
import MuiDatePicker  from '../common/MuiDatePicker';
import Data from '../data/Data';
import Moment from 'moment';
import infoImg from './img/INFO_ICON.png';
import Chart from '../chart/Chart';
import LoadingScreen from 'react-loading-screen'

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

    const user = props.user;
    const loginId = user.resultMail.substring(0, user.resultMail.indexOf('@'));
    const profileImg = "https://hub.haeahn.com/Storage/GW/ImageStorage/Employee/" + loginId + ".jpg";
    const employeeId = '20000102';//user.resultMessage;
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

    const CreateGanttChartData = () => {
        var modelData = [];
        var annotationData = [];
        var viewData = [];

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
            dailyTransactionXYChart(chart, teamTransactionCount, "팀 전체 객체 수", false);
            dailyTransactionXYChart(chart, averageTransactionCount, "팀 평균 객체 수", true);
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
                    var projects = response.data;
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
                isUpdated(false);
            }
        }
    }, [selectedProject, startDate, endDate]);

    return (
        
        <main className={pageStyles.page_wrapper}>
            <section className={pageStyles.page_container} style={{borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}}>
                <div className={styles.block_column_wrapper}  style={{backgroundColor: "white"}}>
                    {/* 헤더 */}
                    <div className={styles.block_row_wrapper} style={{height: '100px'}}>
                        <div className={styles.title_label}  style={{ width: '350px' }}>Personal Performance Overview</div>
                        <Tooltip title="전일 12시 10분 이전 데이터만 표시 됩니다.">
                            <img className={styles.info_img} src={infoImg} alt="info"/>
                        </Tooltip>
                        <MuiDatePicker date={startDate} setDate={setStartDate}  style={{width: '100px'}} setIsUpdated={setIsUpdated} setIsDateUpdated={setIsDateUpdated}/>
                        <div style={{height: '10px', paddingTop: '42px', paddingLeft: '20px', paddingRight: '20px'}}>~</div>
                        <MuiDatePicker date={endDate} setDate={setEndDate} setIsUpdated={setIsUpdated} setIsDateUpdated={setIsDateUpdated}/>
                        <div className={styles.block_column_wrapper} style={{width: '240px', paddingLeft: '80px'}}>
                            <img className={styles.profile_img} src={profileImg} alt="profile"/>
                            <div className={styles.profile_label}>환영합니다, {employeeName} 님</div>
                        </div> 
                    </div>

                    {/* 헤더 */}
                    <div className={styles.block_row_wrapper}>
                        {/* 좌측 주 컨텐츠  */}
                        <div className={styles.block_column_wrapper}>
                            {/* 오버뷰 정보창 */}
                            <div className={styles.block_row_wrapper} style={{marginLeft: '5px'}}>
                                <div className={styles.block_column_wrapper}>
                                    <div className={styles.block_row_wrapper}>
                                        <div className={styles.content_wrapper} style={{width: '90px'}}>
                                            <div className={styles.stats_value}>{projects.length != undefined ? projects.length : 0}</div>
                                            <div className={styles.stats_title}>총 프로젝트 수</div>
                                        </div>
                                        <Tooltip title={totalTransactionCount}>
                                            <div className={styles.content_wrapper} style={{width: '90px'}}>
                                                <div className={styles.stats_value}>{totalTransactionCount}</div>
                                                <div className={styles.stats_title}>작업한 객체 수</div>
                                            </div>
                                        </Tooltip>
                                        <Tooltip title={mostWorkedModel}>
                                            <div className={styles.content_wrapper} style={{width: '226px'}}>
                                                <div className={styles.stats_value} >{mostWorkedModel}</div>
                                                <div className={styles.stats_title}>가장 많이 작업한 모델 카테고리</div>
                                            </div>
                                        </Tooltip>
                                        <Tooltip title={mostWorkedAnnotation}>
                                            <div className={styles.content_wrapper} style={{width: '226px'}}>
                                                <div className={styles.stats_value}>{mostWorkedAnnotation}</div>
                                                <div className={styles.stats_title}>가장 많이 작업한 도면 카테고리</div>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            {/* 오버뷰 정보창 */}
                            <div className={styles.block_column_wrapper} style={{width: '656px', marginLeft: '5px'}}>
                                {/* 프로젝트 리스트 */}
                                <div className={styles.content_wrapper} style={{textAlign: 'left', height: '250px'}}>
                                    <h2 className={styles.content_title} style={{paddingLeft: '15px'}}>프로젝트</h2>
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
                                        }) : <div className={styles.project_content} style={{paddingTop: '80px'}} >기간 내에 참여하신 BIM 프로젝트가 존재하지 않습니다.</div>
                                    }
                                </div>
                                {/* 프로젝트 리스트 */}
                                {/* 일일작업량 차트 */}
                                <div className={styles.content_wrapper} style={{paddingLeft: '15px', textAlign: 'left', height: '378px', overflow: 'hidden'}}>
                                    <h2 className={styles.content_title}>일일 작업량</h2>
                                    <div className="transaction-xy-chart" style={{top:"-10px", height:"340px"}}></div>
                                </div>
                                {/* 일일작업량 차트 */}
                            </div>
                        </div>
                        {/* 좌측 주 컨텐츠  */}
                        {/* 우측 주 컨텐츠 */}
                        <div className={styles.block_column_wrapper}>
                            <div className={styles.content_wrapper} style={{width: '430px', textAlign: 'left', height: '690px'}}>
                                <h2 className={styles.content_title} style={{paddingLeft: '15px'}}>통계</h2>
                                <div className="model-pie-chart" style={{height:"213px", width:'100%', borderWidth:'1px', borderBottom: '1px solid #F1F1F1'}}></div>
                                <div className="annotation-pie-chart" style={{height:"213px", width:'100%', borderWidth:'1px', borderBottom: '1px solid #F1F1F1'}}></div>
                                <div className="view-pie-chart" style={{height:"213px" , width:'100%'}}></div>
                            </div>
                        </div>
                        {/* 우측 주 컨텐츠 */}
                    </div>
                </div>
            </section>
        </main>
        
    )
}