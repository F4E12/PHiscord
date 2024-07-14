import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseApp";

interface CreateChannelPopupProps {
  serverId: string;
}

const CreateChannelPopup = ({ serverId }: CreateChannelPopupProps) => {
  const [channelType, setChannelType] = useState("text");
  const [channelName, setChannelName] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreateChannel = async () => {
    if (!channelName) return;

    try {
      const channelTypeCollection =
        channelType === "text" ? "textChannels" : "voiceChannels";
      await addDoc(
        collection(firestore, `servers/${serverId}/${channelTypeCollection}`),
        {
          name: channelName,
          createdAt: new Date(),
        }
      );

      setChannelName("");
      setChannelType("text");
      setOpen(false);
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-between w-full px-4 py-2 bg-card rounded-md text-foreground hover:bg-card/70 transition duration-200">
          <span>Create Channel</span>
          <span className="flex items-center justify-center w-6 h-6 bg-accent rounded-full text-accent-foreground">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <line
                x1="10"
                y1="5"
                x2="10"
                y2="15"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="5"
                y1="10"
                x2="15"
                y2="10"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Select a channel type and enter a name for your new channel.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup
            value={channelType}
            onValueChange={setChannelType}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 text-primary bg-secondary px-3 pb-3 rounded">
              <RadioGroupItem
                value="text"
                id="text-channel"
                className="border-foreground bg-foreground"
              />
              <Label htmlFor="text-channel">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-lg text-foreground">Text</p>
                    <p className="text-foreground/75 text-sm">
                      Send messages, images, GIFs, emoji, opinions, and puns
                    </p>
                  </div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 text-primary bg-secondary px-3 pb-3 rounded">
              <RadioGroupItem
                value="voice"
                id="voice-channel"
                className="border-foreground bg-foreground"
              />
              <Label htmlFor="voice-channel">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-lg text-foreground">Voice</p>
                    <p className="text-foreground/75 text-sm">
                      Hang out together with voice, video, and screen share
                    </p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="channel-name"
              className="text-right text-foreground"
            >
              Channel Name
            </Label>
            <Input
              id="channel-name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="col-span-3 bg-accent text-accent-foreground"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleCreateChannel}
            className={buttonVariants({ variant: "form" })}
          >
            Create Channel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelPopup;
