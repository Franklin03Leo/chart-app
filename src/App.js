import React, {useState, useEffect} from "react";
import "./App.css";
import SideMenu from "./SideMenu";
import Plotly_input from "./plotly_input";

const App = () => {

  const [plotlyData, setPlotlyData] = useState("Data");
  const [chartShow, setChartShow] = useState("");

  // get the data from sideMenu file to displays the data based on icon click
  const handleDataUpdate = (data) => {
    setPlotlyData(data);
  };

  // get the data from plotInput file to displays the 'chart icon' when click the geneate chart
  const handleChart = (data) => {
    setChartShow(data);
  };



  return (
    <>
      <SideMenu data={chartShow} onDataUpdate={handleDataUpdate}  />
      <Plotly_input data={plotlyData} onChartUpdate={handleChart} />
    </>
  );
};

export default App;
