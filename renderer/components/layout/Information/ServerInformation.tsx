import React, { useEffect, useState } from "react";
import Separator from "../../ui/separator";
import ServerHeader from "./ServerHeaderInfo";
import {
  getServerDetails,
  getTextChannels,
  getVoiceChannels,
} from "@/lib/retrieveserver";
import CreateChannelPopup from "../MainSection/Server/CreateChannelPopup";
import { getUsersInServer } from "@/lib/retrieveuser";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "@/firebase/firebaseApp";
import ServerHeaderInfo from "./ServerHeaderInfo";
import { useAuthState } from "react-firebase-hooks/auth";

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
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchServerDetails = async () => {
      setLoading(true);
      try {
        const data = await getServerDetails(selectedServer);
        setServerDetails(data);
      } catch (error) {
        console.log("ERROR");
      } finally {
        setLoading(false);
      }
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
    setLoading(true);
    try {
      const fetchedTextChannels = await getTextChannels(selectedServer);
      const fetchedVoiceChannels = await getVoiceChannels(selectedServer);
      setTextChannels(fetchedTextChannels);
      setVoiceChannels(fetchedVoiceChannels);
      console.log(fetchedTextChannels);
    } catch (error) {
      console.error("Error fetching channels:", error);
    } finally {
      setLoading(false);
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
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <>
          <ServerHeaderInfo
            serverName={serverDetails.name}
            serverID={serverDetails.id}
            members={members}
          ></ServerHeaderInfo>
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
              {user.uid === serverDetails.ownerId && (
                <CreateChannelPopup serverId={selectedServer} />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ServerInformation;
