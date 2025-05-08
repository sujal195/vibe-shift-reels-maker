
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Lock, Users } from "lucide-react";

export type PostPrivacy = "public" | "friends" | "private";

export interface PrivacySelectorProps {
  privacy: PostPrivacy;
  onPrivacyChange: (value: PostPrivacy) => void;
  disabled?: boolean; // Added disabled prop
}

const PrivacySelector = ({ privacy, onPrivacyChange, disabled = false }: PrivacySelectorProps) => {
  const getPrivacyIcon = () => {
    switch (privacy) {
      case "public":
        return <Globe className="h-4 w-4 mr-2" />;
      case "friends":
        return <Users className="h-4 w-4 mr-2" />;
      case "private":
        return <Lock className="h-4 w-4 mr-2" />;
    }
  };

  const getPrivacyText = () => {
    switch (privacy) {
      case "public":
        return "Public";
      case "friends":
        return "Friends";
      case "private":
        return "Private";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          {getPrivacyIcon()}
          {getPrivacyText()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => onPrivacyChange("public")}
          className="flex items-center"
        >
          <Globe className="h-4 w-4 mr-2" />
          Public
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onPrivacyChange("friends")}
          className="flex items-center"
        >
          <Users className="h-4 w-4 mr-2" />
          Friends
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onPrivacyChange("private")}
          className="flex items-center"
        >
          <Lock className="h-4 w-4 mr-2" />
          Private
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PrivacySelector;
