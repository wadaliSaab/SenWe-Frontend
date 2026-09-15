import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Lock, Settings, User, MenuIcon } from "lucide-react";

function SidebarMenuButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const options = [
    { icon: <Search />, name: "Search", onClick: () => navigate("/settings?section=friends&action=search") },
    {
      icon: <Calendar />,
      name: "Scheduler",
       onClick: () => navigate("/settings?section=schedular"),
    },
    { icon: <Lock />, name: "Private",  onClick: () => navigate("/settings?section=private") },
    {
      icon: <Settings />,
      name: "Settings",
 onClick: () => navigate("/settings"),
    },
    { icon: <User />, name: "Profile",  onClick: () => navigate("/settings?section=profile") },
  ];

  const radius = 160;
  const maxAngle = 90;
  return (
    <div className="relative w-16 h-16 flex justify-end  items-end ml-2">
      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:w-12 sm:h-12 w-10 h-10 rounded-full bg-accent border-border  text-premium shadow-lg  flex justify-center items-center z-10"
      >
        <MenuIcon />
      </button>

      {options.map((option, idx) => {
        const angle = (idx / (options.length - 1)) * maxAngle;
        const rad = (angle * Math.PI) / 180;
        const x = -Math.cos(rad) * radius;
        const y = -Math.sin(rad) * radius;

        return (
          <button
            key={option.name}
            onClick={() => {
              option.onClick?.();
              setOpen(false);
            }}
            className={`w-12 h-12 rounded-full bg-secondary text-text-primary shadow-md absolute flex justify-center items-center 
                        transition-all duration-300
                        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            style={{
              transform: open
                ? `translate(${x}px, ${y}px)`
                : `translate(0px, 0px)`,
            }}
            title={option.name}
          >
            {option.icon}
          </button>
        );
      })}
    </div>
  );
}

export default SidebarMenuButton;
