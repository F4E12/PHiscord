import Icon from "@/components/ui/icon";
import { useEffect, useState } from "react";
import CallComponent from "../../Call/CallComponent";
import { Button, buttonVariants } from "@/components/ui/button";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseApp";

const ServerCall = ({
  appId,
  token,
  channelId,
  uid,
  username,
  channelName,
  server,
  members,
}) => {
  const [join, setJoin] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    setJoin(false);
  }, [appId, token, channelId, uid, username]);

  useEffect(() => {
    const usersCollectionRef = collection(
      firestore,
      `servers/${server}/voiceChannels/${channelId}/users`
    );

    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      const users = snapshot.docs.map((doc) => doc.data());
      setConnectedUsers(users);
    });

    return () => unsubscribe();
  }, [join, server, channelId]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 flex items-center bg-card">
        <Icon type="speaker" />
        <p className="ml-2">{channelName}</p>
      </div>
      {join ? (
        <CallComponent
          appId={appId}
          token={token}
          channelId={channelId}
          uid={uid}
          username={username}
          channelName={channelName}
          server={server}
          members={members}
          setJoin={setJoin}
        />
      ) : (
        <div className="flex flex-col items-center justify-center">
          {connectedUsers.length > 0
            ? "Connected User"
            : "There is no one connected to this channel"}
          {connectedUsers.map((user) => (
            <li
              key={user.uid}
              className="w-80 h-15 border border-border flex items-center justify-center mb-2 rounded bg-card text-cardForeground"
            >
              {user.username}
            </li>
          ))}
          <button
            className="bg-blue-700 hover:bg-blue-800 cursor-pointer p-2 rounded-md"
            onClick={() => setJoin(true)}
          >
            Join Voice
          </button>
        </div>
      )}
    </div>
  );
};

export default ServerCall;
