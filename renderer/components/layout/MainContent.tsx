import { ReactNode, useEffect, useState } from "react";
import InfoSection from "@/components/layout/Information/InfoSection";
import ChatSection from "@/components/layout/MainSection/Server/ServerChat";
import { getServerDetails } from "@/lib/retrieveserver";
import ServerChat from "@/components/layout/MainSection/Server/ServerChat";
import DMSection from "./MainSection/DM/DMSection";
import { getUsersInServer } from "@/lib/retrieveuser";
import { firestore } from "@/firebase/firebaseApp";
import { collection, doc, onSnapshot } from "firebase/firestore";
import ServerVoice from "./Call/CallComponent";

import dynamic from "next/dynamic";
import ServerCall from "./MainSection/Server/ServerCall";
const CallComponent = dynamic(() => import("./Call/CallComponent"), {
  ssr: false,
});

interface ServerContentProps {
  userData: any;
  onProfileUpdate: (newData: any) => void;
  onImageChange: (newImageURL: string) => void;
  selectedChannel: any;
  server: any;
  setSelectedChannel: (channel: any) => void;
  selectedFriend: any;
  setSelectedFriend: (channel: any) => void;
  setChannelType: (channel: any) => void;
  channelType: any;
}

const MainContent = ({
  userData,
  onProfileUpdate,
  onImageChange,
  server,
  selectedChannel,
  setChannelType,
  setSelectedChannel,
  setSelectedFriend,
  selectedFriend,
  channelType,
}: ServerContentProps) => {
  const [members, setMembers] = useState([]);
  const [membersLookup, setMembersLookup] = useState({});

  const [token, setToken] = useState("");
  const [appId] = useState("e9f44b3f91fb4ef2815937b4fcc10907");

  useEffect(() => {
    if (channelType === "text") return;
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/generate-agora-token?channelId=${selectedChannel?.id}&uid=${userData?.id}`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Error generating token:", error);
      }
    };

    if (userData) {
      fetchToken();
    }
  }, [userData, selectedChannel?.id, userData?.id]);

  const updateMembers = async (serverId) => {
    const users = await getUsersInServer(serverId);
    setMembers(users);

    const lookup = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
    setMembersLookup(lookup);
  };

  useEffect(() => {
    if (!server) {
      console.error("Server is undefined or null");
      return;
    }

    // Initial fetch of members
    updateMembers(server);

    // Listen for changes in the server document
    const serverDocRef = doc(firestore, "servers", server);
    const unsubscribeServer = onSnapshot(serverDocRef, (snapshot) => {
      if (snapshot.exists()) {
        updateMembers(server);
      }
    });

    // Listen for changes in the users collection
    const usersCollectionRef = collection(firestore, "users");
    const unsubscribeUsers = onSnapshot(usersCollectionRef, () => {
      updateMembers(server);
    });

    return () => {
      unsubscribeServer();
      unsubscribeUsers();
    };
  }, [server]);
  return (
    <div className="flex flex-grow">
      <div className="w-64 bg-secondary">
        {/* {server} */}
        <InfoSection
          userData={userData}
          onProfileUpdate={onProfileUpdate}
          onImageChange={onImageChange}
          selectedServer={server}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
          setSelectedFriend={setSelectedFriend}
          setChannelType={setChannelType}
          members={membersLookup}
        />
      </div>
      <div className="flex-grow bg-background h-full">
        {server === "DM" ? (
          <>
            <DMSection
              friend={selectedFriend}
              setSelectedFriend={setSelectedFriend}
            />
          </>
        ) : (
          <>
            {channelType === "text" ? (
              <ServerChat
                server={server}
                channel={selectedChannel}
                members={membersLookup}
              />
            ) : (
              <div className="">
                <ServerCall
                  appId={appId}
                  token={token}
                  channelId={selectedChannel.id}
                  uid={userData?.id}
                  username={userData.displayname}
                  channelName={selectedChannel.name}
                  server={server}
                  members={membersLookup}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MainContent;
