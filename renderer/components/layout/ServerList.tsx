import Avatar from "../../components/ui/avatar";

const ServerList = () => {
  const avatars = Array.from({ length: 20 });
  return (
    <div className="flex flex-col  bg-gray-800 p-2 gap-2 overflow-auto no-scrollbar">
      {/* Server icons go here */}
      <Avatar src="/images/PHiscordLogo.png" />
      <div className="shrink-0 bg-white h-[1px] w-full"></div>
      {avatars.map((_, index) => (
        <Avatar key={index} src="https://github.com/shadcn.png" />
      ))}
      {/* Add more server icons as needed */}
    </div>
  );
};

export default ServerList;
