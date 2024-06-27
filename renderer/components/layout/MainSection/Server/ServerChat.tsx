import React, { useEffect, useState, useRef } from "react";
import { firestore, auth } from "@/firebase/firebaseApp";
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
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import Icon from "@/components/ui/icon";

import {
  TooltipTop,
  TooltipTopContent,
  TooltipTopProvider,
  TooltipTopTrigger,
} from "@/components/ui/tooltiptop";

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
import PopOverImage from "./PopOverImage";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ServerChatProps {
  server: any;
  channel: any;
  members: any;
}

const ServerChat = ({ server, channel, members }: ServerChatProps) => {
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
  const [user] = useAuthState(auth);

  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  function previewImage(img) {
    return <div className="absolute bg-black z-100">AAAA</div>;
  }

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileURL("");
    setFileName("");
    setFilePreview("");
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        let filetemp = reader.result.toString();
        const prefix = filetemp.split(",")[0];
        const fileType = prefix.split(":")[1].split("/")[0];
        setFileType(fileType);
      };
      reader.readAsDataURL(file);

      const storage = getStorage();
      const storageRef = ref(
        storage,
        `files/${server}/${channel.id}/${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress, e.g., show a progress bar
        },
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
    const storageRef = ref(
      storage,
      `files/${server}/${channel.id}/${fileName}`
    );
    deleteObject(storageRef);
    setFileURL("");
    setFileName("");
    setFilePreview("");
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" && filePreview === "") return;
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
        fileType,
        fileURL,
        fileName,
      }
    );

    setFileURL("");
    setFileName("");
    setFilePreview("");
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkIsImagePreview = () => {
    if (filePreview && fileType === "image") {
      return true;
    }
    return false;
  };
  const checkIsFilePreview = () => {
    if (filePreview && fileType !== "image") {
      return true;
    }
    return false;
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
        `servers/${server}/textChannels/${channel.id}/messages`,
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
        `servers/${server}/textChannels/${channel.id}/messages`,
        deletingMessage.id
      );
      await deleteDoc(messageRef);
      setDeletingMessage(null);
    }
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
        <div className="flex flex-col gap-2 px-2 pb-2 bg-background overflow-auto">
          {messages.map((msg) =>
            checkBefore(msg.uid) ? (
              <div
                key={msg.id}
                className="relative group flex items-start space-x-2 mt-2 hover:bg-secondary/60 p-1"
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
                  <p className="font-bold">{members[msg.uid]?.displayname}</p>
                  <div className="text-gray-300">{msg?.text}</div>
                  {msg?.text == "laporan" && (
                    <div className="">
                      <a
                        href={msg.fileURL}
                        download={msg.fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        <Icon type="file"></Icon>
                        <div className="text-xs">
                          {truncateString(fileName, 12)}
                        </div>
                      </a>
                    </div>
                  )}
                  {msg?.fileType == "image" && (
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
                          {truncateString(fileName, 12)}
                        </div>
                      </a>
                    </div>
                  )}
                </div>
                <div className="absolute right-2 -top-3 hidden group-hover:flex gap-3 bg-secondary border-primary text-white px-2 py-1 rounded">
                  <TooltipTopProvider>
                    <TooltipTop>
                      <TooltipTopTrigger asChild>
                        <button onClick={() => handleEditMessage(msg)}>
                          <Icon type="pen"></Icon>
                        </button>
                      </TooltipTopTrigger>
                      <TooltipTopContent>Edit</TooltipTopContent>
                    </TooltipTop>
                  </TooltipTopProvider>
                  <TooltipTopProvider>
                    <TooltipTop>
                      <TooltipTopTrigger asChild>
                        <button onClick={() => handleDeleteMessage(msg)}>
                          <Icon type="trash"></Icon>
                        </button>
                      </TooltipTopTrigger>
                      <TooltipTopContent>Delete</TooltipTopContent>
                    </TooltipTop>
                  </TooltipTopProvider>
                </div>
              </div>
            ) : (
              <div
                className="relative group text-gray-300 pl-14 hover:bg-secondary/60"
                key={msg.id}
              >
                {msg?.text}
                {msg?.text == "laporan" && (
                  <div className="">
                    <a
                      href={msg.fileURL}
                      download={msg.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      <Icon type="file"></Icon>
                      <div className="text-xs">
                        {truncateString(msg.fileName, 12)}
                      </div>
                    </a>
                  </div>
                )}
                {msg?.fileType == "image" && (
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
                  <TooltipTopProvider>
                    <TooltipTop>
                      <TooltipTopTrigger asChild>
                        <button onClick={() => handleEditMessage(msg)}>
                          <Icon type="pen"></Icon>
                        </button>
                      </TooltipTopTrigger>
                      <TooltipTopContent>Edit</TooltipTopContent>
                    </TooltipTop>
                  </TooltipTopProvider>
                  <TooltipTopProvider>
                    <TooltipTop>
                      <TooltipTopTrigger asChild>
                        <button onClick={() => handleDeleteMessage(msg)}>
                          <Icon type="trash"></Icon>
                        </button>
                      </TooltipTopTrigger>
                      <TooltipTopContent>Delete</TooltipTopContent>
                    </TooltipTop>
                  </TooltipTopProvider>
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
                setEditingMessage({ ...editingMessage, text: e.target.value })
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
              <TooltipTopProvider>
                <TooltipTop>
                  <TooltipTopTrigger asChild>
                    <button onClick={() => handleDeleteFile()}>
                      <Icon type="trash"></Icon>
                    </button>
                  </TooltipTopTrigger>
                  <TooltipTopContent>Delete</TooltipTopContent>
                </TooltipTop>
              </TooltipTopProvider>
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
              <TooltipTopProvider>
                <TooltipTop>
                  <TooltipTopTrigger asChild>
                    <button onClick={() => handleDeleteFile()}>
                      <Icon type="trash"></Icon>
                    </button>
                  </TooltipTopTrigger>
                  <TooltipTopContent>Delete</TooltipTopContent>
                </TooltipTop>
              </TooltipTopProvider>
            </div>
            <Icon type="file"></Icon>
            <div className="text-xs">{truncateString(fileName, 12)}</div>
          </div>
        </div>
      )}

      <form onSubmit={sendMessage} className="flex space-x-2 mb-2 p-2 w-full">
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <label
          htmlFor="fileInput"
          className="flex items-center justify-center w-10 h-10 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600"
        >
          <Icon type="plus" />
        </label>
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
