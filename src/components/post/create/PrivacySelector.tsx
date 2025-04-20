
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type PostPrivacy = "public" | "friends" | "private";

interface PrivacySelectorProps {
  privacy: PostPrivacy;
  onPrivacyChange: (value: PostPrivacy) => void;
}

const PrivacySelector = ({ privacy, onPrivacyChange }: PrivacySelectorProps) => {
  const handlePrivacyChange = (value: string) => {
    onPrivacyChange(value as PostPrivacy);
  };

  return (
    <RadioGroup 
      value={privacy} 
      onValueChange={handlePrivacyChange}
      className="flex items-center gap-2"
    >
      <div className="flex items-center space-x-1">
        <RadioGroupItem value="public" id="public" />
        <Label htmlFor="public" className="text-xs cursor-pointer">Public</Label>
      </div>
      <div className="flex items-center space-x-1">
        <RadioGroupItem value="friends" id="friends" />
        <Label htmlFor="friends" className="text-xs cursor-pointer">Friends</Label>
      </div>
      <div className="flex items-center space-x-1">
        <RadioGroupItem value="private" id="private" />
        <Label htmlFor="private" className="text-xs cursor-pointer">Private</Label>
      </div>
    </RadioGroup>
  );
};

export default PrivacySelector;
