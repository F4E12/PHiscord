import { useEffect, useState } from "react";
import Icon from "../ui/icon";
import { UserSetting } from "./UserSetting/UserSetting";
import { doc, setDoc } from "firebase/firestore";
import { firestore, auth } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserData } from "@/lib/retrieveuser";

export const updateUserData = async (userId: string, data: any) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    await setDoc(userDocRef, data, { merge: true });
    console.log("User data updated successfully");
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

function UserInformation({ userData, onProfileUpdate, onImageChange }) {
  // const [user, loading, error] = useAuthState(auth);
  const [mute, setMute] = useState(false);
  const [deafen, setDeafen] = useState(false);
  const [setting, setSetting] = useState(false);

  const toogleMute = () => {
    setMute(!mute);
  };
  const toogleDeafen = () => {
    setDeafen(!deafen);
  };
  const toogleSetting = () => {
    console.log(userData);
    setSetting(!setting);
  };
  return (
    <div className="w-64 flex items-center justify-between p-2 bg-gray-900 rounded-md max-w-sm bottom-0">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Avatar>
            <AvatarImage
              src={userData?.profilePicture || "/path-to-your-image.png"}
            />
            <AvatarFallback>
              {(userData?.displayname || "").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-semibold">
            {userData?.displayname}
          </span>
          <span className="text-gray-400 text-xs">:D</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="" onClick={() => toogleMute()}>
          {mute || deafen ? (
            <Icon type="not-mic"></Icon>
          ) : (
            <Icon type="mic"></Icon>
          )}
        </button>
        <button className="" onClick={() => toogleDeafen()}>
          {deafen ? (
            <Icon type="not-headphone"></Icon>
          ) : (
            <Icon type="headphone"></Icon>
          )}
        </button>
        <button className="" onClick={() => toogleSetting()}>
          <Icon type="setting"></Icon>
        </button>
        {setting && (
          <UserSetting
            userData={userData}
            onProfileUpdate={onProfileUpdate}
            onImageChange={onImageChange}
          />
        )}
        {setting && (
          <button
            className="absolute right-0 top-0"
            onClick={() => toogleSetting()}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default UserInformation;
