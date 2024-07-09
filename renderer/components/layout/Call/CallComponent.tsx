// components/CallComponent.js
import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const CallComponent = ({ channelName, uid, token, appId }) => {
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  useEffect(() => {
    const init = async () => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setRemoteUsers((prev) => [...prev, user]);
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      await client.join(appId, channelName, token, uid);
      const [localAudioTrack, localVideoTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTracks([localAudioTrack, localVideoTrack]);
      await client.publish([localAudioTrack, localVideoTrack]);
    };

    init();

    return () => {
      localTracks.forEach((track) => track.close());
      client.leave();
    };
  }, [channelName, uid, token, appId]);

  return (
    <div>
      <div id="local-stream" style={{ width: "640px", height: "480px" }} />
      {remoteUsers.map((user) => (
        <div
          key={user.uid}
          id={`remote-${user.uid}`}
          style={{ width: "640px", height: "480px" }}
        />
      ))}
    </div>
  );
};

export default CallComponent;
