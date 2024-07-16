import React, { useEffect, useState, useRef, useCallback, use } from "react";
import { firestore, auth, database } from "@/firebase/firebaseApp";
import { ref as databaseRef, onValue, remove } from "firebase/database";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import Icon from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getUserData } from "@/lib/retrieveuser";
import EmojiPicker, { Theme } from "emoji-picker-react";
import CallComponent from "../../Call/CallComponent";

interface DirectMessageProps {
  friendId: string;
}

const DirectMessage = ({ friendId }: DirectMessageProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<any>(null);
  const [deletingMessage, setDeletingMessage] = useState<any>(null);
  const [fileURL, setFileURL] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [members, setMembers] = useState({});
  const [channelId, setChannelId] = useState<string | null>(null);
  const lastCheckedTimeRef = useRef(Date.now());
  const [user] = useAuthState(auth);
  const dummy = useRef<HTMLDivElement>(null);
  const lastUserRef = useRef<string | null>(null);

  useEffect(() => {
    lastUserRef.current = "null";
  }, [friendId]);

  const fetchChannelId = async () => {
    try {
      const userDocRef = doc(
        firestore,
        "users",
        user.uid,
        "directMessage",
        friendId
      );
      const friendDocRef = doc(
        firestore,
        "users",
        friendId,
        "directMessage",
        user.uid
      );

      const userDoc = await getDoc(userDocRef);
      const friendDoc = await getDoc(friendDocRef);

      let channelId = userDoc.exists() ? userDoc.data()?.channelId : null;

      if (!channelId) {
        channelId = friendDoc.exists() ? friendDoc.data()?.channelId : null;
      }
      if (!channelId) {
        const newChannelRef = doc(collection(firestore, "directMessages"));
        channelId = newChannelRef.id;
        await setDoc(newChannelRef, {
          members: [user.uid, friendId],
        });

        await setDoc(
          doc(firestore, "users", user.uid, "directMessage", friendId),
          {
            channelId: channelId,
          }
        );
        await setDoc(
          doc(firestore, "users", friendId, "directMessage", user.uid),
          {
            channelId: channelId,
          }
        );
      }

      setChannelId(channelId);

      const userDetails = await getUserData(user.uid);
      const friendDetails = await getUserData(friendId);
      let memberDetails = [userDetails, friendDetails];
      const lookup = memberDetails.reduce((acc, member) => {
        acc[member.id] = member;
        return acc;
      }, {});
      setMembers(lookup);
    } catch (error) {
      console.error("Error fetching or creating channel ID:", error);
    }
  };

  useEffect(() => {
    if (!user || !friendId) return;
    fetchChannelId();
  }, [user, friendId]);

  useEffect(() => {
    if (!channelId) return;

    const q = query(
      collection(firestore, `directMessages/${channelId}/messages`),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let newMessages = [];
      querySnapshot.forEach((doc) => {
        newMessages.push({ ...doc.data(), id: doc.id });
      });

      newMessages.forEach((message) => {
        if (
          message.createdAt &&
          message.createdAt.toMillis() > lastCheckedTimeRef.current &&
          message.uid !== user?.uid
        ) {
          notify(message);
        }
      });

      if (newMessages.length > 0) {
        lastCheckedTimeRef.current = Date.now();
      }
      lastUserRef.current = "null";
      setMessages(newMessages);
    });
    dummy.current?.scrollIntoView({ behavior: "smooth" });

    return () => unsubscribe();
  }, [channelId, user?.uid]);

  const notify = useCallback(
    (message) => {
      if (Notification.permission === "granted") {
        new Notification(`New message from ${friendId}`, {
          body: message.text,
          icon: "", // Add friend's profile picture URL if available
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(`New message from ${friendId}`, {
              body: message.text,
              icon: "", // Add friend's profile picture URL if available
            });
          }
        });
      }
    },
    [friendId]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileURL("");
    setFileName("");
    setFilePreview("");
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        const prefix = reader.result.toString().split(",")[0];
        const fileType = prefix.split(":")[1].split("/")[0];
        setFileType(fileType);
      };
      reader.readAsDataURL(file);

      const storage = getStorage();
      const storageRef = ref(storage, `files/${channelId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("File upload error:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFileURL(downloadURL);
          setFileName(file.name);
        }
      );
    }
  };

  const handleDeleteFile = async () => {
    const storage = getStorage();
    const storageRef = ref(storage, `files/${channelId}/${fileName}`);
    deleteObject(storageRef);
    setFileURL("");
    setFileName("");
    setFilePreview("");
  };

  const Filter = require("bad-words");
  const filter = new Filter();
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" && filePreview === "") return;
    const filterMsg = filter.clean(newMessage);
    setNewMessage("");
    const messageDocRef = await addDoc(
      collection(firestore, `directMessages/${channelId}/messages`),
      {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid: user?.uid,
        fileType,
        fileURL,
        fileName,
      }
    );

    for (const [memberId, memberInfo] of Object.entries(members)) {
      if (memberId !== user?.uid) {
        try {
          const notificationRef = doc(
            firestore,
            `notifications/${memberId}/messages`,
            messageDocRef.id
          );
          await setDoc(notificationRef, {
            type: "message",
            text: filterMsg,
            fileType,
            fileName,
            channelName: "DM",
            senderName: members[user.uid].displayname,
            profilePicture: members[user.uid].profilePicture,
            createdAt: serverTimestamp(),
          });

          setTimeout(async () => {
            try {
              await deleteDoc(notificationRef);
            } catch (error) {
              console.error("Error removing notification:", error);
            }
          }, 10);
        } catch (error) {
          console.error(
            `Error creating notification for user ${memberId}:`,
            error
          );
        }
      }
    }

    setFileURL("");
    setFileName("");
    setFilePreview("");
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEditMessage = (message: any) => {
    setEditingMessage(message);
  };

  const handleDeleteMessage = (message: any) => {
    setDeletingMessage(message);
  };

  const saveEditMessage = async (newText: string) => {
    if (editingMessage) {
      const messageRef = doc(
        firestore,
        `directMessages/${channelId}/messages`,
        editingMessage.id
      );
      await updateDoc(messageRef, { text: newText });
      setEditingMessage(null);
    }
  };

  const confirmDeleteMessage = async () => {
    if (deletingMessage) {
      const messageRef = doc(
        firestore,
        `directMessages/${channelId}/messages`,
        deletingMessage.id
      );
      await deleteDoc(messageRef);
      setDeletingMessage(null);
    }
  };

  const truncateString = useCallback((str: string, num: number) => {
    return str.length <= num ? str : str.slice(0, num) + "...";
  }, []);

  const checkIsImagePreview = useCallback(() => {
    return filePreview && fileType === "image";
  }, [filePreview, fileType]);

  const checkIsFilePreview = useCallback(() => {
    return filePreview && fileType !== "image";
  }, [filePreview, fileType]);

  const checkBefore = (userId: string) => {
    if (userId === lastUserRef.current) {
      return false;
    }
    lastUserRef.current = userId;
    return true;
  };

  //SEARCHING
  const [searchMsg, setSearchMsg] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (e) => {
    setSearchMsg(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchMsg.trim() === "") return;

    try {
      const messagesRef = collection(
        firestore,
        `directMessages/${channelId}/messages`
      );
      const querySnapshot = await getDocs(messagesRef);
      const results = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.text.toLowerCase().includes(searchMsg.toLowerCase())) {
          results.push({ id: doc.id, ...data });
        }
      });
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching messages:", error);
    }
  };

  //EMOJI
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // CALL
  const [isJoin, setJoin] = useState(false);

  const [token, setToken] = useState("");
  const [appId] = useState("e9f44b3f91fb4ef2815937b4fcc10907");

  const call = async () => {
    setJoin(true);
    try {
      const notificationRef = doc(
        firestore,
        `notifications/${friendId}/messages`,
        channelId
      );
      await setDoc(notificationRef, {
        type: "dm-call",
        senderName: members[user.uid].displayname,
        profilePicture: members[user.uid].profilePicture,
        createdAt: serverTimestamp(),
      });

      setTimeout(async () => {
        try {
          await deleteDoc(notificationRef);
        } catch (error) {
          console.error("Error removing notification:", error);
        }
      }, 10);
    } catch (error) {
      console.error(`Error creating notification for user ${friendId}:`, error);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/generate-agora-token?channelId=${channelId}&uid=${user?.uid}`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Error generating token:", error);
      }
    };

    if (user) {
      fetchToken();
    }
  }, [user, channelId, user?.uid]);

  //FONT SIZE
  const [fontSize, setFontSize] = useState("base");
  useEffect(() => {
    const fontSizeRef = databaseRef(
      database,
      `users/${user.uid}/settings/fontSize`
    );

    const unsubscribe = onValue(fontSizeRef, (snapshot) => {
      const value = snapshot.val();
      setFontSize(value);
    });

    return () => {
      unsubscribe();
    };
  }, [user.uid]);

  return (
    <>
      {isJoin ? (
        <div className="">
          <CallComponent
            appId={appId}
            token={token}
            channelId={channelId}
            uid={user.uid}
            username={members[user.uid]?.displayname}
            channelName={`dm-call`}
            server={`dm-call`}
            members={members}
            setJoin={setJoin}
          />
        </div>
      ) : (
        // <div className="flex-grow h-full">
        <div
          className={
            "overflow-auto w-full flex-grow flex flex-col h-full justify-between text-" +
            fontSize
          }
        >
          <div className="chat-messages flex flex-col space-y-2 mb-4 h-full overflow-auto">
            <div className="p-2 border-b-2 border-[#202124] flex justify-between items-center bg-background">
              {members[friendId]?.displayname}
              <span onClick={() => call()} className="hover:cursor-pointer">
                <Icon type="call" />
              </span>
              <span>
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-primary rounded px-1"
                >
                  <input
                    type="text"
                    value={searchMsg}
                    onChange={handleSearchChange}
                    placeholder="Search"
                    className="bg-primary rounded text-foreground placeholder-foreground/70 focus:outline-none"
                  />
                  <button type="submit" className="text-foreground ml-2">
                    <Icon type="search"></Icon>
                  </button>
                </form>
              </span>

              {searchResults && searchMsg && (
                <div className="z-20 fixed top-12 right-2 bg-secondary max-h-64 overflow-auto p-2">
                  {searchResults.map((message) => (
                    <div className="flex items-start space-x-4 p-2 bg-primary text-secondary-foreground rounded-lg max-w-md mx-auto mt-2 hover:bg-background hover:cursor-pointer">
                      <Avatar className="">
                        <AvatarImage
                          src={members[message.uid]?.profilePicture}
                          alt={members[message.uid]?.displayname}
                        />
                        <AvatarFallback>
                          {members[message.uid]?.displayname?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-destructive">
                            {members[message.uid]?.displayname}
                          </span>
                          <span className="text-sm text-foreground">
                            {message.createdAt
                              .toDate()
                              .toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-muted-foreground rounded-lg">
                            {message.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 px-2 pb-2 bg-background overflow-auto">
              {messages.map((msg) =>
                checkBefore(msg.uid) ? (
                  <div
                    key={msg.id}
                    className="relative group flex items-start space-x-2 mt-2 hover:bg-secondary/60"
                  >
                    <Avatar className="">
                      <AvatarImage
                        src={members[msg.uid]?.profilePicture}
                        alt={members[msg.uid]?.displayname}
                      />
                      <AvatarFallback>
                        {members[msg.uid]?.displayname?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-destructive">
                      <p className="font-bold">
                        {members[msg.uid]?.displayname}
                      </p>
                      <div className="text-foreground">{msg?.text}</div>
                      {msg.fileType === "image" && (
                        <div className="">
                          <Dialog>
                            <DialogTrigger>
                              <img
                                src={msg.fileURL}
                                alt="File Preview"
                                className="max-w-full h-auto w-24"
                              />
                            </DialogTrigger>
                            <DialogContent className="w-1/4">
                              <img src={msg.fileURL} alt="" className="" />
                            </DialogContent>
                          </Dialog>
                          <a
                            href={msg.fileURL}
                            download={msg.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            <div className="text-xs">
                              {truncateString(msg.fileName, 12)}
                            </div>
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="absolute right-2 -top-3 hidden group-hover:flex gap-3 bg-secondary border-primary text-white px-2 py-1 rounded">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => handleEditMessage(msg)}>
                              <Icon type="pen" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => handleDeleteMessage(msg)}>
                              <Icon type="trash" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ) : (
                  <div
                    className="relative group text-foreground pl-14 hover:bg-secondary/60"
                    key={msg.id}
                  >
                    {msg.text}
                    {msg.fileType === "image" && (
                      <div className="">
                        <Dialog>
                          <DialogTrigger>
                            <img
                              src={msg.fileURL}
                              alt="File Preview"
                              className="max-w-full h-auto w-24"
                            />
                          </DialogTrigger>
                          <DialogContent className="w-1/4">
                            <img src={msg.fileURL} alt="" className="" />
                          </DialogContent>
                        </Dialog>
                        <a
                          href={msg.fileURL}
                          download={msg.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          <div className="text-xs">
                            {truncateString(msg.fileName, 12)}
                          </div>
                        </a>
                      </div>
                    )}
                    <div className="absolute right-2 -top-3 hidden group-hover:flex gap-3 bg-secondary border-primary text-white px-2 py-1 rounded">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => handleEditMessage(msg)}>
                              <Icon type="pen" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => handleDeleteMessage(msg)}>
                              <Icon type="trash" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                )
              )}
              <div ref={dummy}></div>
            </div>
          </div>

          <Popover
            open={!!editingMessage}
            onOpenChange={() => setEditingMessage(null)}
          >
            <PopoverTrigger asChild>
              <div></div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div>
                <Input
                  value={editingMessage?.text || ""}
                  onChange={(e) =>
                    setEditingMessage({
                      ...editingMessage,
                      text: e.target.value,
                    })
                  }
                  placeholder="Edit message"
                  className="mb-4"
                />
                <Button
                  onClick={() => saveEditMessage(editingMessage?.text)}
                  className="w-full"
                >
                  Save
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover
            open={!!deletingMessage}
            onOpenChange={() => setDeletingMessage(null)}
          >
            <PopoverTrigger asChild>
              <div></div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div>
                <p>Are you sure you want to delete this message?</p>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => setDeletingMessage(null)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDeleteMessage}>
                    Delete
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {checkIsImagePreview() && (
            <div className="p-2 rounded bg-secondary">
              <div className="w-24 bg-primary p-2">
                <div className="relative flex justify-center mb-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => handleDeleteFile()}>
                          <Icon type="trash" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <img
                  src={filePreview as string}
                  alt="File Preview"
                  className="max-w-full h-auto w-24"
                />
                <div className="text-xs">{truncateString(fileName, 12)}</div>
              </div>
            </div>
          )}
          {checkIsFilePreview() && (
            <div className="p-2 rounded bg-secondary">
              <div className="w-24 bg-primary p-2 flex flex-col justify-center">
                <div className="relative mb-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => handleDeleteFile()}>
                          <Icon type="trash" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Icon type="file" />
                <div className="text-xs">{truncateString(fileName, 12)}</div>
              </div>
            </div>
          )}

          <form
            onSubmit={sendMessage}
            className="flex space-x-2 mb-2 p-2 w-full"
          >
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInput"
              className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded cursor-pointer hover:bg-gray-600"
            >
              <Icon type="plus" />
            </label>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 rounded bg-primary text-white"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 rounded text-white hover:bg-blue-700"
            >
              Send
            </button>
            <button
              type="button"
              className="emoji-picker-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😊
            </button>
          </form>
          {showEmojiPicker && (
            <div className="emoji-picker absolute right-0 bottom-16">
              <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.DARK} />
            </div>
          )}
        </div>
        // </div>
      )}
    </>
  );
};

export default DirectMessage;
