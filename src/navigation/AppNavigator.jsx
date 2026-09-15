import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatPage from "@/pages/ChatPage";
import SettingPage from "@/pages/SettingPage";
import AuthPage from "@/pages/AuthPage";
import ProtectedRoute from "@/navigation/ProtectedRoute"
import PublicRoute from "@/navigation/PublicRoute";

function AppNavigator() {
  return (
    <BrowserRouter>
    
      <Routes >
        <Route path="/" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingPage /></ProtectedRoute>} />
        <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppNavigator;
