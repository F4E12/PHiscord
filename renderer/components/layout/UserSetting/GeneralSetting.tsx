import { getUserData } from "@/lib/retrieveuser";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateUserData } from "@/lib/updateuserdata";
import { uploadImage } from "@/lib/uploadimage";

const GeneralSettings = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [counter, setCounter] = useState(0);

  const [user, loads, error] = useAuthState(auth);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData(user.uid); // Replace 'userId' with the actual user ID
      setUserData(data);
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCounter(counter + 1);
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCounter(counter + 1);
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        const downloadURL = await uploadImage(file, user.uid);
        setUserData({
          ...userData,
          profilePicture: downloadURL,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        await updateUserData(user.uid, userData);
        console.log("Data saved successfully: ", userData);
        setIsEditing(false);
        setCounter(0);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
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
            src={userData?.profilePicture || "/path-to-your-image.png"} // Replace with actual image path
            alt="User Avatar"
            className="w-20 h-20 rounded-full"
          />
          <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full ring-2 ring-gray-800 bg-green-500"></span>
        </div>
        <div className="ml-4">
          <div className="text-white text-xl font-semibold">
            {userData?.username}
          </div>
          <div className="text-gray-400 text-sm flex items-center">
            <span>#</span>
            <span>1234</span>
          </div>
        </div>
      </div>
      <form className="space-y-4" onSubmit={handleSave}>
        <div>
          <label className="block text-gray-400 mb-2">User Name</label>
          <input
            type="text"
            name="username"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
            placeholder="IWasf4e12"
            value={userData?.username || ""}
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
            value={userData?.displayname || ""}
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
            value={userData?.DOB || ""}
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
