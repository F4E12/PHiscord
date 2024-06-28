import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerDetails } from "@/lib/retrieveserver";
import { firestore } from "@/firebase/firebaseApp";
import { doc, onSnapshot } from "firebase/firestore";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";

interface ServerMembersProps {
  members: { [key: string]: any };
  serverId: any;
}

const ServerMembers = ({ members, serverId }: ServerMembersProps) => {
  const [serverDetails, setServerDetails] = useState<any>(null);
  const [owner, setOwner] = useState<string>("");
  const [adminList, setAdminList] = useState<string[]>([]);
  const [memberList, setMemberList] = useState<string[]>([]);

  useEffect(() => {
    const fetchServerDetails = async () => {
      try {
        const data = await getServerDetails(serverId);
        setServerDetails(data);
      } catch (error) {
        console.error("Failed to fetch server details:", error);
      }
    };

    fetchServerDetails();

    const unsubscribe = onSnapshot(
      doc(firestore, "servers", serverId),
      (snapshot) => {
        fetchServerDetails();
      }
    );

    return () => unsubscribe();
  }, [serverId]);

  useEffect(() => {
    if (serverDetails) {
      let newOwner = "";
      let newAdmins = [];
      let newMembers = [];

      Object.entries(members).forEach(([key, member]) => {
        if (member.id === serverDetails.ownerId) {
          newOwner = member.id;
        } else if (
          serverDetails.admin &&
          serverDetails.admin.includes(member.id)
        ) {
          newAdmins.push(member.id);
        } else {
          newMembers.push(member.id);
        }
      });

      setOwner(newOwner);
      setAdminList(newAdmins);
      setMemberList(newMembers);
    }
  }, [serverDetails, members]);

  return (
    <div className="p-4 bg-secondary rounded-md">
      <h2 className="text-xl text-white mb-4">Server Members</h2>
      {owner && (
        <div>
          <h3 className="text-lg text-white">Server Owner</h3>
          <MemberItem member={members[owner]} />
        </div>
      )}
      {adminList.length > 0 && (
        <div>
          <h3 className="text-lg text-white">Server Admins</h3>
          {adminList.map((admin) => (
            <MemberItem key={admin} member={members[admin]} />
          ))}
        </div>
      )}
      {memberList.length > 0 && (
        <div>
          <h3 className="text-lg text-white">Server Members</h3>
          {memberList.map((member) => (
            <MemberItem key={member} member={members[member]} />
          ))}
        </div>
      )}
    </div>
  );
};

const MemberItem = ({ member }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center space-x-2 bg-gray-700 p-2 rounded-md mb-2">
          <Avatar>
            <AvatarImage
              src={member?.profilePicture}
              alt={member?.displayname}
            />
            <AvatarFallback>
              {member.displayname?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-white font-bold">
              {member.displayname || "Unknown"}
            </div>
            <div className="text-gray-400 text-sm">@{member?.username}</div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="left">
        {member.displayname}
        <Button type="submit" className={buttonVariants({ variant: "form" })}>
          Add Friend
        </Button>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default ServerMembers;
