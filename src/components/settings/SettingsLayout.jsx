import React from "react";
import SettingsContent from "./SettingsContent";
import SettingsActionBar from "./SettingsActionBar";

function SettingsLayout({ className , activeSection ,setActiveSection }) {
  return (
    <div className={className}>
      <div className="flex  w-full h-full min-h-0  shadow-text-secondary bg-background-secondary  ">
        
        <SettingsActionBar setActiveSection={setActiveSection} ></SettingsActionBar>
        <SettingsContent activeSection={activeSection} className=" flex-1  bg-background-secondary  flex min-h-0  "></SettingsContent>
      </div>
    </div>
  );
}

export default SettingsLayout;
