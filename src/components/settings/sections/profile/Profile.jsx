import React from "react";

import HeaderSection from "./HeaderSection";
import InformationSection from "./InformationSection";
import SecuritySection from "./SecuritySection";
import { useAuth } from "../../../../hooks/useAuth";

function Profile() {
  const { user, setUser } = useAuth(); 

  const handleUserUpdate = (updatedUser) => {
    setUser?.((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-8 overflow-y-auto hide-scrollbar rounded-2xl sm:p-8 p-4">
      {/* Header */}
      <HeaderSection user={user} onUserUpdate={handleUserUpdate} />

      <InformationSection user={user} onUserUpdate={handleUserUpdate} />

      {/* Security */}
      <SecuritySection />
    </div>
  );
}

export default Profile;