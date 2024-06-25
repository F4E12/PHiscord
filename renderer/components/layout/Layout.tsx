import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseApp";
import { getUserData } from "@/lib/retrieveuser";
import ServerList from "./ServerList";
import MainContent from "./MainContent";
import { updateUserData } from "@/lib/updateuserdata";
import { getAllServerDetails } from "@/lib/retrieveserver";

const Layout = ({ children }) => {
  const [selectedServer, setSelectedServer] = useState<any>("DM");
  const [selectedServerDetails, setSelectedServerDetails] = useState<any>(null);
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [servers, setServers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data);
        if (data?.serverList?.length > 0) {
          console.log("AAAA", data?.serverList);
          const serverDetails = await getAllServerDetails(data.serverList);
          setServers(serverDetails);
        }
      }
    };
    fetchUserData();
  }, [user]);
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data);
      }
    };
    fetchUserData();
  }, [servers]);

  useEffect(() => {
    if (selectedServer && servers.length > 1) {
      const serverDetails = servers.find(
        (server) => server?.id === selectedServer
      );
      setSelectedServerDetails(serverDetails);
    }
  }, [selectedServer, servers]);

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

  return (
    <div className="flex h-screen">
      <ServerList
        setSelectedServer={setSelectedServer}
        userData={userData}
        servers={servers}
      />
      <MainContent
        userData={userData}
        onProfileUpdate={handleProfileUpdate}
        onImageChange={handleImageChange}
        server={selectedServer}
      />
    </div>
  );
};

export default Layout;
