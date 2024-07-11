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
      console.log("USERS:", users);
      setConnectedUsers(users);
    });

    console.log(connectedUsers);
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
        <div className="">
          {connectedUsers.map((user) => (
            <li
              key={user.uid}
              className="w-80 h-15 border border-border flex items-center justify-center mb-2 rounded bg-card text-cardForeground"
            >
              {user.username}
            </li>
          ))}
          <Button
            className={buttonVariants({ variant: "form" })}
            onClick={() => setJoin(true)}
          >
            Join Voice
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServerCall;
