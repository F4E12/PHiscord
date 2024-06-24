import Icon from "../ui/icon";

function UserInformation() {
  return (
    <div className="w-64 flex items-center justify-between p-2 bg-gray-900 rounded-md max-w-sm fixed bottom-0">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <img
            src="/images/loginbg.svg"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-semibold">IWasf4e12</span>
          <span className="text-gray-400 text-xs">:D</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button className="">
          <Icon type="mic"></Icon>
        </button>
        <button className="">
          <Icon type="headphone"></Icon>
        </button>
        <button className="">
          <Icon type="setting"></Icon>
        </button>
      </div>
    </div>
  );
}

export default UserInformation;
