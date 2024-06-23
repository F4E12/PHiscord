// components/Layout.tsx
import { ReactNode } from "react";
import ServerList from "./ServerList";
import MainContent from "./MainContent";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen">
      <ServerList />
      <MainContent>{children}</MainContent>
    </div>
  );
}
