import React from "react";
import Icon from "./icon";

let ipc;
if (typeof window !== "undefined") {
  ipc = (window as any).ipc;
}

const TitleBar = () => {
  const handleMinimize = () => {
    if (ipc) {
      ipc.send("minimize-window");
    }
  };

  const handleMaximize = () => {
    if (ipc) {
      ipc.send("maximize-window");
    }
  };

  const handleClose = () => {
    if (ipc) {
      ipc.send("close-window");
      close();
    }
  };
  return (
    <div className="title-bar bg-primary text-foreground flex items-center justify-between p-2 h-6">
      <div className="title-bar__title ml-2">PHiscord</div>
      <div className="title-bar__controls flex">
        <button onClick={handleMinimize} className="title-bar__button">
          <Icon type="minimize" />
        </button>
        <button onClick={handleMaximize} className="title-bar__button">
          <Icon type="maximize" />
        </button>
        <button onClick={handleClose} className="title-bar__button">
          <Icon type="close" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
