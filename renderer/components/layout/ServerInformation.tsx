import React, { useEffect, useState } from "react";
import Separator from "../ui/separator";
import ServerHeader from "./ServerHeader";
import { getServerDetails } from "@/lib/retrieveserver";

interface ServerInformationProps {
  selectedServer: any;
}

const ServerInformation = ({ selectedServer }: ServerInformationProps) => {
  const textChannels = ["general", "games", "tugas", "music"];
  const voiceChannels = ["Lounge", "Stream Room"];
  //   const [textChannels, setTextChannel] = useState(serverDetails.channels.voiceChannels);
  // const [voiceChannels, setVoiceChannel] = useState();
  const [serverDetails, setServerDetails] = useState(selectedServer);
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getServerDetails(selectedServer);
      setServerDetails(data);
    };
    fetchUserData();
  }, [selectedServer]);
  return (
    <>
      <ServerHeader serverName={serverDetails?.name}></ServerHeader>
      <div className="flex flex-col p-2 w-full">
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
    </>
  );
};

export default ServerInformation;
