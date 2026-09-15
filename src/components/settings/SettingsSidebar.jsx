import React from "react";
import AppButton from "../ui/AppButton";
import App from "../../App";
import AppText from "../ui/AppText";
import Avatar from "../ui/Avatar";
import { useNavigate } from "react-router-dom";
import SenweBadge from "../ui/SenweBadge";
import { Check, Home } from "lucide-react";
import { logout } from "../../services/authService";
import{useProfileStore} from "../../hooks/useProfileStore"
import { useStore } from "../../hooks/useStore";


import { useAuth } from "../../hooks/useAuth";
import {
  CalendarDays,
  Users,
  Bookmark,
  Lock,
  Icon,
  LogOut,
  ArrowBigRightDash

} from "lucide-react";


const settingsmenu = [
  
  { id: "profile", label: "Profile", icon: Users },
  { id: "friends", label: "Friends", icon: Users },
  { id: "schedular", label: "Schedular", icon: CalendarDays },
  { id: "private", label: "Private", icon: Lock },

];



function SettingsSidebar({ className, activeSection, setActiveSection }) {
  const {user , logoutDevice} = useAuth();
  
 

  const{resetProfileStore}=useProfileStore();
  const{resetStore}=useStore();
  const navigate = useNavigate();


  const logoutHandler = () => {
  logoutDevice();
  

  logout();
  resetProfileStore();
  resetStore();



  navigate("/");

  
}
  return (
    <div className={className}>
      <div className="flex-1 min-h-0 min-w-0  flex flex-col gap-4 bg-background-hover ">
        <div className="flex items-center min-w-0 flex-col justify-center">
          <SenweBadge
            color="#1461CC"
            verified={true}
            size={125}
            verificationIcon={<Check className="text-premium font-bold" />}
            iconSize={200}
            avatar={user.avatar}
          />
          <div className="flex pb-1 gap-2  w-full flex-col  items-center px-6 ">
            <AppText variant="subheading" className="truncate w-full text-center ">
              {user.username}
            </AppText>
           <div className="flex  gap-2   items-center ">
            <div className="rounded-full w-1 h-1 bg-accent"/>
            <AppText variant="label2" className=" text-text-secondary">
             Verified Person
            </AppText>
          </div> </div>
         
        </div>
        <div className=" flex    min-h-100      flex-col ">
          {settingsmenu.map((item) => {
            const Icon = item.icon;
            return (
              <AppButton
                variant="secondary"
                size="lg"
                
                active={item.id === activeSection}
                key={item.id}
                onClick={() => setActiveSection(item.id)}
              >
                <div className="flex  gap-4 px-2 items-center  w-full">
                  <Icon
                    className={`w-4 h-4  ${item.id === activeSection ? "text-text-primary" : "text-text-primary"}`}
                  />
                  <span className=" text-left text-sm  ">{item.label}</span>
                </div>
                <ArrowBigRightDash className="w-3 h-3 text-text-primary" />
              </AppButton>
            );
          })}
           <AppButton
            variant="secondary"
            size="lg"
            
            onClick={()=>navigate("/")}
          >
            <div className="flex items-center  gap-4 px-2 w-full ">
              <Home className="w-4 h-4 text-text-primary" />
              <span className=" text-left text-sm ">Home</span>
            </div>
            <ArrowBigRightDash className="w-3 h-3 text-text-primary" />
          </AppButton>
          <AppButton
            variant="secondary"
            size="lg"
            
            onClick={() => logoutHandler()}
          >
            <div className="flex items-center  gap-4 px-2 w-full ">
              <LogOut className="w-4 h-4 text-text-primary" />
              <span className=" text-left text-sm ">Logout</span>
            </div>
            <ArrowBigRightDash className="w-3 h-3 text-warning" />
          </AppButton>
        </div>
      </div>
    </div>
  );
}

export default SettingsSidebar;
