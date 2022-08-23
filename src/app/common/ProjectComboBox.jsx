import * as React from "react";
import styles from './project-combo-box.module.css';
import Select from 'react-select';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Data from '../data/Data';
import Moment from 'moment';

const customStyles = {
      option: (provided, state) => ({
        ...provided,
        color: "black",
        backgroundColor: "white",
        fontSize: "13",
        cursor: "pointer",
        "&:hover": { backgroundColor: "#F5F5F5" }
      }),
 
      singleValue: (provided, state) => ({
        ...provided,
        color: "black",
        fontSize: "13"
      }),
}


export default function ProjectComboBox(props) {
    var projects = [];
    if(props.projects.length != undefined){
        projects = props.projects.map((data, i) => {
            var projectCode = data.PROJ_CD;
            var projectName = data.PROJ_NM;

            var startDate = "";
            var endDate = "";
            var date = "";

            if(data.START_DT != null){
                var startDate = Moment(data.START_DT).format('MM/yyyy');
                var endDate = data.END_DT == null ? '진행 중' : Moment(data.END_DT).format('MM/yyyy');
                date = `(${startDate} ~ ${endDate})`;
            }

            return {label:`[${projectCode}] ${projectName} ${date}`, pjcode:projectCode};
        })

        return (
            <div className={styles.title_label} style={{position:"absolute", width: 600}}>
                <Select 
                    placeholder={"Click here to select or search project"}
                    styles={customStyles}
                    defaultValue={projects[0]}
                    options={ projects }
                    isSearchable={false}
                    onChange={(e)=> {
                        props.setSelectedProject(e.pjcode)
                        props.setIsUpdated(true);
                    }}
                />
            </div>
            // <Autocomplete
            //     value={3}
            //     disablePortal
            //     id="ProjectComboBox"
            //     options={projectNames}
            //     // onChange={(event, newValue) => {
            //     //     props.setSelectedProject(newValue);
            //     // }}
            //     sx={{
            //         '& .MuiAutocomplete-input, & .MuiInputLabel-root': {
            //           fontSize: 15,
            //         },
            //       }}
            //     renderInput={(params) => <TextField {...params}
            //         placeholder="여기를 클릭하여 프로젝트를 입력 또는 선택하세요" />}
            // />
        );
    }
}

const projects2 = [
    { label: "[20213] 테스트테스트테스트테스트테스트테스트테스트테스트스트스야야 (2022-02-02 ~ 2022-03-11)", pjcode: 19942, LastModifiedDate: "2022-01-01" },
    { label: "K-CULTURE VALLEY 개발사업", pjcode: 19722, LastModifiedDate: "2022-01-01" },
    { label: "송산생활권1구역(용현주공아파트) 주택재건축", pjcode: 19274, LastModifiedDate: "2022-01-01" },
    { label: "반포현대아파트 주택재건축정비사업", pjcode: 22008, LastModifiedDate: "2022-01-01" },
    { label: "서울대학교 정문광장", pjcode: 19257, LastModifiedDate: "2022-01-01" },
    { label: "춘천 중도 휴양형리조트 개발계획", pjcode: 12993, LastModifiedDate: "2022-01-01" },
    { label: "RUNG MUI NE PROJECT(베트남)", pjcode: 19924, LastModifiedDate: "2022-01-01" },
];