import { ReactNode, useEffect, useState } from "react";
import InfoSection from "@/components/layout/Information/InfoSection";
import ChatSection from "@/components/layout/MainSection/Server/ServerChat";
import { getServerDetails } from "@/lib/retrieveserver";
import ServerChat from "@/components/layout/MainSection/Server/ServerChat";
import DMSection from "./MainSection/DM/DMSection";
import { getUsersInServer } from "@/lib/retrieveuser";
import { firestore } from "@/firebase/firebaseApp";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
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

  const getServerNicknames = async (serverId) => {
    const nicknamesRef = collection(
      firestore,
      `servers/${serverId}/serverNickname`
    );
    const snapshot = await getDocs(nicknamesRef);
    const nicknames = snapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data().nickname;
      return acc;
    }, {});
    return nicknames;
  };

  const updateMembers = async () => {
    const users = await getUsersInServer(server);
    const serverNicknames = await getServerNicknames(server);

    const updatedUsers = users.map((user) => {
      if (serverNicknames[user.id]) {
        return {
          ...user,
          displayname: serverNicknames[user.id] || user.displayname,
        };
      }
      return user;
    });

    setMembers(updatedUsers);

    // Create a lookup object for quick access
    const lookup = updatedUsers.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
    setMembersLookup(lookup);
  };

  useEffect(() => {
    if (!server) return;

    const nicknamesRef = collection(
      firestore,
      `servers/${server}/serverNickname`
    );

    const unsubscribe = onSnapshot(nicknamesRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const nickname = change.doc.data().nickname;
        const userId = change.doc.id;

        if (change.type === "added" || change.type === "modified") {
          setMembers((prevMembers) =>
            prevMembers.map((member) =>
              member.id === userId
                ? { ...member, displayname: nickname }
                : member
            )
          );
        }

        if (change.type === "removed") {
          setMembers((prevMembers) =>
            prevMembers.map((member) =>
              member.id === userId ? { ...member, displayname: "" } : member
            )
          );
        }
        updateMembers();
      });
    });
    return () => {
      unsubscribe();
    };
  }, [server]);

  useEffect(() => {
    if (!server) {
      console.error("Server is undefined or null");
      return;
    }

    // Initial fetch of members
    updateMembers();

    // Listen for changes in the server document
    const serverDocRef = doc(firestore, "servers", server);
    const unsubscribeServer = onSnapshot(serverDocRef, (snapshot) => {
      if (snapshot.exists()) {
        updateMembers();
      }
    });

    // Listen for changes in the users collection
    const usersCollectionRef = collection(firestore, "users");
    const unsubscribeUsers = onSnapshot(usersCollectionRef, () => {
      updateMembers();
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
