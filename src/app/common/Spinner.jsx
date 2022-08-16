import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import { Audio } from  'react-loader-spinner'
import "./spinner.module.css";

export default function Spinner(props){
  return (
        <Audio
        height = "80"
        width = "80"
        radius = "9"
        color = 'green'
        ariaLabel = 'three-dots-loading'     
        wrapperStyle
        wrapperClass
    />
  );
};

