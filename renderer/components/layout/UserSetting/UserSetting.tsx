import { useState } from "react";
import AppearanceSetting from "./AppearanceSetting";
import GeneralSetting from "./GeneralSetting";
import OverlaySetting from "./OverlaySetting";
import PrivacySetting from "./PrivacySetting";
import { SideBar } from "./SideBar";

export const UserSetting = () => {
  const [selectedSetting, setSelectedSetting] = useState("general");
  return (
    <div className="bg-primary absolute top-0 left-0 w-full h-full flex flex-row">
      <SideBar setSelectedSetting={setSelectedSetting} />
      {selectedSetting === "general" ? <GeneralSetting /> : null}
      {selectedSetting === "appearance" ? <AppearanceSetting /> : null}
      {selectedSetting === "overlay" ? <OverlaySetting /> : null}
      {selectedSetting === "privacy" ? <PrivacySetting /> : null}
    </div>
  );
};

export default UserSetting;
