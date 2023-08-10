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

const SideMenu = () => {
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
          <div class="space-parent">
            <img
              src={Logo}
              alt="Logo"
              style={{ height: "80px", "padding-top": "18px" }}
            ></img>
          </div>
          <div style={{ "margin-right": "10px",display: 'flex', 'align-items': 'baseline'}}>
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
                <BootstrapTooltip title="Data" placement="right">
                  <AddchartIcon />
                </BootstrapTooltip>
              </li>
              <li>
                <BootstrapTooltip title="Chart" placement="right">
                  <PollIcon />
                </BootstrapTooltip>
              </li>
              <li>
                <BootstrapTooltip title="Template" placement="right">
                  <DescriptionRoundedIcon />
                </BootstrapTooltip>
              </li>
              <li>
                <BootstrapTooltip title="DashBoard" placement="right">
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
