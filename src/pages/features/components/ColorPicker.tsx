
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ColorPickerProps {
  onColorChange: (color: string) => void;
  defaultColor?: string;
}

const colors = [
  "bg-slate-500", "bg-gray-500", "bg-zinc-500", "bg-neutral-500", "bg-stone-500",
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500", "bg-lime-500",
  "bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500",
  "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
  "bg-pink-500", "bg-rose-500"
];

export function ColorPicker({ onColorChange, defaultColor = "bg-blue-500" }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full flex justify-between items-center">
          <span>Pick a color</span>
          <div className={`w-5 h-5 rounded-full ${selectedColor}`}></div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full ${color} flex items-center justify-center hover:ring-2 hover:ring-primary`}
              onClick={() => handleColorSelect(color)}
              type="button"
            >
              {selectedColor === color && <Check className="h-4 w-4 text-white" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
