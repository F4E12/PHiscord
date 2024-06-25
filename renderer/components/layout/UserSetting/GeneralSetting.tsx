import { getUserData } from "@/lib/retrieveuser";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateUserData } from "@/lib/updateuserdata";
import { uploadImage } from "@/lib/uploadimage";

const GeneralSettings = ({ userData, onProfileUpdate, onImageChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [counter, setCounter] = useState(0);
  const [localData, setLocalData] = useState(userData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      const downloadURL = await uploadImage(selectedFile, userData.uid);
      const updatedData = {
        ...localData,
        profilePicture: downloadURL,
      };
      onProfileUpdate(updatedData);
      onImageChange(downloadURL);
      console.log(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-md shadow-md w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-white font-semibold">General Settings</h2>
        <button
          onClick={handleEditClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isEditing ? "Save" : "Edit User Profile"}
        </button>
      </div>
      <div className="flex items-center mb-6">
        <div className="relative">
          <img
            src={localData?.profilePicture || "/path-to-your-image.png"} // Replace with actual image path
            alt="User Avatar"
            className="w-20 h-20 rounded-full"
          />
          <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full ring-2 ring-gray-800 bg-green-500"></span>
        </div>
        <div className="ml-4">
          <div className="text-white text-xl font-semibold">
            {localData?.username}
          </div>
          <div className="text-gray-400 text-sm flex items-center">
            <span>#</span>
            <span>1234</span>
          </div>
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-400 mb-2">User Name</label>
          <input
            type="text"
            name="username"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
            placeholder="IWasf4e12"
            value={localData?.username || ""}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Display Name</label>
          <input
            type="text"
            name="displayname"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
            placeholder="Your display name"
            value={localData?.displayname || ""}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Date of Birth</label>
          <input
            type="date"
            name="DOB"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
            value={localData?.DOB || ""}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
            onChange={handleFileChange}
            disabled={!isEditing}
          />
        </div>
        {counter > 0 && (
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
};

export default GeneralSettings;
