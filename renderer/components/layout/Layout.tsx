// components/Layout.tsx
import { ReactNode, useState } from "react";
import ServerList from "./ServerList";
import MainContent from "./MainContent";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  return (
    <div className="flex h-screen">
      <ServerList setSelectedServer={setSelectedServer} />
      <MainContent server={selectedServer}></MainContent>
    </div>
  );
}
