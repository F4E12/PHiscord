import { ModeToggle } from "@/components/mode-toggle";

export const AppearanceSetting = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-5">
      <div className="text-3xl text-foreground">Appearance Setting</div>
      <ModeToggle></ModeToggle>
      <div className=""></div>
    </div>
  );
};

export default AppearanceSetting;
