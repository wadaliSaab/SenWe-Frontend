import React from "react";
import Schedular from "./sections/schedular/Schedular.jsx";
import Private_set from "./sections/private/Private_set";
import Friends from "./sections/friends/Friends";
import Profile from "./sections/profile/Profile.jsx";


const sectionMap={friends:Friends,schedular:Schedular,private:Private_set,profile:Profile};
function SettingsContent({ className , activeSection }) {
  const ActiveSection=sectionMap[activeSection];
  
  return (
    
       
    <div className={className}>
      
      {/* sectionArea */}
      <div className=" flex flex-1 h-full min-h-0   ">
        <ActiveSection/>
     
      </div>

    
     
    </div>
  );
}

export default SettingsContent;
