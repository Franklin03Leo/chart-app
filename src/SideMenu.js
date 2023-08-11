// import 
import React, {useState} from "react";
//mui icons
import AddchartIcon from "@mui/icons-material/Addchart";
import DatasetIcon from "@mui/icons-material/Dataset";
import PollIcon from "@mui/icons-material/Poll";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
// custom css
import "./SideMenu.css";
// tool tip
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// logo
import Logo from "../../chart-app/src/Logo.svg";
import Avatar from "@mui/material/Avatar";

const SideMenu = ({ data, onDataUpdate }) => {

  console.log(` ${data} has get from sidemenu`)
  // const [data, setData] = useState("");
  const handleSendData = (val) => {
    
    onDataUpdate(val);
  };

  // toolTip hover message
  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  return (
    <>
      <div>
        <div id="headerbar">
          <div className="space-parent">
            <img
              src={Logo}
              alt="Logo"
              style={{ height: "80px", "paddingTop": "18px" }}
            ></img>
          </div>
          <div style={{ "marginRight": "10px",display: 'flex', 'alignItems': 'baseline'}}>
            <div>
              <Avatar>F</Avatar>{" "}
            </div>
            <div style={{padding : '10px'}}> Franklin</div>
          </div>
        </div>
      </div>

      <div>
        <div className={`side-menu open`}>
          <nav className="menu-items">
            <ul>
              <li>
                <BootstrapTooltip title="Data" placement="right" onClick = {() => handleSendData('Data')}>
                  <AddchartIcon />
                </BootstrapTooltip>
              </li>
              <li>
                <BootstrapTooltip title="Chart" placement="right" onClick = {() => handleSendData('Chart')}>
                  <PollIcon />
                </BootstrapTooltip>
              </li>
              <li>
                <BootstrapTooltip title="Template" placement="right" onClick = {() => handleSendData('Template')}>
                  <DescriptionRoundedIcon />
                </BootstrapTooltip>
              </li>
              <li>
                <BootstrapTooltip title="DashBoard" placement="right" onClick = {() => handleSendData('DashBoard')}>
                  <DatasetIcon />
                </BootstrapTooltip>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
