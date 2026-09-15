import React from "react";
import AppButton from "../ui/AppButton";
import AppText from "../ui/AppText";
import logo from "../../assets/images_main/logo.png";
import { useNavigate } from "react-router-dom";
import { Search, UserCog } from "lucide-react";

function SidebarHeader({ setQuery }) {
  const navigate = useNavigate();

  return (
    <div className="w-full shrink-0 flex flex-col gap-4 py-2 bg-background-secondary">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center justify-self-start gap-2">
          <img
            src={logo}
            alt="Senwe"
            className="h-10 w-10 select-none object-contain"
          />
        </div>

        <div className="space-y-2">
          <AppText as="h1" variant="heading" className="leading-none justify-self-center">
            SenWe
          </AppText>
          <AppText variant="label">Ready To Launch</AppText>
        </div>

        <div className="justify-self-end">
          <AppButton
            aria-label="Open settings"
            onClick={() => navigate("/settings")}
            variant="icon"
          >
            <UserCog className="size-5" />
          </AppButton>
        </div>
      </div>

      <div className="shrink-0 w-full px-5 relative">
        <Search
          size={16}
          className="absolute left-8 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
        />
        <input
          type="search"
  name="app-search-query"
  autoComplete="new-password"
  onChange={(e) => setQuery(e.target.value)}
  placeholder="Search here...."
          className="w-full rounded-lg shadow shadow-shadow pl-11 border border-shadow/20 hover:border-accent/50 bg-background-hover px-4 py-3 text-xs text-text-primary placeholder:text-text-secondary focus:outline-none"
        />
      </div>
    </div>
  );
}

export default SidebarHeader;