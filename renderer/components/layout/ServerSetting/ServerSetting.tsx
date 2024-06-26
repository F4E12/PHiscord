interface ServerSettingProps {
  serverName: any;
}

function ServerSetting({ serverName }: ServerSettingProps) {
  let joinLink = "phiscord.join/" + serverName;
  return (
    <div className="bg-primary absolute top-0 left-0 w-full h-full">
      {joinLink}
      ServerSetting
      <button>AAA</button>
    </div>
  );
}

export default ServerSetting;
