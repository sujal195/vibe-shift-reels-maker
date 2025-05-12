
import { useState } from 'react';

interface ColorPickerProps {
  onColorChange: (color: string) => void;
  defaultColor: string;
}

export const ColorPicker = ({ onColorChange, defaultColor }: ColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
  
  const colors = [
    "bg-red-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-rose-500",
  ];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={`w-8 h-8 rounded-full ${color} ${
            selectedColor === color 
              ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' 
              : ''
          }`}
          onClick={() => handleColorChange(color)}
          aria-label={`Select ${color} color`}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
