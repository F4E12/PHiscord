import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase/firebaseApp";
import { getUserData } from "@/lib/retrieveuser";
import ServerList from "./ServerList/ServerList";
import MainContent from "./MainContent";
import { updateUserData } from "@/lib/updateuserdata";
import { getAllServerDetails, getTextChannels } from "@/lib/retrieveserver";
import { doc, onSnapshot } from "firebase/firestore";

const Layout = ({ children }) => {
  const [selectedServer, setSelectedServer] = useState<any>("DM");
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [servers, setServers] = useState([]);

  const fetchUserData = async () => {
    if (user) {
      const data = await getUserData(user.uid);
      setUserData(data);
      if (data?.serverList?.length > 0) {
        const serverDetails = await getAllServerDetails(data?.serverList);
        setServers(serverDetails);
      }
    }
  };

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        doc(firestore, "users", user.uid),
        (doc) => {
          fetchUserData();
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        doc(firestore, "servers", selectedServer),
        (doc) => {
          fetchUserData();
        }
      );
      return () => unsubscribe();
    }
  }, [selectedServer]);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleProfileUpdate = async (newData: any) => {
    if (user) {
      await updateUserData(user.uid, newData);
      const updatedData = await getUserData(user.uid);
      setUserData(updatedData);
    }
  };

  const handleImageChange = (newImageURL: string) => {
    setUserData((prevData) => ({
      ...prevData,
      profilePicture: newImageURL,
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // const handleUpdateServer = () => {
  //   fetchUserData();
  // };

  const fetchChannels = async () => {
    const fetchedTextChannels = await getTextChannels(selectedServer);
    setSelectedChannel(fetchedTextChannels[0]);
  };
  useEffect(() => {
    fetchChannels();
  }, [selectedServer]);

  return (
    <div className="flex h-screen">
      <ServerList
        setSelectedServer={setSelectedServer}
        userData={userData}
        servers={servers}
        // onServerUpdated={handleUpdateServer}
      />
      <MainContent
        userData={userData}
        onProfileUpdate={handleProfileUpdate}
        onImageChange={handleImageChange}
        server={selectedServer}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        selectedFriend={selectedFriend}
        setSelectedFriend={setSelectedFriend}
      />
    </div>
  );
};

export default Layout;
