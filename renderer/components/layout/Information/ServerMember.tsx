import React, { useEffect, useState } from "react";
import { getServerDetails } from "@/lib/retrieveserver";
import { auth, firestore } from "@/firebase/firebaseApp";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import MemberItem from "./MemberItem";

interface ServerMembersProps {
  members: { [key: string]: any };
  serverId: any;
}

const ServerMembers = ({ members, serverId }: ServerMembersProps) => {
  const [serverDetails, setServerDetails] = useState<any>(null);
  const [owner, setOwner] = useState<string>("");
  const [adminList, setAdminList] = useState<string[]>([]);
  const [memberList, setMemberList] = useState<string[]>([]);
  const [user] = useAuthState(auth);

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
          <MemberItem member={members[owner]} currUser={members[user.uid]} />
        </div>
      )}
      {adminList.length > 0 && (
        <div>
          <h3 className="text-lg text-white">Server Admins</h3>
          {adminList.map((admin) => (
            <MemberItem
              key={admin}
              member={members[admin]}
              currUser={members[user.uid]}
            />
          ))}
        </div>
      )}
      {memberList.length > 0 && (
        <div>
          <h3 className="text-lg text-white">Server Members</h3>
          {memberList.map((member) => (
            <MemberItem
              key={member}
              member={members[member]}
              currUser={members[user.uid]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServerMembers;
