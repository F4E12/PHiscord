import React, { useEffect, useState, useRef } from "react";
import { firestore, auth } from "@/firebase/firebaseApp";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ServerChatProps {
  server: any;
  channel: any;
  members: any;
}

const ServerChat = ({ server, channel, members }: ServerChatProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  // const [currentUser, setCurrentUser] = useState("");
  const [user] = useAuthState(auth);

  const dummy = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (channel) {
      const q = query(
        collection(
          firestore,
          `servers/${server}/textChannels/${channel.id}/messages`
        ),
        orderBy("createdAt")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let msgs: any[] = [];
        querySnapshot.forEach((doc) => {
          msgs.push({ ...doc.data(), id: doc.id });
        });
        setMessages(msgs);
        dummy.current?.scrollIntoView({ behavior: "smooth" });
      });

      return () => unsubscribe();
    }
  }, [channel]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    setNewMessage("");
    await addDoc(
      collection(
        firestore,
        `servers/${server}/textChannels/${channel.id}/messages`
      ),
      {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid: user?.uid,
      }
    );

    dummy.current?.scrollIntoView({ behavior: "smooth" });
  };

  let currentUser;
  const checkBefore = (user: string) => {
    if (user === currentUser) {
      currentUser = user;
      return false;
    }
    currentUser = user;
    return true;
  };

  return (
    <div className="overflow-auto w-full flex-grow flex flex-col h-full justify-between">
      <div className="chat-messages flex flex-col space-y-2 mb-4 h-full overflow-auto">
        <div className="p-2 border-b-2 border-[#202124] flex justify-between items-center bg-background">
          # {channel?.name}
        </div>
        <div className="flex flex-col gap-2 px-2 pb-2 ">
          {messages.map((msg) =>
            checkBefore(msg.uid) ? (
              <div
                key={msg.id}
                className="flex items-center space-x-2 mt-2 hover:bg-secondary/60"
              >
                <Avatar className="">
                  <AvatarImage
                    src={members[msg.uid]?.profilePicture}
                    alt={members[msg.uid]?.displayname}
                  />
                  <AvatarFallback>
                    {members[msg.uid].displayname?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-destructive">
                  <p className="font-bold">{members[msg.uid]?.displayname}</p>
                  <div className="text-gray-300">{msg?.text}</div>
                </div>
              </div>
            ) : (
              <div
                className="text-gray-300 pl-14 hover:bg-secondary/60"
                key={msg.id}
              >
                {msg?.text}
              </div>
            )
          )}
          <div ref={dummy}></div>
        </div>
      </div>
      <form onSubmit={sendMessage} className="flex space-x-2 mb-2 p-2 w-full">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 rounded text-white hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ServerChat;
