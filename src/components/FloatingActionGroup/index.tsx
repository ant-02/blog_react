import { Button } from "@/components/ui/button";
import { ArrowUp, LucideIcon } from "lucide-react";

interface FloatingAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

interface FloatingActionGroupProps {
  actions: FloatingAction[];
  showBackTop?: boolean;
}

export const FloatingActionGroup: React.FC<FloatingActionGroupProps> = ({
  actions,
  showBackTop = false,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Button
            key={index}
            size="icon"
            variant={action.variant ?? "secondary"}
            title={action.label}
            onClick={action.onClick}
            className="rounded-full shadow-md"
          >
            <Icon className="h-5 w-5" />
          </Button>
        );
      })}
      {showBackTop && (
        <Button
          size="icon"
          variant="outline"
          title="返回顶部"
          onClick={scrollToTop}
          className="rounded-full shadow-md"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
