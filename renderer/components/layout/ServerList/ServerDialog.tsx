import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Ensure you have the correct import for your dialog components
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { firestore, auth } from "../../../firebase/firebaseApp"; // Adjust the import path as needed
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { joinServer } from "@/lib/joinserver";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { uploadImage } from "@/lib/uploadimage";
import { profile } from "console";

interface CreateServerPopupProps {
  // onServerUpdated: () => void;
}
const ServerDialog = ({
  user,
  // onServerUpdated
}) => {
  const [step, setStep] = useState(0); // 0 for initial choice, 1 for create server, 2 for join server
  const [serverName, setServerName] = useState("");
  const [joinLink, setJoinLink] = useState("");
  const [open, setOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleCreateServer = async () => {
    // Logic to create server
    if (!serverName) return;

    try {
      // Create server document in Firestore
      const serverRef = await addDoc(collection(firestore, "servers"), {
        name: serverName,
        ownerId: user?.id,
        members: [user?.id],
        createdAt: new Date(),
      });

      const serverId = serverRef.id;
      const downloadURL = await uploadImage(selectedFile, serverId);

      await updateDoc(doc(firestore, "servers", serverId), {
        profilePicture: downloadURL,
      });

      await addDoc(collection(firestore, `servers/${serverId}/textChannels`), {
        name: "General",
        createdAt: new Date(),
      });

      await addDoc(collection(firestore, `servers/${serverId}/voiceChannels`), {
        name: "General",
        createdAt: new Date(),
      });

      // Add server reference to user's serverList
      const userRef = doc(firestore, "users", user?.id);
      await updateDoc(userRef, {
        serverList: arrayUnion(serverRef.id),
      });

      // Reset state and close dialog after creation
      setStep(0);
      setServerName("");
      // onServerUpdated();
      setOpen(false);
    } catch (error) {
      console.error("Error creating server:", error);
    }
    setStep(0);
    setServerName("");
    setOpen(false);
  };
  const handleJoinServer = async () => {
    if (!joinLink) return;

    try {
      await joinServer(joinLink, user);
      setStep(0);
      setJoinLink("");
      setOpen(false);
      // onServerUpdated();
    } catch (error) {
      setStep(0);
      setJoinLink("");
      setOpen(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilePreview("");
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      console.log("IMAGES", URL.createObjectURL(file));
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full text-form transition-all duration-300 ease-in-out hover:bg-foreground hover:text-foreground">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {step === 0 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Create or Join Server
              </DialogTitle>
              <DialogDescription className="text-foreground">
                Choose an option to create a new server or join an existing one.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button
                onClick={() => setStep(1)}
                className={buttonVariants({ variant: "form" })}
              >
                Create Server
              </Button>
              <Button
                onClick={() => setStep(2)}
                className={buttonVariants({ variant: "form" })}
              >
                Join Server
              </Button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Create Server
              </DialogTitle>
              <DialogDescription className="text-foreground">
                Enter a name for your new server and click "Create".
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serverName" className="text-right">
                  Server Name
                </Label>
                <Input
                  id="serverName"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage
                  src={
                    (filePreview as string) || "https://github.com/shadcn.png"
                  }
                  alt="@shadcn"
                />
                {/* <AvatarFallback>{server?.charAt(0)}</AvatarFallback> */}
              </Avatar>
              <input
                type="file"
                name="profilePicture"
                className="w-full px-4 py-2 bg-background text-foreground rounded focus:outline-none"
                onChange={handleFileChange}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateServer}
                className="bg-form hover:bg-form/75 text-foreground"
              >
                Create Server
              </Button>
              <Button
                onClick={() => setStep(0)}
                className={buttonVariants({ variant: "form" })}
              >
                Back
              </Button>
            </DialogFooter>
          </>
        )}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground">Join Server</DialogTitle>
              <DialogDescription className="text-foreground">
                Enter the join link for the server you want to join and click
                "Join".
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="joinLink" className="text-right">
                  Join Link
                </Label>
                <Input
                  id="joinLink"
                  value={joinLink}
                  onChange={(e) => setJoinLink(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleJoinServer}
                className={buttonVariants({ variant: "form" })}
              >
                Join Server
              </Button>
              <Button
                onClick={() => setStep(0)}
                className={buttonVariants({ variant: "form" })}
              >
                Back
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServerDialog;
