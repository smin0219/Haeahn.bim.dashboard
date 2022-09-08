import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { maxWidth } from '@mui/system';

function XYSeries(chart, data, isAverage){
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.tooltip.pointerOrientation = "vertical";
    series.strokeWidth = 2;
    let circleBullet = series.bullets.push(new am4charts.CircleBullet());
    circleBullet.circle.strokeWidth = 0.1;
    series.data = data;

    if(isAverage){
        series.strokeDasharray = "8,4";
        series.tooltipText = "팀 평균:{value}"
        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = am4core.color("#ff00ff");
        series.stroke = am4core.color("#ff00ff");

        let seriesCircleBullet = series.bullets.push(new am4charts.CircleBullet());
        seriesCircleBullet.circle.strokeWidth = 0.4;
        seriesCircleBullet.stroke = am4core.color("#ff00ff");
        seriesCircleBullet.fill = am4core.color("#ff00ff");
    }

    return series; 
}

function SeriesData(data, isAverage){
    var transactions = [];
    var keys = Object.keys(data);

    for(let i=0; i<keys.length; i++){
        transactions.push({ 
            "date": keys[i],
            "value": data[keys[i]]
        })
    }
    
    return transactions;
}


function XYChart(div) {
    var chart = am4core.create(div, am4charts.XYChart);

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {timeUnit:"day", count:1}
    dateAxis.dateFormats.setKey("day", "MM/dd");
    dateAxis.periodChangeDateFormats.setKey("day", "MM/dd");
    dateAxis.renderer.minGridDistance = 60;
    
    chart.yAxes.push(new am4charts.ValueAxis());
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxes = dateAxis;

    return chart;

}

function PieChart(div, data){
    var chart = am4core.create(div, am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0;
    chart.innerRadius = am4core.percent(55);

    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";
    chart.legend.labels.template.truncate = true;
    chart.legend.width = 190;
    chart.data = data;
    chart.legend.fontSize = 11;
    chart.legend.fontWeight = 500;
    chart.legend.dy = -8;
    chart.legend.itemContainers.template.togglable = false;

    return chart;
}

function PieSeries(chart){
    var series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.depthValue = "value";
    series.dataFields.category = "category";
    series.slices.template.cornerRadius = 0;
    /* Disable labels */
    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;
    series.colors.step = 1;
    series.slices.template.propertyFields.fill = "color";
    series.slices.template.tooltipText = "{category} ({value})";
    series.tooltip.label.maxWidth = 300;
    series.tooltip.label.wrap = true;

    let slice = series.slices.template;
    slice.states.getKey("hover").properties.scale = 1;
    slice.states.getKey("active").properties.shiftRadius = 0;

    return series;
} 

function GanttChart(div, data, startDate, endDate) {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create(div, am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0;
    chart.paddingRight = 30;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
    chart.scrollbarX = new am4core.Scrollbar();
    chart.data = data;

    var colorSet = new am4core.ColorSet();
    colorSet.saturation = 0.4;

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "parentCategory";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormats.setKey("day", "MM/dd");
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.baseInterval = { count: 1, timeUnit: "day" };
    dateAxis.max = new Date(endDate).getTime();
    dateAxis.min = new Date(startDate).getTime();
    dateAxis.strictMinMax = true;
    dateAxis.renderer.tooltipLocation = 0;

    return chart;
}

function GanttSeries(chart){
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.columns.template.width = am4core.percent(80);
    //series.columns.template.tooltipText = "{categoryName}";
    
    //series.dataFields.valueX = "categoryName";
    series.dataFields.openDateX = "fromDate";
    series.dataFields.dateX = "toDate";        
    series.dataFields.categoryY = "parentCategory";
    series.columns.template.propertyFields.fill = "color"; // get color from data
    series.columns.template.propertyFields.stroke = "color";
    series.columns.template.strokeOpacity = 1;
}

export default {XYChart, PieChart, PieSeries, XYSeries, SeriesData, GanttChart, GanttSeries}