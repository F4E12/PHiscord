import React, { useEffect, useState } from "react";
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
  const [listenersSet, setListenersSet] = useState(false);

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
    if (channelName === "dm-call") {
      try {
        const userDocRef = doc(
          firestore,
          `directMessages/${channelId}/callMembers/`,
          userId
        );
        if (action === "add") {
          await setDoc(userDocRef, data);
        } else if (action === "remove") {
          await deleteDoc(userDocRef);
        }
        console.log(
          `User data ${
            action === "add" ? "added to" : "removed from"
          } Firestore`
        );
      } catch (error) {
        console.error(`Error updating user data in Firestore:`, error);
        throw error;
      }
    } else {
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
          `User data ${
            action === "add" ? "added to" : "removed from"
          } Firestore`
        );
      } catch (error) {
        console.error(`Error updating user data in Firestore:`, error);
        throw error;
      }
    }
  };

  const addUserListeners = (userIds) => {
    return userIds.map((userId) => {
      const userRef = ref(database, `users/${userId}`);
      return onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setConnectedUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.uid === userId
              ? {
                  ...u,
                  isMuted: data.isMuted,
                  isDeafened: data.isDeafened,
                  isCameraOn: data.isCameraOn,
                }
              : u
          )
        );
        if (userId === uid) {
          setLocalDeafen(data.isDeafened);
        }
      });
    });
  };

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

      // Disable video track by default
      await videoTrack.setEnabled(false);

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

      const unsubscribeFunctions = addUserListeners([
        uid,
        ...connectedUsers.map((u) => u.uid),
      ]);

      agoraClient.on("user-published", async (user, mediaType) => {
        await agoraClient.subscribe(user, mediaType);
        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack.play();
        }
        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack;
          let videoContainer = document.getElementById(
            `remote-player-${user.uid}`
          );
          if (!videoContainer) {
            videoContainer = document.createElement("div");
            videoContainer.id = `remote-player-${user.uid}`;
            videoContainer.className =
              "w-96 h-52 border border-border flex items-center justify-center mb-2 rounded bg-card text-cardForeground gap-3";
            document
              .getElementById(`video-user-${user.uid}`)
              .append(videoContainer);
          }
          remoteVideoTrack.play(videoContainer);
          const placeholder = document.getElementById(
            `placeholder-${user.uid}`
          );
          if (placeholder) {
            placeholder.style.display = "none";
          }
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
        await updateUserInFirestore(user.uid.toString(), remoteUserData, "add");

        // Add listener for the new remote user
        unsubscribeFunctions.push(...addUserListeners([user.uid.toString()]));
      });

      agoraClient.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "video") {
          const remotePlayerContainer = document.getElementById(
            `remote-player-${user.uid}`
          );
          if (remotePlayerContainer) {
            remotePlayerContainer.remove();
          }
          const placeholder = document.getElementById(
            `placeholder-${user.uid}`
          );
          if (placeholder) {
            placeholder.style.display = "flex";
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
        await updateUserInFirestore(user.uid.toString(), remoteUserData, "add");

        // Add listener for the existing remote users
        unsubscribeFunctions.push(...addUserListeners([user.uid.toString()]));
      });

      return unsubscribeFunctions;
    } catch (error) {
      console.error("Failed to join the channel:", error);
    }
  };

  useEffect(() => {
    if (token && typeof window !== "undefined") {
      const unsubscribe = startCall();
      return () => {
        // Cleanup function to stop tracks and leave the channel
        if (localAudioTrack) localAudioTrack.close();
        if (localVideoTrack) localVideoTrack.close();
        if (client) client.leave();
        if (unsubscribe)
          unsubscribe.then((unsubFns) => unsubFns?.forEach((unsub) => unsub()));
      };
    }
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
    if (!localVideoTrack || !client) return;

    const newCameraState = !isCameraOn;
    if (newCameraState) {
      await localVideoTrack.setEnabled(true);
      await client.publish(localVideoTrack);

      // Create and play local video if not already present
      let videoContainer = document.getElementById(`local-player-${uid}`);
      if (!videoContainer) {
        videoContainer = document.createElement("div");
        videoContainer.id = `local-player-${uid}`;
        videoContainer.className =
          "w-96 h-52 border border-border flex items-center justify-center mb-2 rounded bg-card text-cardForeground gap-3";
        document.getElementById(`video-user-${uid}`).append(videoContainer);
      }
      localVideoTrack.play(videoContainer);

      // Hide placeholder
      const placeholder = document.getElementById(`placeholder-${uid}`);
      if (placeholder) {
        placeholder.style.display = "none";
      }
    } else {
      await localVideoTrack.setEnabled(false);
      await client.unpublish(localVideoTrack);

      // Remove local video
      const videoContainer = document.getElementById(`local-player-${uid}`);
      if (videoContainer) {
        videoContainer.remove();
      }

      // Show placeholder
      const placeholder = document.getElementById(`placeholder-${uid}`);
      if (placeholder) {
        placeholder.style.display = "flex";
      }
    }

    setConnectedUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.uid === uid ? { ...u, isCameraOn: newCameraState } : u
      )
    );
    setIsCameraOn(newCameraState);
    await updateUserInRealtimeDB(uid, { isCameraOn: newCameraState });
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
        <div className="flex flex-wrap text-center justify-center">
          {connectedUsers.map((user) => (
            <div key={user.uid}>
              <div
                id={`placeholder-${user.uid}`}
                className="w-96 h-52 border border-border flex items-center justify-center mb-2 rounded bg-card text-cardForeground gap-3"
              >
                <Avatar>
                  <AvatarImage src={members[user.uid]?.profilePicture} />
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div id={`video-user-${user.uid}`}></div>
              <span className="text-s text-bold m-0">{user.username}</span>
              <div className="flex items-center justify-center gap-2">
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
      <div className="flex mb-4 justify-center">
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
          {channelName === "dm-call" ? "Leave Call" : "Leave Channel"}
        </button>
      </div>
    </div>
  );
};

export default CallComponent;
