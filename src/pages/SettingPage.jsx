import React from "react";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import SettingsLayout from "../components/settings/SettingsLayout";
import {useState} from "react";
import { useSearchParams } from "react-router-dom";

function Setting_page() {
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(searchParams.get("section") || null);

  return (
    <div className="flex bg-background w-full h-dvh overflow-hidden">
      <SettingsSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        className={`
          ${activeSection ? "hidden" : "flex"} 
          xs:flex h-full flex-col xs:max-w-[260px] min-w-[160px] w-full shrink-0 border-r border-shadow
        `}
      />
      <SettingsLayout
        activeSection={activeSection || "friends"}   
        setActiveSection={setActiveSection}
        
        className={`
          ${activeSection ? "flex" : "hidden"} 
          xs:flex flex-1 border h-full flex-col min-h-0
        `}
      />
    </div>
  );
}

export default Setting_page;
