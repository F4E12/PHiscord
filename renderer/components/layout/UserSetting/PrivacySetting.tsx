import React, { useState, useEffect } from "react";

interface PrivacySettingProps {
  userData: any;
  onProfileUpdate: (newData: any) => void;
}

const PrivacySetting: React.FC<PrivacySettingProps> = ({
  userData,
  onProfileUpdate,
}) => {
  const [messageSetting, setMessageSetting] = useState(
    userData?.privacySettings?.allowStrangerMessage || "show"
  );
  const [voiceCallSetting, setVoiceCallSetting] = useState(
    userData?.privacySettings?.allowStrangerVoiceCall || "show"
  );

  useEffect(() => {
    if (userData?.privacySettings) {
      setMessageSetting(userData.privacySettings.allowStrangerMessage);
      setVoiceCallSetting(userData.privacySettings.allowStrangerVoiceCall);
    }
  }, [userData]);

  const handleSave = () => {
    const updatedData = {
      ...userData,
      privacySettings: {
        allowStrangerMessage: messageSetting,
        allowStrangerVoiceCall: voiceCallSetting,
      },
    };
    onProfileUpdate(updatedData);
  };

  return (
    <div className="p-6 bg-secondary rounded-md shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl text-white font-semibold mb-4">
        Privacy Settings
      </h2>
      <div className="mb-4">
        <label className="block text-accent-foreground mb-2">
          Allow Stranger Message
        </label>
        <select
          value={messageSetting}
          onChange={(e) => setMessageSetting(e.target.value)}
          className="w-full px-4 py-2 bg-primary text-accent-foreground rounded focus:outline-none"
        >
          <option value="show">Show</option>
          <option value="blur">Blur</option>
          <option value="block">Block</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-accent-foreground-400 mb-2">
          Allow Stranger Voice Call
        </label>
        <select
          value={voiceCallSetting}
          onChange={(e) => setVoiceCallSetting(e.target.value)}
          className="w-full px-4 py-2 bg-primary text-accent-foreground rounded focus:outline-none"
        >
          <option value="show">Show</option>
          <option value="blur">Blur</option>
          <option value="block">Block</option>
        </select>
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default PrivacySetting;
