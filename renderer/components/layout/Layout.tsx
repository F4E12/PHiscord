import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseApp";
import { getUserData } from "@/lib/retrieveuser";
import ServerList from "./ServerList";
import MainContent from "./MainContent";
import { updateUserData } from "@/lib/updateuserdata";

const Layout = ({ children }) => {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data);
      }
    };
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

  return (
    <div className="flex h-screen">
      <ServerList setSelectedServer={setSelectedServer} />
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
