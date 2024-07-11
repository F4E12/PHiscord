import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Icon from "@/components/ui/icon";
import { ref, set, onValue, update } from "firebase/database";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { database, firestore } from "@/firebase/firebaseApp";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const CallComponent = ({
  appId,
  token,
  channelId,
  uid,
  username,
  channelName,
  server,
  members,
  setJoin,
}) => {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [localDeafen, setLocalDeafen] = useState(false);
  const [client, setClient] = useState(null);

  const updateUserInRealtimeDB = async (userId, data) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, data);
      console.log("User data updated successfully in Realtime Database");
    } catch (error) {
      console.error("Error updating user data in Realtime Database:", error);
      throw error;
    }
  };

  const updateUserInFirestore = async (userId, data, action) => {
    try {
      const userDocRef = doc(
        firestore,
        `servers/${server}/voiceChannels/${channelId}/users`,
        userId
      );
      if (action === "add") {
        await setDoc(userDocRef, data);
      } else if (action === "remove") {
        await deleteDoc(userDocRef);
      }
      console.log(
        `User data ${action === "add" ? "added to" : "removed from"} Firestore`
      );
    } catch (error) {
      console.error(`Error updating user data in Firestore:`, error);
      throw error;
    }
  };

  useEffect(() => {
    const userRef = ref(database, `users/${uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data && localAudioTrack) {
        localAudioTrack.setEnabled(!data.isMuted);
      }
      if (data && localVideoTrack) {
        localVideoTrack.setEnabled(data.isCameraOn);
      }
    });
    return () => unsubscribe();
  }, [uid, localAudioTrack, localVideoTrack]);

  useEffect(() => {
    const addUserListener = (userId) => {
      const userRef = ref(database, `users/${userId}`);
      return onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setConnectedUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.uid === userId
              ? { ...u, isMuted: data.isMuted, isDeafened: data.isDeafened }
              : u
          )
        );
        setLocalDeafen(data.isDeafened);
      });
    };

    const listeners = connectedUsers.map((user) => addUserListener(user.uid));

    return () => {
      listeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [connectedUsers]);

  useEffect(() => {
    setConnectedUsers([]);

    const startCall = async () => {
      try {
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        const agoraClient = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });
        setClient(agoraClient);

        console.log("Joining channel:", channelId);
        await agoraClient.join(appId, channelId, token, uid);
        console.log("Joined channel successfully");

        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);

        console.log("Publishing local audio track");
        await agoraClient.publish([audioTrack]);
        console.log("Published local audio track");

        // Add the local user to the connected users state
        const localUserData = {
          uid,
          username,
          isMuted: false,
          isDeafened: false,
          isCameraOn: false,
        };
        setLocalDeafen(false);
        setConnectedUsers((prevUsers) => [...prevUsers, localUserData]);
        await updateUserInRealtimeDB(uid, localUserData);
        await updateUserInFirestore(uid, localUserData, "add");

        agoraClient.on("user-published", async (user, mediaType) => {
          if (mediaType === "audio") {
            await agoraClient.subscribe(user, mediaType);
            const remoteAudioTrack = user.audioTrack;
            remoteAudioTrack.play();
          }
          if (mediaType === "video") {
            await agoraClient.subscribe(user, mediaType);
            const remoteVideoTrack = user.videoTrack;
            const remotePlayerContainer = document.createElement("div");
            remotePlayerContainer.id = user.uid.toString();
            document
              .getElementById("call-container")
              .append(remotePlayerContainer);
            remoteVideoTrack.play(remotePlayerContainer);
          }

          // Add the remote user to the connected users state if not already added
          const remoteUserData = {
            uid: user.uid.toString(),
            username: `User ${members[user.uid]?.displayname}`,
            isMuted: false,
            isDeafened: false,
            isCameraOn: false,
          };
          setConnectedUsers((prevUsers) => {
            if (!prevUsers.some((u) => u.uid === user.uid.toString())) {
              return [...prevUsers, remoteUserData];
            }
            return prevUsers;
          });
          await updateUserInRealtimeDB(user.uid.toString(), remoteUserData);
          await updateUserInFirestore(
            user.uid.toString(),
            remoteUserData,
            "add"
          );
        });

        agoraClient.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "video") {
            const remotePlayerContainer = document.getElementById(
              user.uid.toString()
            );
            if (remotePlayerContainer) {
              remotePlayerContainer.remove();
            }
          }
          console.log(`User ${user.uid} unpublished their ${mediaType}.`);
        });

        agoraClient.on("user-left", async (user) => {
          console.log("User left:", user.uid);
          const userId = user.uid.toString();
          await updateUserInRealtimeDB(userId, { status: "left" });
          await updateUserInFirestore(userId, {}, "remove");
          setConnectedUsers((prevUsers) =>
            prevUsers.filter((u) => u.uid !== userId)
          );
        });

        // Check and display already connected users
        agoraClient.remoteUsers.forEach(async (user) => {
          const remoteUserData = {
            uid: user.uid.toString(),
            username: `User ${members[user.uid]?.displayname}`,
            isMuted: false,
            isDeafened: false,
            isCameraOn: false,
          };
          setConnectedUsers((prevUsers) => {
            if (!prevUsers.some((u) => u.uid === user.uid.toString())) {
              return [...prevUsers, remoteUserData];
            }
            return prevUsers;
          });
          await updateUserInRealtimeDB(user.uid.toString(), remoteUserData);
          await updateUserInFirestore(
            user.uid.toString(),
            remoteUserData,
            "add"
          );
        });
      } catch (error) {
        console.error("Failed to join the channel:", error);
      }
    };

    if (token && typeof window !== "undefined") {
      startCall();
    }

    return () => {
      // Cleanup function to stop tracks and leave the channel
      if (localAudioTrack) localAudioTrack.close();
      if (localVideoTrack) localVideoTrack.close();
      if (client) client.leave();
    };
  }, [appId, token, channelId, uid, username]);

  const toggleMute = async () => {
    if (!localDeafen) {
      if (localAudioTrack) {
        const newMuteState = localAudioTrack.enabled;
        await localAudioTrack.setEnabled(!newMuteState);
        setConnectedUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.uid === uid ? { ...u, isMuted: newMuteState } : u
          )
        );
        await updateUserInRealtimeDB(uid, { isMuted: newMuteState });
      }
    }
  };
  const toggleDeafen = async () => {
    if (client) {
      const newDeafenState = !connectedUsers.find((user) => user.uid === uid)
        ?.isDeafened;
      setConnectedUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.uid === uid ? { ...u, isDeafened: newDeafenState } : u
        )
      );
      setLocalDeafen(newDeafenState);
      await updateUserInRealtimeDB(uid, { isDeafened: newDeafenState });

      if (newDeafenState) {
        client.remoteUsers.forEach((user) => {
          if (user.audioTrack) {
            user.audioTrack.setVolume(0);
          }
        });
      } else {
        client.remoteUsers.forEach((user) => {
          if (user.audioTrack) {
            user.audioTrack.setVolume(100);
          }
        });
      }
    }
  };

  const toggleCamera = async () => {
    if (localVideoTrack) {
      const newCameraState = !isCameraOn;
      if (newCameraState) {
        await localVideoTrack.setEnabled(true);
        await client.publish(localVideoTrack);
      } else {
        await localVideoTrack.setEnabled(false);
        await client.unpublish(localVideoTrack);
      }
      setConnectedUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.uid === uid ? { ...u, isCameraOn: newCameraState } : u
        )
      );
      setIsCameraOn(newCameraState);
      await updateUserInRealtimeDB(uid, { isCameraOn: newCameraState });
    }
  };

  const leaveChannel = async () => {
    const user = connectedUsers.find((user) => user.uid === uid);
    if (localAudioTrack) localAudioTrack.close();
    if (localVideoTrack) localVideoTrack.close();
    if (client) client.leave();
    await updateUserInRealtimeDB(uid, { status: "left" });
    await updateUserInFirestore(uid, {}, "remove");
    setJoin(false);
    setConnectedUsers((prevUsers) => prevUsers.filter((u) => u.uid !== uid));
  };

  return (
    <div className="">
      <div
        id="call-container"
        className="w-full h-full relative bg-background text-foreground p-4"
      >
        <div className="flex mb-4">
          <button
            onClick={toggleMute}
            className="mr-2 p-2 bg-gray-800 text-white rounded"
          >
            {connectedUsers.find((user) => user.uid === uid)?.isMuted
              ? "Unmute"
              : "Mute"}
          </button>
          <button
            onClick={toggleDeafen}
            className="mr-2 p-2 bg-gray-800 text-white rounded"
          >
            {connectedUsers.find((user) => user.uid === uid)?.isDeafened
              ? "Undeafen"
              : "Deafen"}
          </button>
          <button
            onClick={toggleCamera}
            className="mr-2 p-2 bg-gray-800 text-white rounded"
          >
            {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
          </button>
          <button
            onClick={leaveChannel}
            className="mr-2 p-2 bg-red-800 text-white rounded"
          >
            Leave Channel
          </button>
        </div>
        <div className="flex">
          {connectedUsers.map((user) => (
            <div
              key={user.uid}
              id={user.uid}
              className="w-96 h-52 border border-border flex items-center justify-center mb-2 rounded bg-card text-cardForeground gap-3"
            >
              <Avatar>
                <AvatarImage src={members[user.uid]?.profilePicture} />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>

              <span className="text-xl text-bold">{user.username}</span>
              <div className="absolute bottom-24 flex gap-2">
                {user.isMuted ? (
                  <Icon type="not-mic"></Icon>
                ) : (
                  <Icon type="mic"></Icon>
                )}
                {user.isDeafened ? (
                  <Icon type="not-headphone"></Icon>
                ) : (
                  <Icon type="headphone"></Icon>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallComponent;
