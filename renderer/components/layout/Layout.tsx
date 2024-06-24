// components/Layout.tsx
import { ReactNode, useState } from "react";
import ServerList from "./ServerList";
import MainContent from "./MainContent";

export default function Layout() {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  return (
    <div className="flex h-screen">
      <ServerList setSelectedServer={setSelectedServer} />
      <MainContent server={selectedServer}></MainContent>
    </div>
  );
}
