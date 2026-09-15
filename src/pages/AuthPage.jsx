import React,{useEffect} from "react";
import background from "../assets/images_main/background.png";
import illustrative from "../assets/images_main/illustrative.png";
import AuthCard from "../components/auth/AuthCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/appStore";
import {toast} from "sonner"

function AuthPage() {

  const{resetStore} = useStore()
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  const onLoginSuccess = () => {
    navigate("/");
  };
  const onRegisterSuccess = () => {
    toast.success("Account created successfully");
    setMode("login");
  };
  useEffect(() => {
    resetStore();
  }, []);
  return (
    <div className=" relative min-h-dvh overflow-hidden isolate  ">
      <img
        src={background}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover  -z-20"
      />
      <div className="absolute inset-0 bg-background/55 -z-10"/>

      <div className="  mx-auto flex min-h-dvh  max-w-5xl p-4     items-center  justify-center  ">

       
           <AuthCard
          mode={mode}
          setMode={setMode}
          onLoginSuccess={onLoginSuccess}
          onRegisterSuccess={onRegisterSuccess}
        />
     </div>
 <img
        src={illustrative}
        alt="illustrative"
        className="  absolute auth-illustration bottom-0 right-0 -z-5   h-[100vh] pointer-events-none select-none w-auto object-contain"
      />
       
     

     
    </div>
  );
}

export default AuthPage;
