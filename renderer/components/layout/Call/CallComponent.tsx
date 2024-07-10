import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Icon from "@/components/ui/icon";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseApp";

const CallComponent = ({
  appId,
  token,
  channelId,
  uid,
  username,
  channelName,
  server,
  members,
}) => {
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    let client;
    let localAudioTrack;
    setConnectedUsers([]);

    const updateUserInFirebase = async (user, action) => {
      const userRef = doc(
        firestore,
        `servers/${server}/voiceChannels/${channelId}/users`,
        user.id
      );
      if (action === "add") {
        await setDoc(userRef, { uid: user.id, displayname: user.displayname });
      } else if (action === "remove") {
        await deleteDoc(userRef);
      }
    };

    const startCall = async () => {
      try {
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

        console.log("Joining channel:", channelId);
        await client.join(appId, channelId, token, uid);
        console.log("Joined channel successfully");

        localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

        console.log("Publishing local audio track");
        await client.publish([localAudioTrack]);
        console.log("Published local audio track");

        // Add the local user to the connected users state
        setConnectedUsers((prevUsers) => [
          ...prevUsers,
          { uid: `local-${uid}`, username },
        ]);
        await updateUserInFirebase(members[uid], "add");

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);

          if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack;
            remoteAudioTrack.play();

            // Add the remote user to the connected users state if not already added
            setConnectedUsers((prevUsers) => {
              if (!prevUsers.some((u) => u.uid === user.uid.toString())) {
                return [
                  ...prevUsers,
                  {
                    uid: user.uid.toString(),
                    username: `User ${members[user.uid]?.displayname}`,
                  },
                ];
              }
              return prevUsers;
            });
            await updateUserInFirebase(members[user.uid], "add");
          }
        });

        client.on("user-unpublished", async (user) => {
          console.log("KELUAR");
          await updateUserInFirebase(members[user.uid], "remove");
          setConnectedUsers((prevUsers) =>
            prevUsers.filter((u) => u.uid !== user.uid.toString())
          );
        });

        // Check and display already connected users
        client.remoteUsers.forEach(async (user) => {
          setConnectedUsers((prevUsers) => {
            if (!prevUsers.some((u) => u.uid === user.uid.toString())) {
              return [
                ...prevUsers,
                {
                  uid: user.uid.toString(),
                  username: `User ${members[user.uid]?.displayname}`,
                },
              ];
            }
            return prevUsers;
          });
          await updateUserInFirebase(members[user.uid], "add");
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
      if (client) client.leave();
    };
  }, [appId, token, channelId, uid, username]);

  return (
    <div className="">
      <div
        id="call-container"
        className="w-full h-full relative bg-background text-foreground p-4"
      >
        {connectedUsers.map((user) => (
          <div
            key={user.uid}
            id={user.uid}
            className="w-80 h-15 border border-border flex items-center justify-center mb-2 rounded bg-card text-cardForeground"
          >
            {user.username}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallComponent;
