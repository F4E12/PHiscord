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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ServerDialog = () => {
  const [step, setStep] = useState(0); // 0 for initial choice, 1 for create server, 2 for join server
  const [serverName, setServerName] = useState("");
  const [joinLink, setJoinLink] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreateServer = () => {
    // Logic to create server
    console.log("Creating server with name:", serverName);
    // Reset state and close dialog after creation
    setStep(0);
    setServerName("");
    setOpen(false);
  };

  const handleJoinServer = () => {
    // Logic to join server
    console.log("Joining server with link:", joinLink);
    // Reset state and close dialog after joining
    setStep(0);
    setJoinLink("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full text-green-500 transition-all duration-300 ease-in-out hover:bg-green-500 hover:text-white">
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
                className="bg-form hover:bg-form/75"
              >
                Create Server
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="bg-form hover:bg-form/75"
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
            <DialogFooter>
              <Button
                onClick={handleCreateServer}
                className="bg-form hover:bg-form/75"
              >
                Create Server
              </Button>
              <Button
                onClick={() => setStep(0)}
                className="bg-form hover:bg-form/75"
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
                className="bg-form hover:bg-form/75"
              >
                Join Server
              </Button>
              <Button
                onClick={() => setStep(0)}
                className="bg-form hover:bg-form/75"
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
