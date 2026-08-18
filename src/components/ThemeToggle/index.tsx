import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  type ThemePreference,
  applyThemePreference,
  getStoredPreference,
  savePreference,
} from "../../lib/theme";

const options: { value: ThemePreference; label: string; icon: React.ElementType }[] = [
  { value: "light", label: "白天", icon: Sun },
  { value: "dark", label: "夜间", icon: Moon },
  { value: "auto", label: "自动", icon: Monitor },
];

export const ThemeToggle: React.FC = () => {
  const { setTheme } = useTheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("auto");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = getStoredPreference();
    setPreferenceState(saved);
    applyThemePreference(saved, setTheme);
  }, [setTheme]);

  const setPreference = (next: ThemePreference) => {
    savePreference(next);
    setPreferenceState(next);
    applyThemePreference(next, setTheme);
    setOpen(false);
  };

  const activeOption = options.find((o) => o.value === preference) ?? options[2];
  const ActiveIcon = activeOption.icon;

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="主题" disabled>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
        <ActiveIcon className="h-5 w-5" />
        <span className="sr-only">切换主题</span>
      </PopoverTrigger>
      <PopoverContent className="w-32 p-1" align="end" side="bottom">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = preference === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setPreference(option.value)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {option.label}
              </span>
              {isActive && <Check className="h-4 w-4" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};

export default ThemeToggle;
