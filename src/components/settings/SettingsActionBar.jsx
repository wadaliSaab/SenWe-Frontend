import React from "react";
import { useNavigate} from "react-router-dom";
import { Home, Menu } from "lucide-react";
import AppIconRail from "../ui/AppIconRail";
import { useProfileStore } from "../../hooks/useProfileStore";

function SettingsActionBar({setActiveSection}) {
  const { settingActions } = useProfileStore();
  

  const navigate = useNavigate();
  

  const fixedActions = [
    {
      id: "home",
      icon: Home,
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      id: "menu",
      icon: Menu,
      label: "Menu",
      onClick: ()=>{setActiveSection(null)}  ,  
    },
  ];

  const actions = [...fixedActions, ...settingActions];

  return (
    <AppIconRail
      actions={actions}
      className="justify-start gap-2 border-x max-sm:w-11 border-text-secondary/30"
    />
  );
}

export default SettingsActionBar;