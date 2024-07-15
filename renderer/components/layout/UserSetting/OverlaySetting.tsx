import ToggleOverlay from "@/components/ui/toggleoverlay";

export const OverlaySetting = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-5">
        <div className="text-3xl text-foreground">Overlay Setting</div>
        <ToggleOverlay></ToggleOverlay>
        <div className=""></div>
      </div>
    </>
  );
};

export default OverlaySetting;
