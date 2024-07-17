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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

export const updateUserData = async (userId: string, data: any) => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    await setDoc(userDocRef, data, { merge: true });
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

const updateUserDataRealtime = async (userId, data) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, data);
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
  const { toast } = useToast();

  const [colorClass, setColorClass] = useState("text-red-500");
  const colorClasses = [
    "text-red-500",
    "text-green-500",
    "text-blue-500",
    "text-orange-500",
    "text-purple-500",
    "text-pink-500",
    "text-yellow-500",
  ];

  useEffect(() => {
    const changeColor = () => {
      const newColorClass =
        colorClasses[Math.floor(Math.random() * colorClasses.length)];
      setColorClass(newColorClass);
    };

    const intervalId = setInterval(changeColor, 500);

    return () => clearInterval(intervalId);
  }, [colorClasses]);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userData.id);
    toast({
      variant: "default",
      title: "Success",
      description: "Your ID has been copied.",
    });
  };

  return (
    <div className="w-64 flex items-center justify-between p-2 bg-card rounded-md max-w-sm bottom-0">
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
          <span className="text-foreground text-sm font-semibold">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={`${colorClass}`}
                    onClick={() => copyToClipboard()}
                  >
                    {userData?.displayname}
                  </div>
                </TooltipTrigger>
                <TooltipContent>Click to copy user id</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          <span className="text-card-foreground text-xs">
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
            className="absolute right-4 top-4 z-10"
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
