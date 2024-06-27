interface PopOverImageProps {
  img: any;
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function PopOverImage({ img }: PopOverImageProps) {
  return (
    <Popover>
      <PopoverContent className="bg-white p-4 shadow-lg rounded-lg">
        <img src={img} alt="Preview" className="max-w-xs w-full h-auto" />
      </PopoverContent>
    </Popover>
  );
}

export default PopOverImage;
