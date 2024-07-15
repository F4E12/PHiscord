import React from "react";

const ToggleOverlay = () => {
  const handleToggleOverlay = () => {
    (window as any).ipc?.send("toggle-overlay");
  };

  return (
    <button
      onClick={handleToggleOverlay}
      className="p-2 bg-blue-500 text-foreground rounded-sm"
    >
      Toggle Overlay
    </button>
  );
};

export default ToggleOverlay;
