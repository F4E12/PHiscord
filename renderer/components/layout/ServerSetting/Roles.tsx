import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import {
  getServerDetails,
  getTextChannels,
  getVoiceChannels,
} from "@/lib/retrieveserver";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

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
import { auth, firestore } from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";

interface RolesProps {
  serverId: any;
  members: any;
}

function Roles({ serverId, members }: RolesProps) {
  const [loading, setLoading] = useState(true);
  const [serverDetails, setServerDetails] = useState(serverId);
  const [user] = useAuthState(auth);
  const fetchServerDetails = async () => {
    setLoading(true);
    try {
      const data = await getServerDetails(serverId);
      setServerDetails(data);
    } catch (error) {
      console.log("ERROR");
    } finally {
      console.log("fetch Server finish");
      setLoading(false);
    }
  };

  useEffect(() => {
    const channelsDocRef = doc(firestore, "servers", serverId);
    const unsubscribeServer = onSnapshot(channelsDocRef, (snapshot) => {
      fetchServerDetails();
    });

    return () => unsubscribeServer();
  }, [serverId]);

  // console.log(serverDetails?.members);
  // console.log(serverDetails?.ownerId);
  // console.log(serverDetails?.admin);
  // console.log(serverDetails);
  console.log(members);

  const handleChangeRole = async (serverId, userId, newRole) => {
    try {
      const serverRef = doc(firestore, "servers", serverId);

      if (newRole === "admin") {
        // Add to adminList
        await updateDoc(serverRef, {
          admin: arrayUnion(userId),
        });
      } else if (newRole === "member") {
        // Remove from adminList
        await updateDoc(serverRef, {
          admin: arrayRemove(userId),
        });
      }
      console.log("Role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const checkCurrRoles = (memberId) => {
    console.log(memberId);
    if (memberId == serverDetails.ownerId) {
      return "owner";
    } else if (serverDetails.admin && serverDetails.admin.includes(memberId)) {
      return "admin";
    } else {
      return "member";
    }
  };

  return (
    <div className="w-full min-h-screen bg-primary-foreground text-gray-100">
      {user.uid === serverDetails.ownerId ? (
        <div className="py-10">
          <h1 className="text-3xl font-bold text-center mb-8">
            Set User Roles
          </h1>
          <div className="max-w-4xl mx-auto bg-secondary shadow-2xl rounded-lg overflow-hidden">
            {Object.keys(members).map(
              (memberId) =>
                checkCurrRoles(memberId) !== "owner" && (
                  <div
                    key={members[memberId].id}
                    className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={
                            members[memberId].profilePicture ||
                            "/default-profile.png"
                          }
                          alt={members[memberId].displayname || "User"}
                        />
                        <AvatarFallback>
                          {members[memberId].displayname?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-lg font-semibold">
                          {members[memberId].displayname || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-400">
                          @{members[memberId].username}
                        </div>
                      </div>
                    </div>
                    <select
                      className="bg-background text-white rounded-lg p-2 cursor-pointer hover:bg-background/80 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-200"
                      onChange={(e) =>
                        handleChangeRole(serverId, memberId, e.target.value)
                      }
                      value={checkCurrRoles(memberId)}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <div className="text-center p-4 max-w-md mx-auto bg-destructive rounded-lg shadow-md">
            <h1 className="text-xl font-semibold mb-3">Access Denied</h1>
            <p className="font-medium">
              You don't have permission to set user roles.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
export default Roles;
