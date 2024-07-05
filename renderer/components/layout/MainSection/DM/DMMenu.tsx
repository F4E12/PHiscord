import React from "react";
import OnlineFriends from "./OnlineFriend";
import AllFriends from "./AllFriend";
import PendingRequests from "./PendingRequest";
import BlockedFriends from "./BlockedFriend";
import AddFriendForm from "./AddFriend";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DMMenuProps {
  setSelectedFriend: (friend: any | null) => void;
}

const DMMenu = ({ setSelectedFriend }: DMMenuProps) => {
  return (
    <div className="p-4">
      <Tabs defaultValue="online">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="online">Online</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
          <TabsTrigger value="add-friend">Add Friend</TabsTrigger>
        </TabsList>
        <TabsContent value="online">
          <OnlineFriends setSelectedFriend={setSelectedFriend} />
        </TabsContent>
        <TabsContent value="all">
          <AllFriends setSelectedFriend={setSelectedFriend} />
        </TabsContent>
        <TabsContent value="pending">
          <PendingRequests />
        </TabsContent>
        <TabsContent value="blocked">
          <BlockedFriends />
        </TabsContent>
        <TabsContent value="add-friend">
          <AddFriendForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DMMenu;
