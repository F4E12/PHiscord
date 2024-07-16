import { ModeToggle } from "@/components/mode-toggle";
import { auth, database } from "@/firebase/firebaseApp";
import useFontSize from "@/lib/usefontsize";
import { getDatabase, ref, set } from "firebase/database";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export const AppearanceSetting = () => {
  const fontSizes = [
    { value: "base", label: "Base" },
    { value: "xl", label: "XL" },
    { value: "sm", label: "SM" },
  ];
  const setFontSize = (userId, fontSize) => {
    const db = getDatabase();
    const fontSizeRef = ref(database, `users/${userId}/settings/fontSize`);
    set(fontSizeRef, fontSize);
  };

  const [user] = useAuthState(auth);

  const [selectedFontSize, setSelectedFontSize] = useState("");
  const fontSize = useFontSize(user.uid);

  const handleUpdateFontSize = () => {
    if (user) {
      setFontSize(user.uid, selectedFontSize);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full gap-5">
      <div className="text-3xl text-foreground">Appearance Setting</div>
      <ModeToggle></ModeToggle>
      <div className=""></div>
      <div>
        <h1 className={`text-${fontSize}`}>Current Font Size: {fontSize}</h1>
        <select
          value={selectedFontSize}
          onChange={(e) => setSelectedFontSize(e.target.value)}
          className="border p-2 rounded"
        >
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdateFontSize}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Update Font Size
        </button>
      </div>
    </div>
  );
};

export default AppearanceSetting;
