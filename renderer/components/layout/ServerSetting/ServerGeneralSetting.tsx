import { getUserData } from "@/lib/retrieveuser";
import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../../firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateUserData } from "@/lib/updateuserdata";
import { uploadImage } from "@/lib/uploadimage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOutUser } from "@/lib/authentication";
import { doc, onSnapshot } from "firebase/firestore";
import { updateServerData } from "@/lib/updateserverdata";

const GeneralSettings = ({ serverId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [counter, setCounter] = useState(0);
  const [localData, setLocalData] = useState(serverId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [serverDetail, setServerDetail] = useState<any>();

  useEffect(() => {
    const serverRef = doc(firestore, "servers", serverId);

    const unsubscribe = onSnapshot(
      serverRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setServerDetail(data);
          setLocalData(data);
        } else {
          console.log("No such server!");
        }
      },
      (error) => {
        console.error("Error listening to server changes:", error);
      }
    );
    return () => unsubscribe();
  }, [serverId]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setCounter(counter + 1);
    const { name, value } = e.target;
    setLocalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setCounter(counter + 1);
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setLocalData((prevData) => ({
        ...prevData,
        profilePicture: URL.createObjectURL(file),
      }));
    }
  };
  const handleSubmit = async (e) => {
    setCounter(0);
    e.preventDefault();
    console.log("UPDAE");
    try {
      let updatedData = localData;
      let downloadURL;
      if (selectedFile) {
        downloadURL = await uploadImage(selectedFile, serverId);
        updatedData = {
          ...localData,
          profilePicture: downloadURL,
        };
      }
      console.log(updatedData);
      console.log(downloadURL);
      await updateServerData(serverId, updatedData);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-background rounded-md shadow-md w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-foreground font-semibold">
          General Settings
        </h2>
        <button
          onClick={handleEditClick}
          className="px-4 py-2 bg-form text-foreground rounded hover:bg-blue-700"
        >
          {isEditing ? "Save" : "Edit Server Profile"}
        </button>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-center mb-6">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={localData?.profilePicture} />
              <AvatarFallback>
                {(localData?.name || "").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full ring-2 ring-gray-800 bg-green-500"></span>
          </div>
          <div className="ml-6">
            <label className="block text-accent-foreground mb-2">
              Server Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 bg-primary text-foreground rounded focus:outline-none"
              placeholder="Your display name"
              value={localData?.name || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>
        <div>
          <label className="block text-accent-foreground mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            name="profilePicture"
            className="w-full px-4 py-2 bg-primary text-foreground rounded focus:outline-none"
            onChange={handleFileChange}
            disabled={!isEditing}
          />
        </div>
        {counter > 0 && (
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-accent-foreground rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
};

export default GeneralSettings;
