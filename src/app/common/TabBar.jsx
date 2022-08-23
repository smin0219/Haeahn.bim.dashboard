import { useState } from 'react';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export default function TabBar(props) {
    return (
        <Tabs
            value={props.currentTab}
            textColor="primary"
            TabIndicatorProps={{ style: { backgroundColor: "#000080" } }}
            onChange={(event, newValue) => {
                props.setCurrentTab(newValue);
            }}>
            {GetTabs(props.level)}
        </Tabs>
    )
}

function GetTabs(level) {
    //level = 2; //테스트 목적 임시 적용
    if (level == 0) {
        return <Tab key='0' label="개인" style={{ backgroundColor: "white", borderBottom: "2px solid lightgray", minWidth: 80, borderTopLeftRadius: "5px", borderTopRightRadius: "5px", marginRight: "3px" }} />
    }
    else if (level == 1) {
        return [
            <Tab key='0' label="개인" style={{ backgroundColor: "white", borderBottom: "2px solid lightgray", minWidth: 80, borderTopLeftRadius: "5px", borderTopRightRadius: "5px", marginRight: "3px" }} />,
            <Tab key='1' label="팀" style={{ backgroundColor: "white", borderBottom: "2px solid lightgray", minWidth: 80, borderTopLeftRadius: "5px", borderTopRightRadius: "5px", marginRight: "3px" }} />
        ]

    }
    else {
        return [
            <Tab key='0' label="개인" style={{ backgroundColor: "white", borderBottom: "2px solid lightgray", minWidth: 80, borderTopLeftRadius: "5px", borderTopRightRadius: "5px", marginRight: "3px" }} />,
            <Tab key='1' label="팀" style={{ backgroundColor: "white", borderBottom: "2px solid lightgray", minWidth: 80, borderTopLeftRadius: "5px", borderTopRightRadius: "5px", marginRight: "3px" }} />,
            <Tab key='2' label="부문" style={{ backgroundColor: "white", borderBottom: "2px solid lightgray", minWidth: 80, borderTopLeftRadius: "5px", borderTopRightRadius: "5px", marginRight: "3px" }} />
        ]
    }
}
