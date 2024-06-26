import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ServerMembersProps {
  members: { [key: string]: any };
}

const ServerMembers = ({ members }: ServerMembersProps) => {
  return (
    <div className="p-4 bg-secondary rounded-md">
      <h2 className="text-xl text-white mb-4">Server Members</h2>
      <div className="space-y-2">
        {Object.keys(members).map((memberId) => {
          const member = members[memberId];
          return (
            <div key={member.id} className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={member.profilePicture || "/default-profile.png"}
                  alt={member.displayname || "User"}
                />
                <AvatarFallback>
                  {member.displayname?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-white font-bold">
                  {member.displayname || "Unknown"}
                </div>
                <div className="text-gray-400 text-sm">@{member.username}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServerMembers;
