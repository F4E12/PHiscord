import React from "react";

const ServerInformation = () => {
  const textChannels = ["general", "games", "tugas", "music"];
  const voiceChannels = ["Lounge", "Stream Room"];

  return (
    <div className="flex flex-col p-2">
      <h2 className="text-white">DUO AY</h2>
      <div className="mt-2">
        <h3 className="text-gray-400">Text Channels</h3>
        <div className="flex flex-col space-y-1">
          {textChannels.map((channel, index) => (
            <div key={index} className="text-white">
              #{channel}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-gray-400">Voice Channels</h3>
        <div className="flex flex-col space-y-1">
          {voiceChannels.map((channel, index) => (
            <div key={index} className="text-white">
              {channel}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServerInformation;
