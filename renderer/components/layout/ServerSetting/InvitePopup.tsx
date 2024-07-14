import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InvitePopup({ link }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Invite Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-secondary">
        <DialogHeader>
          <DialogTitle>Share Join Link</DialogTitle>
          <DialogDescription>
            Anyone who has this link can join this server
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={link} readOnly />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3 bg-primary"
            onClick={() => copyToClipboard()}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4 text-foreground" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InvitePopup;
