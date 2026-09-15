import React from "react";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-full h-dvh bg-background-secondary">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 border-4 border-accent-light/10 border-t-accent-light rounded-full animate-spin" />
        <p className="text-accent-light/70 text-md font-semibold tracking-wide">SenWe Launching...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;