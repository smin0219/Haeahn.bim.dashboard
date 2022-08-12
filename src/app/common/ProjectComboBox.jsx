import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function ProjectComboBox() {
    return (
        <Autocomplete
            disablePortal
            id="ProjectComboBox"
            options={projects}
            sx={{ width: 600, paddingTop: 1 }}
            renderInput={(params) => <TextField {...params}
                placeholder="프로젝트를 선택하세요" />}
        />
    );
}

const projects = [
    { label: "00동 업무시설 신축공사", pjcode: 19942, LastModifiedDate: "2022-01-01" },
    { label: "K-CULTURE VALLEY 개발사업", pjcode: 19722, LastModifiedDate: "2022-01-01" },
    { label: "송산생활권1구역(용현주공아파트) 주택재건축", pjcode: 19274, LastModifiedDate: "2022-01-01" },
    { label: "반포현대아파트 주택재건축정비사업", pjcode: 22008, LastModifiedDate: "2022-01-01" },
    { label: "서울대학교 정문광장", pjcode: 19257, LastModifiedDate: "2022-01-01" },
    { label: "춘천 중도 휴양형리조트 개발계획", pjcode: 12993, LastModifiedDate: "2022-01-01" },
    { label: "RUNG MUI NE PROJECT(베트남)", pjcode: 19924, LastModifiedDate: "2022-01-01" },
];