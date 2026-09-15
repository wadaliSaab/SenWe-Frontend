import React from "react";
import AppText from "../ui/AppText";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import logo from "../../assets/images_main/logo.png";
import { useState } from "react";

function AuthCard({ mode, setMode, onLoginSuccess, onRegisterSuccess }) {
  const [registeredEmail, setRegisteredEmail] = useState("");
  return (
    <div className=" w-full    max-w-sm ">
      <div 
        className="rounded-3xl
        border
      
        border-accent-light
        bg-background-secondary/90
        backdrop-blur-md
        shadow-xl
        px-8
        py-4
        lg:px-10
        "
      >
        <div className="flex flex-col items-center text-center gap-2  ">
          <img src={logo} alt="SenWe Logo" className="h-16 w-16  object-contain select-auto " />

          <AppText variant="heading" >{
            mode === "login" ? "Welcome Back" : "Create Account" }</AppText>

          <AppText variant="small" className="max-w-[300px] text-center text-text-secondary">
            {
              mode === "login" ? "Sign in to continue your conversations securely" : "Create your account to start chatting securely"
            }
          </AppText>
        </div>
        <div className="mt-4 ">
          {mode === "login" ? (
            <LoginForm setMode={setMode} onLoginSuccess={onLoginSuccess} registeredEmail={registeredEmail} />
          ) : (
            <RegisterForm
              setMode={setMode}
              onRegisterSuccess={onRegisterSuccess}
              setRegisteredEmail={setRegisteredEmail}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
