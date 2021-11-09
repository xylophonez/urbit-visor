import * as React from "react";
import permissionIcon from "../../icons/permissions-icon.svg";
import dashboardIcon from "../../icons/dashboard-icon.svg";
import homeIcon from "../../icons/home-icon.svg";

interface ManagerFooterProps {
  children: React.ReactNode;
  gotoPerms: () => void;
  gotoDashboard: () => void;
  gotoHome: () => void;
}

const ManagerFooter = ({
  children,
  gotoPerms,
  gotoDashboard,
  gotoHome,
}: ManagerFooterProps) => (
  <>
    {children}
    <div className="row-buttons">
      <button onClick={gotoPerms} className="surface-button vertical">
        <img src={permissionIcon} className="button-icon" />
        Permissions
      </button>
      <div className="separator" />
      <button onClick={gotoDashboard} className="surface-button vertical">
        <img src={dashboardIcon} className="button-icon" />
        Dashboard
      </button>
      <div className="separator" />
      <button onClick={gotoHome} className="surface-button vertical">
        <img src={homeIcon} className="button-icon" />
        Home
      </button>
    </div>
  </>
);

export default ManagerFooter;
