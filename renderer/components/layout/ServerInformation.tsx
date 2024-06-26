import React, { useEffect, useState } from "react";
import Separator from "../ui/separator";
import ServerHeader from "./ServerHeader";
import {
  getServerDetails,
  getTextChannels,
  getVoiceChannels,
} from "@/lib/retrieveserver";
import CreateChannelPopup from "./CreateChannelPopup";
import { getUsersInServer } from "@/lib/retrieveuser";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseApp";

interface ServerInformationProps {
  selectedServer: any;
  selectedChannel: any;
  setSelectedChannel: (channel: any) => void;
  members: any;
}

const ServerInformation = ({
  selectedServer,
  setSelectedChannel,
  members,
}: ServerInformationProps) => {
  const [serverDetails, setServerDetails] = useState(selectedServer);
  const [textChannels, setTextChannels] = useState([]);
  const [voiceChannels, setVoiceChannels] = useState([]);

  useEffect(() => {
    const fetchServerDetails = async () => {
      const data = await getServerDetails(selectedServer);
      setServerDetails(data);
    };
    fetchServerDetails();
  }, [selectedServer]);

  useEffect(() => {
    const channelsCollectionRef = collection(
      firestore,
      "servers",
      selectedServer,
      "textChannels"
    );
    const unsubscribeChannels = onSnapshot(
      channelsCollectionRef,
      (snapshot) => {
        fetchChannels();
      }
    );

    return () => unsubscribeChannels();
  }, [selectedServer]);

  const fetchChannels = async () => {
    try {
      const fetchedTextChannels = await getTextChannels(selectedServer);
      const fetchedVoiceChannels = await getVoiceChannels(selectedServer);
      setTextChannels(fetchedTextChannels);
      setVoiceChannels(fetchedVoiceChannels);
      console.log(fetchedTextChannels);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  useEffect(() => {
    if (selectedServer) {
      fetchChannels();
    }
  }, [selectedServer]);

  const handleChannelCreated = () => {
    fetchChannels();
  };

  return (
    <>
      <ServerHeader
        serverName={serverDetails.name}
        serverID={serverDetails.id}
        members={members}
      ></ServerHeader>
      <div className="flex flex-col p-2 w-full">
        <div className="mt-2">
          <h3 className="text-gray-400">Text Channels</h3>
          <div className="flex flex-col space-y-1">
            {textChannels.map((channel, index) => (
              <div
                key={index}
                className="text-foreground hover:cursor-pointer hover:bg-background"
                onClick={() => setSelectedChannel(channel)}
              >
                #{channel.name}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-gray-400">Voice Channels</h3>
          <div className="flex flex-col space-y-1">
            {voiceChannels.map((channel, index) => (
              <div
                key={index}
                className="text-foreground hover:cursor-pointer hover:bg-background"
                onClick={() => setSelectedChannel(channel)}
              >
                {channel.name}
              </div>
            ))}
          </div>
        </div>
        <div className="">
          <CreateChannelPopup serverId={selectedServer} />
        </div>
      </div>
    </>
  );
};

export default ServerInformation;
