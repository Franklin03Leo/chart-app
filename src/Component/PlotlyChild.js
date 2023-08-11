import React, { useEffect, useState } from "react";
import Plotly from "plotly.js";

// change to react plotly
import Plot from "react-plotly.js";

//mui table
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

//mui data table
import MUIDataTable from "mui-datatables";

const PlotlyChild = ({
  chartData,
  chartCustomize,
  chartType,
  showTable,
  showChart,
}) => {

  const [chartDataValues , setChartDataValues] = useState({
    data : [],
    layout : {}
  })

  const updateChartData = () => {
    if (chartData) {
      var trace1;
      if (chartType === "bar") {
        trace1 = {
          x: chartData.labels,
          y: chartData.values,
          type: "bar", // define a type of the chart
          marker: {
            color: chartCustomize["chartColor"], // change the chart color
          },
        };
      } else if (chartType === "pie") {
        trace1 = {
          labels: chartData.labels,
          values: chartData.values,
          type: "pie",
        };
      }
      let data = [trace1];
      let layout = {
        title: chartType === "bar" ? "Bar Chart" : "Pie Chart",
        width: chartCustomize["chartWidth"], // set the width of the chart
        height: chartCustomize["chartHeight"], // set the Height of the chart
        font: {
          color: "black", // Change the legend font color
        },
        // xaxis configs
        xaxis: {
          title: chartCustomize["xaxisTitle"],
          orientation: "h",
          showgrid: true, // show the grid inside the chart
          automargin: true,
          tickangle: chartCustomize["xaxisRadious"], // set the radious of the xaxis lagend
          tickfont: {
            size: chartCustomize["xaxisFontSize"], // set xaxis the font size
            color: chartCustomize["xaxisColor"], // set xaxis font color
            family: chartCustomize["xaxisFontFamily"],
          },
          margin: {
            t: 150,
          },
        },
        // Yaxis configs
        yaxis: {
          title: chartCustomize["yaxisTitle"],
          tickangle: chartCustomize["yaxisRadious"], // set the radious of the xaxis lagend
          automargin: true,
          tickfont: {
            size: chartCustomize["yaxisFontSize"], // set xaxis the font size
            color: chartCustomize["yaxisColor"], // set xaxis font color
            family: chartCustomize["yaxisFontFamily"],
          },
          standoff: 40,
        },
        legend: {
          tracegroupgap: 50, // Adjust the gap between legend groups
        },
        datarevision: 0,
        // margin: {  // padding between chart and lagend
        //   pad: 14,
        // }
      };

      setChartDataValues({
        data: data,
        layout : layout
      })
      // Plotly.newPlot("myDiv", data, layout);
    }
  }

  useEffect(() => {
    updateChartData();
  }, [chartData, chartType, chartCustomize]);


  const cols = Object.keys(chartData['allValues']?.[0])?.map((e) => ({ ["name"]: e }));
  const options = {
    // filter: `${filter === false ? false : true}`,
    filterType: "multiselect",
    responsive: "scroll",
    selectableRows: false,
    useDisplayedRowsOnly: true,
    sort: false,
  };

  return (
    <div>
      {/* {showChart && <div id="myDiv"></div>} */}

      {showChart && <Plot data={chartDataValues.data} layout={chartDataValues.layout} />}

      {/* {showTable && (
      <TableContainer component={Paper} style={{ margin: "20px", padding: "10px" }}>
      <Table aria-label="uploaded-file-details">
        <TableHead>
          <TableRow>
            {chartData['allValues']?.[0]?.map((cell, index) => (
              <TableCell key={index}>{cell}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {chartData['allValues']?.slice(1)?.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>
      )} */}

      {showTable && <div style={{ height: "calc(100vh - 165px)" }}>
        <MUIDataTable
          id="dataset"
          title={"Dataset"}
          data={chartData['allValues']}
          columns={cols}
          options={options}
        />
      </div>}
    </div>
  );
};

export default PlotlyChild;
