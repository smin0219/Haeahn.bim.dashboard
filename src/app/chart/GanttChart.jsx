import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import chartStyles from './chart.css';

function GanttChart(startDate, endDate) {
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("gantt-chart", am4charts.XYChart);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

chart.paddingRight = 30;
chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

var colorSet = new am4core.ColorSet();
colorSet.saturation = 0.4;

chart.data = [
  {
    name: "Model",
    fromDate: "2022-07-01",
    toDate: "2022-07-03",
    color: colorSet.getIndex(0).brighten(0)
  },
  {
    name: "Model",
    fromDate: "2022-08-01",
    toDate: "2022-08-03",
    color: colorSet.getIndex(0).brighten(0)
  },
  {
    name: "Model",
    fromDate: "2022-08-04",
    toDate: "2022-08-05",
    color: colorSet.getIndex(0).brighten(0.4)
  },
  {
    name: "Model",
    fromDate: "2022-08-07",
    toDate: "2022-08-10",
    color: colorSet.getIndex(0).brighten(0.8)
  },

  {
    name: "Curtain Panels",
    fromDate: "2022-08-02",
    toDate: "2022-08-03",
    color: colorSet.getIndex(2).brighten(0)
  },
  {
    name: "Curtain Panels",
    fromDate: "2022-08-03",
    toDate: "2022-08-06",
    color: colorSet.getIndex(2).brighten(0.4)
  },

  {
    name: "Annotation",
    fromDate: "2022-08-03",
    toDate: "2022-08-06",
    color: colorSet.getIndex(4).brighten(0)
  },
  {
    name: "Annotation",
    fromDate: "2022-08-06",
    toDate: "2022-08-09",
    color: colorSet.getIndex(4).brighten(0.4)
  },

  {
    name: "Section Boxes",
    fromDate: "2022-08-06",
    toDate: "2022-08-11",
    color: colorSet.getIndex(6).brighten(0)
  },
  {
    name: "Section Boxes",
    fromDate: "2022-08-12",
    toDate: "2022-08-15",
    color: colorSet.getIndex(6).brighten(0.4)
  },

  {
    name: "View",
    fromDate: "2022-08-04",
    toDate: "2022-08-05",
    color: colorSet.getIndex(8).brighten(0)
  }
];

var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "name";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.inversed = true;

var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.dateFormats.setKey("day", "MM/dd");
dateAxis.renderer.minGridDistance = 30;
dateAxis.baseInterval = { count: 1, timeUnit: "minute" };
dateAxis.max = new Date(endDate).getTime();
dateAxis.min = new Date(startDate).getTime();
dateAxis.strictMinMax = true;
dateAxis.renderer.tooltipLocation = 0;

var series1 = chart.series.push(new am4charts.ColumnSeries());
series1.columns.template.width = am4core.percent(80);
series1.columns.template.tooltipText = "{name}: {openDateX} - {dateX}";

series1.dataFields.openDateX = "fromDate";
series1.dataFields.dateX = "toDate";
series1.dataFields.categoryY = "name";
series1.columns.template.propertyFields.fill = "color"; // get color from data
series1.columns.template.propertyFields.stroke = "color";
series1.columns.template.strokeOpacity = 1;

chart.scrollbarX = new am4core.Scrollbar();

}
export default GanttChart;