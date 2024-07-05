import { ReactNode, useEffect, useState } from "react";
import InfoSection from "@/components/layout/Information/InfoSection";
import ChatSection from "@/components/layout/MainSection/Server/ServerChat";
import { getServerDetails } from "@/lib/retrieveserver";
import ServerChat from "@/components/layout/MainSection/Server/ServerChat";
import DMSection from "./MainSection/DM/DMSection";
import { getUsersInServer } from "@/lib/retrieveuser";
import { firestore } from "@/firebase/firebaseApp";
import { collection, doc, onSnapshot } from "firebase/firestore";

interface ServerContentProps {
  userData: any;
  onProfileUpdate: (newData: any) => void;
  onImageChange: (newImageURL: string) => void;
  selectedChannel: any;
  server: any;
  setSelectedChannel: (channel: any) => void;
  selectedFriend: any;
  setSelectedFriend: (channel: any) => void;
}

const MainContent = ({
  userData,
  onProfileUpdate,
  onImageChange,
  server,
  selectedChannel,
  setSelectedChannel,
  setSelectedFriend,
  selectedFriend,
}: ServerContentProps) => {
  const [members, setMembers] = useState([]);
  const [membersLookup, setMembersLookup] = useState({});

  const updateMembers = async (serverId) => {
    const users = await getUsersInServer(serverId);
    console.log("users ", users);
    setMembers(users);

    const lookup = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
    setMembersLookup(lookup);
    console.log(lookup);
  };

  useEffect(() => {
    if (!server) {
      console.error("Server is undefined or null");
      return;
    }

    console.log("Fetching members for server:", server);

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
          members={membersLookup}
        />
      </div>
      <div className="flex-grow bg-background">
        {server === "DM" ? (
          <DMSection
            friend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
          />
        ) : (
          <ServerChat
            server={server}
            channel={selectedChannel}
            members={membersLookup}
          />
        )}
      </div>
    </div>
  );
};

export default MainContent;
