import { useState } from "react";
import AppearanceSetting from "./AppearanceSetting";
import GeneralSetting from "./GeneralSetting";
import OverlaySetting from "./OverlaySetting";
import PrivacySetting from "./PrivacySetting";
import { SideBar } from "./SideBar";
import { signOutUser } from "@/lib/authentication";

export const UserSetting = ({ userData, onProfileUpdate, onImageChange }) => {
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out", error);
    }
  };
  const [selectedSetting, setSelectedSetting] = useState("general");
  return (
    <div className="bg-primary absolute top-0 left-0 w-full h-full flex flex-row">
      <SideBar setSelectedSetting={setSelectedSetting} />
      {selectedSetting === "general" ? (
        <GeneralSetting
          userData={userData}
          onProfileUpdate={onProfileUpdate}
          onImageChange={onImageChange}
        />
      ) : null}
      {selectedSetting === "appearance" ? <AppearanceSetting /> : null}
      {selectedSetting === "overlay" ? <OverlaySetting /> : null}
      {selectedSetting === "privacy" ? (
        <PrivacySetting userData={userData} onProfileUpdate={onProfileUpdate} />
      ) : null}
      <div className="absolute bottom-4 left-4">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserSetting;
