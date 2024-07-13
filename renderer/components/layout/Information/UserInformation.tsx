import { useEffect, useState } from "react";
import Icon from "../../ui/icon";
import { UserSetting } from "../UserSetting/UserSetting";
import { doc, setDoc } from "firebase/firestore";
import { firestore, auth, database } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserData } from "@/lib/retrieveuser";
import { ref, onValue, set, update } from "firebase/database";
import useUserPresence from "@/lib/useUserPresence";
import { boolean } from "zod";

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

const updateUserDataRealtime = async (userId, data) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, data);
    console.log("User data updated successfully");
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

let ipc;
if (typeof window !== "undefined") {
  ipc = (window as any).ipc;
}

function UserInformation({ userData, onProfileUpdate, onImageChange }) {
  const [mute, setMute] = useState(false);
  const [deafen, setDeafen] = useState(false);
  const [setting, setSetting] = useState(false);
  const [previousMuteState, setPreviousMuteState] = useState(false);
  const [user] = useAuthState(auth);
  const presence = useUserPresence(user?.uid);

  useEffect(() => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setMute(data.isMuted || false);
          setDeafen(data.isDeafened || false);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (deafen) {
      setPreviousMuteState(mute);
      if (!mute) {
        setMute(true);
        updateUserDataRealtime(user.uid, { isMuted: true });
      }
    } else {
      setMute(previousMuteState);
      updateUserDataRealtime(user.uid, { isMuted: previousMuteState });
    }
  }, [deafen]);

  useEffect(() => {
    if (ipc) {
      ipc.on("toggle-mute", toggleMute);
      ipc.on("toggle-deafen", toggleDeafen);

      return () => {
        ipc.off("toggle-mute", toggleMute);
        ipc.off("toggle-deafen", toggleDeafen);
      };
    }
  }, [mute, deafen]);

  const toggleMute = async () => {
    if (!deafen) {
      const newMuteState = !mute;
      setMute(newMuteState);
      await updateUserDataRealtime(user.uid, { isMuted: newMuteState });
    }
  };

  const toggleDeafen = async () => {
    const newDeafenState = !deafen;
    setDeafen(newDeafenState);
    await updateUserDataRealtime(user.uid, { isDeafened: newDeafenState });
  };

  const toggleSetting = () => {
    setSetting(!setting);
  };

  return (
    <div className="w-64 flex items-center justify-between p-2 bg-gray-900 rounded-md max-w-sm bottom-0">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Avatar>
            <AvatarImage src={userData?.profilePicture} />
            <AvatarFallback>
              {(userData?.displayname || "").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-semibold">
            {userData?.displayname}
          </span>
          <span className="text-gray-400 text-xs">
            {userData?.status ||
              (presence ? "online" : "offline") ||
              "No Status"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="" onClick={() => toggleMute()}>
          {mute ? <Icon type="not-mic"></Icon> : <Icon type="mic"></Icon>}
        </button>
        <button className="" onClick={() => toggleDeafen()}>
          {deafen ? (
            <Icon type="not-headphone"></Icon>
          ) : (
            <Icon type="headphone"></Icon>
          )}
        </button>
        <button className="" onClick={() => toggleSetting()}>
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
            className="absolute right-0 top-0 z-10"
            onClick={() => toggleSetting()}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default UserInformation;
