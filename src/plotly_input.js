import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Accordian
import AccordionDetails from "@mui/material/AccordionDetails";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

// select MUI field
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

//handle upload
import { parse } from "papaparse";
import * as XLSX from "xlsx";

//import child chart component
import PlotlyChild from "./Component/PlotlyChild";

//antd dialog
import { Modal } from "antd";

//import an css file
import "./PlotlyInput.css";

// template save icon
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import LeaderboardTwoToneIcon from "@mui/icons-material/LeaderboardTwoTone";

//Axios for data sharing to server
import axios from "axios";

const Plotly_input = ({ data, onChartUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateData, setTemplateData] = useState();

  useEffect(() => {
    if (data === "Template") {
      (async () => {
        try {
          const response = await axios.get(
            "http://localhost:3008/api/chartData"
          );
          setTemplateData(response.data?.["chart"]);
          console.log("retrieved data ==> 200 ", response.data?.["chart"]);
        } catch (error) {
          console.error("Error fetching company names:", error);
        }
      })();
    }
  }, [data]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    let obj = {
      chartLayout: chartCustomize,
      chartData: chartData,
    };
    try {
      // Send the data to the server using axios POST request
      const response = await axios.post("http://localhost:3008/api/data", obj);
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState({
    allValues: [],
    labels: [],
    values: [],
    file: {},
  });
  const Fonts = [
    "Arial",
    "Verdana",
    "Tahoma",
    "monospace",
    "Times New Roman",
    "Georgia",
    "Garamond",
    "Courier",
    "Impact",
    "Palatino Linotype",
    "Book Antiqua",
  ];
  const [chartCustomize, setChartCustomize] = useState({
    chartColor: "#ff0000",
    chartHeight: 600,
    chartWidth: 900,

    xaxisFontFamily: "Arial",
    xaxisColor: "#ff0000",
    xaxisRadious: "-41",
    xaxisFontSize: "12",
    xaxisTitle: "xaxis - Tittle",
    labels: "",

    yaxisFontFamily: "Arial",
    yaxisColor: "#ff0000",
    yaxisRadious: "-41",
    yaxisFontSize: "12",
    yaxisTitle: "yaxis - Tittle",
    values: "",

    // Template Name and description
    templateName: "",
    templateDescription: "",
  });
  const [expanded, setExpanded] = React.useState(false);
  const [chartType, setChartType] = useState("bar"); // Added chartType and setChartType
  const [showTable, setShowTable] = useState(false);

  const handleShowChart = () => {
    onChartUpdate("test");
    setShowChart(true);
    setShowTable(false);
  };

  const handleShowTable = () => {
    setShowTable(true);
    setShowChart(false);
  };

  const handleChartData = (data) => {
    setChartData(data);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChartCustomize = (e) => {
    setChartCustomize({
      ...chartCustomize,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileContents = e.target.result;
      if (file.name.endsWith(".json")) {
        const jsonData = JSON.parse(fileContents);
        const labels = Object.keys(jsonData[0]); //jsonData.map((entry) => entry.date);
        const values = jsonData.map((entry) => entry.revenue);

        setChartData({
          allValues: jsonData,
          labels: labels, //Object.keys(jsonData),
          values: values, //Object.values(jsonData),
          file: { name: file.name },
        });

        console.log(" json ===> ", chartData);
      } else if (file.name.endsWith(".csv")) {
        parse(fileContents, {
          complete: (result) => {
            const labels = result.data.map((row) => row[0]);
            const values = result.data.map((row) => row[1]);
            setChartData({
              allValues: result.data,
              labels: labels,
              values: values,
              file: { name: file.name },
            });
          },
        });
        console.log(" csv ===> ", file);
        console.log(" csv ===> ", chartData);
      } else if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
        debugger;
        const workbook = XLSX.read(fileContents, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log("rows:", rows);
        const labels = rows.map((row) => row[0]);
        const values = rows.map((row) => row[1]);
        setChartData({
          allValues: rows,
          labels: labels,
          values: values,
          file: { name: file.name },
        });
        console.log(" xlsx ===> ", chartData);
      }
      e = "";
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    console.log(" csv ===> 33 ", chartData);
  }, [chartData]);

  const handleAxisValues = (e, index) => {
    if (chartData["file"]?.name?.endsWith(".json")) {
      setChartData({
        ...chartData,
        [e.target.name]: chartData["allValues"].map(
          (entry) => entry[e.target.value]
        ),
      });
    } else if (chartData["file"]?.name?.endsWith(".csv")) {
      setChartData({
        ...chartData,
        [e.target.name]: chartData["allValues"]
          .slice(1)
          .map((row) => row[index?.props?.index]),
      });
    }

    setChartCustomize({
      ...chartCustomize,
      [e.target.name]: e.target.value,
    });
  };

  const displayChart = (index) => {
    console.log("index  ==> ", templateData[index]);
    setChartData(templateData[index]["chartData"]);
    setChartCustomize(templateData[index]?.["chartLayout"]);
    handleShowChart();
  };

  return (
    <>
      <div
        style={{
          padding: "0",
          position: "fixed",
          top: "15px",
          left: "50px",
          minHeight: "calc(100% - 10px)",
          width: "28%",
          overflowY: "auto",
          overflowX: "hidden",
          border: "1px solid #DCDFE1",
          borderTop: "none",
        }}
      >
        <div style={{ margin: "74px 0px 30px 20px" }}>
          <div
            style={{
              float: "right",
              position: "relative",
              right: "0%",
              marginTop: "-9%",
            }}
          >
            <KeyboardDoubleArrowLeftIcon />
          </div>

          {data === "Data" && (
            <>
              <h2>Data</h2>
              <TextField
                type="file"
                accept=".csv, .json, .xls, .xlsx"
                onChange={(e) => handleFileUpload(e)}
              />{" "}
              <Button
                variant="contained"
                color="primary"
                onClick={handleShowTable}
                style={{ margin: "20px 85px 10px 20px", float: "right" }}
              >
                Show Table
              </Button>
            </>
          )}

          {data === "Chart" && (
            <>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    Charts
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div>
                    <div style={{ display: "flex" }}>
                      <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        size="small"
                        style={{ width: "50%", margin: "0px" }}
                      >
                        <InputLabel id="demo-select-small-label">
                          Chart Type
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={chartType}
                          label="chartType"
                          onChange={(e) => setChartType(e.target.value)}
                        >
                          <MenuItem value="bar">Bar Chart</MenuItem>
                          <MenuItem value="pie">Pie Chart</MenuItem>
                        </Select>
                      </FormControl>
                      <input
                        type="color"
                        id="favcolor"
                        name="chartColor"
                        value={chartCustomize.chartColor}
                        onChange={(e) => handleChartCustomize(e)}
                      />
                    </div>
                    <div style={{ display: "flex" }}>
                      <div style={{ padding: "0 7px 10px 0px" }}>
                        <TextField
                          label="Height"
                          id="outlined-size-small"
                          size="small"
                          name="chartHeight"
                          value={chartCustomize.chartHeight}
                          onChange={(e) => handleChartCustomize(e)}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Width"
                          id="outlined-size-small"
                          size="small"
                          name="chartWidth"
                          value={chartCustomize.chartWidth}
                          onChange={(e) => handleChartCustomize(e)}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    Xaxis Labels
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      margin: "-10px",
                      padding: " 0 0 25px",
                    }}
                  >
                    <div>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Xaxis
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          label="Axis"
                          name="labels"
                          value={chartCustomize.labels}
                          onChange={(e, index) => handleAxisValues(e, index)}
                        >
                          {chartData?.["allValues"]?.[0] &&
                          chartData["file"]?.name?.endsWith(".json")
                            ? Object.keys(chartData["allValues"][0]).map(
                                (option, index) => (
                                  <MenuItem
                                    key={option}
                                    index={index}
                                    value={option}
                                  >
                                    <span style={{ fontFamily: option }}>
                                      {option}
                                    </span>
                                  </MenuItem>
                                )
                              )
                            : chartData["file"]?.name?.endsWith(".csv")
                            ? chartData["allValues"][0].map((option, index) => (
                                <MenuItem
                                  key={option}
                                  index={index}
                                  value={option}
                                >
                                  <span style={{ fontFamily: option }}>
                                    {option}
                                  </span>
                                </MenuItem>
                              ))
                            : null}
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Font Family
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          label="Font Family"
                          name="xaxisFontFamily"
                          value={chartCustomize.xaxisFontFamily}
                          onChange={(e) => handleChartCustomize(e)}
                        >
                          {Fonts.map((option, index) => (
                            <MenuItem key={option} value={option}>
                              <span style={{ fontFamily: option }}>
                                {option}
                              </span>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <input
                        type="color"
                        id="favcolor"
                        name="xaxisColor"
                        value={chartCustomize.xaxisColor}
                        onChange={(e) => handleChartCustomize(e)}
                      ></input>
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: "0 7px 10px 0px" }}>
                      <TextField
                        label="Radius"
                        id="outlined-size-small"
                        size="small"
                        name="xaxisRadious"
                        value={chartCustomize.xaxisRadious}
                        onChange={(e) => handleChartCustomize(e)}
                      />
                    </div>

                    <div style={{ padding: "0 7px 10px 0px" }}>
                      <TextField
                        label="Font Size"
                        id="outlined-size-small"
                        size="small"
                        name="xaxisFontSize"
                        value={chartCustomize.xaxisFontSize}
                        onChange={(e) => handleChartCustomize(e)}
                      />
                    </div>

                    <div>
                      <TextField
                        label="XaxisTittle"
                        id="outlined-size-small"
                        size="small"
                        name="xaxisTitle"
                        value={chartCustomize.xaxisTitle}
                        onChange={(e) => handleChartCustomize(e)}
                      />
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    Yaxis Labels
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      margin: "-10px",
                      padding: " 0 0 25px",
                    }}
                  >
                    <div>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Yaxis
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          label="Axis"
                          name="values"
                          value={chartCustomize.values}
                          onChange={(e, index) => handleAxisValues(e, index)}
                        >
                          {chartData?.["allValues"]?.[0] &&
                          chartData["file"]?.name?.endsWith(".json")
                            ? Object.keys(chartData["allValues"][0])?.map(
                                (option, index) => (
                                  <MenuItem
                                    key={option}
                                    index={index}
                                    value={option}
                                  >
                                    <span style={{ fontFamily: option }}>
                                      {option}
                                    </span>
                                  </MenuItem>
                                )
                              )
                            : chartData["file"]?.name?.endsWith(".csv")
                            ? chartData["allValues"][0].map((option, index) => (
                                <MenuItem
                                  key={option}
                                  index={index}
                                  value={option}
                                >
                                  <span style={{ fontFamily: option }}>
                                    {option}
                                  </span>
                                </MenuItem>
                              ))
                            : ""}
                        </Select>
                      </FormControl>
                    </div>

                    <div>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Font Family
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          label="Font Family"
                          name="yaxisFontFamily"
                          value={chartCustomize.yaxisFontFamily}
                          onChange={(e) => handleChartCustomize(e)}
                        >
                          {Fonts.map((option, index) => (
                            <MenuItem key={option} value={option}>
                              <span style={{ fontFamily: option }}>
                                {option}
                              </span>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <input
                        type="color"
                        id="favcolor"
                        name="yaxisColor"
                        value={chartCustomize.yaxisColor}
                        onChange={(e) => handleChartCustomize(e)}
                      ></input>
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: "0 7px 10px 0px" }}>
                      <TextField
                        label="Radius"
                        id="outlined-size-small"
                        size="small"
                        name="yaxisRadious"
                        value={chartCustomize.yaxisRadious}
                        onChange={(e) => handleChartCustomize(e)}
                      />
                    </div>

                    <div style={{ padding: "0 7px 10px 0px" }}>
                      <TextField
                        label="Font Size"
                        id="outlined-size-small"
                        size="small"
                        name="yaxisFontSize"
                        value={chartCustomize.yaxisFontSize}
                        onChange={(e) => handleChartCustomize(e)}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Yaxis Tittle"
                        id="outlined-size-small"
                        size="small"
                        name="yaxisTitle"
                        value={chartCustomize.yaxisTitle}
                        onChange={(e) => handleChartCustomize(e)}
                      />
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              {/* Chart Title */}
              <Accordion
                expanded={expanded === "panel4"}
                onChange={handleChange("panel4")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    Title
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      margin: "-10px",
                    }}
                  >
                    <div>
                      <TextField
                        label="Title"
                        id="outlined-size-small"
                        size="small"
                        name="Title"
                        sx={{ m: 1, minWidth: 320 }}
                        value={chartCustomize.yaxisTitle}
                        onChange={(e) => handleChartCustomize(e)}
                      />
                    </div>

                    <div style={{ paddingTop: "10px" }}>
                      <input
                        type="color"
                        id="favcolor"
                        name="yaxisColor"
                        value={chartCustomize.yaxisColor}
                        onChange={(e) => handleChartCustomize(e)}
                      ></input>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      margin: "-10px",
                      padding: " 0 0 25px",
                    }}
                  >
                    <div style={{ padding: "0 7px 10px 0px" }}>
                      <FormControl sx={{ m: 1, minWidth: 220 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Font Family
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          label="Font Family"
                          name="yaxisFontFamily"
                          value={chartCustomize.yaxisFontFamily}
                          onChange={(e) => handleChartCustomize(e)}
                        >
                          {Fonts.map((option, index) => (
                            <MenuItem key={option} value={option}>
                              <span style={{ fontFamily: option }}>
                                {option}
                              </span>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <div style={{ paddingTop: "10px" }}>
                      <TextField
                        label="Font Size"
                        id="outlined-size-small"
                        size="small"
                        name="yaxisFontSize"
                        value={chartCustomize.yaxisFontSize}
                        onChange={(e) => handleChartCustomize(e)}
                      />
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              {/* Chart ToolTip */}
              <Accordion
                expanded={expanded === "panel5"}
                onChange={handleChange("panel5")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    ToolTip
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      margin: "-10px",
                    }}
                  >
                    <div>
                      <TextField
                        label="Title"
                        id="outlined-size-small"
                        size="small"
                        name="Title"
                        sx={{ m: 1, minWidth: 320 }}
                        value={chartCustomize.yaxisTitle}
                        onChange={(e) => handleChartCustomize(e)}
                      />
                    </div>
                    <div style={{ paddingTop: "10px" }}>
                      <input
                        type="color"
                        id="favcolor"
                        name="yaxisColor"
                        value={chartCustomize.yaxisColor}
                        onChange={(e) => handleChartCustomize(e)}
                      ></input>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      margin: "-10px",
                      padding: " 0 0 25px",
                    }}
                  >
                    <div style={{ padding: "0 7px 10px 0px" }}>
                      <FormControl sx={{ m: 1, minWidth: 220 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Font Family
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          label="Font Family"
                          name="yaxisFontFamily"
                          value={chartCustomize.yaxisFontFamily}
                          onChange={(e) => handleChartCustomize(e)}
                        >
                          {Fonts.map((option, index) => (
                            <MenuItem key={option} value={option}>
                              <span style={{ fontFamily: option }}>
                                {option}
                              </span>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <div style={{ paddingTop: "10px" }}>
                      <TextField
                        label="Font Size"
                        id="outlined-size-small"
                        size="small"
                        name="yaxisFontSize"
                        value={chartCustomize.yaxisFontSize}
                        onChange={(e) => handleChartCustomize(e)}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      margin: "-10px",
                      padding: " 0 0 25px",
                    }}
                  >
                    <div style={{ padding: "0 7px 10px 0px" }}>
                      Background Color
                      <input
                        type="color"
                        id="favcolor"
                        name="yaxisColor"
                        value={chartCustomize.yaxisColor}
                        onChange={(e) => handleChartCustomize(e)}
                      ></input>
                    </div>

                    <div style={{ paddingTop: "10px" }}>
                      <TextField
                        label="Font Size"
                        id="outlined-size-small"
                        size="small"
                        name="yaxisFontSize"
                        value={chartCustomize.yaxisFontSize}
                        onChange={(e) => handleChartCustomize(e)}
                      />
                    </div>

                    <div style={{ padding: "0px 7px 10px 15px" }}>
                      Font Color
                      <input
                        type="color"
                        id="favcolor"
                        name="yaxisColor"
                        value={chartCustomize.yaxisColor}
                        onChange={(e) => handleChartCustomize(e)}
                      ></input>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              <div>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleShowChart}
                    style={{ margin: "20px", float: "right" }}
                  >
                    Generate Chart
                  </Button>
                </div>

                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={showModal}
                    style={{ margin: "20px", float: "right" }}
                  >
                    Save as Template
                  </Button>
                </div>
              </div>

              <Modal
                title="Template"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <div>
                  <TextField
                    label="Template Name"
                    id="outlined-size-small"
                    size="small"
                    name="templateName"
                    sx={{ m: 1, minWidth: 320 }}
                    value={chartCustomize.templateName}
                    onChange={(e) => handleChartCustomize(e)}
                  />
                </div>
                <div>
                  <TextField
                    label="Description"
                    id="outlined-multiline-static"
                    name="templateDescription"
                    rows={4}
                    sx={{ m: 1, minWidth: 320 }}
                    value={chartCustomize.templateDescription}
                    onChange={(e) => handleChartCustomize(e)}
                  />
                </div>
              </Modal>
            </>
          )}

          {data === "Template" && (
            <>
              <h2 style={{ paddingBottom: "25px" }}> Templates </h2>
              {/* <Button
                variant="contained"
                color="primary"
                style={{ float: "right" }}
              >
                Show Table
              </Button> */}

              <Accordion
                expanded={expanded === "panel6"}
                onChange={handleChange("panel6")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: "100%", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <div style={{ width: "10%" }}>
                        <FolderSpecialIcon />
                      </div>
                      <div>My saved Templates ({templateData?.length})</div>
                    </div>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* style={{ display: "flex", margin: "-10px" }} */}
                  <div className="dashboard-layout">
                    <div className="col-lg-12 container-template">
                      {templateData?.map((template, index) => (
                        <div
                          onClick={() => displayChart(index)}
                          key={index}
                          style={{
                            padding: "10px 0px 10px 25px",
                            background: "#FFFFFF",
                            borderBottom: "1px solid #DCDFE1",
                            borderTop: "1px solid #DCDFE1",
                            // margin: "5px 0px 0px 35px",
                            display: "flex",
                          }}
                        >
                          <div style={{ width: "15%" }}>
                            <LeaderboardTwoToneIcon />
                          </div>
                          <div>
                            <div className="col-lg-12 container-description">
                              <div className="row col-sm-11 col-md-11 col-lg-11">
                                <div>{template.chartLayout.templateName}</div>
                              </div>
                            </div>

                            <div className="col-lg-12 container-description">
                              <div className="row col-sm-11 col-md-11 col-lg-11">
                                <div>
                                  {template.chartLayout.templateDescription}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

              {/* Template collection */}
              <Accordion
                expanded={expanded === "panel7"}
                onChange={handleChange("panel7")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: "100%", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <div style={{ width: "10%" }}>
                        <FolderSpecialIcon />
                      </div>
                      <div>Template Collections (5)</div>
                    </div>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div>Need to implement !!</div>
                </AccordionDetails>
              </Accordion>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "1%",
          height: "100%",
          maxHeight: "100%",
          left: "34%",
          right: "5px",
          padding: "50px 0 0 0",
        }}
      >
        {showChart && (
          <PlotlyChild
            chartData={chartData}
            chartCustomize={chartCustomize}
            chartType={chartType}
            showTable={showTable}
            showChart={showChart}
          />
        )}

        {showTable && (
          <PlotlyChild
            chartData={chartData}
            chartCustomize={chartCustomize}
            chartType={chartType}
            showTable={showTable}
            showChart={showChart}
          />
        )}
      </div>
    </>
  );
};

export default Plotly_input;
