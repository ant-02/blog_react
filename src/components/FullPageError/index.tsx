import { useRouteError } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const FullPageError: React.FC = () => {
  const error = useRouteError();

  const message = error instanceof Error ? error.message : "页面加载失败，请稍后重试";

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-screen">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">出错了</h2>
      <p className="text-muted-foreground mb-6">{message}</p>
      <Button onClick={() => window.location.reload()}>刷新页面</Button>
    </div>
  );
};

export default FullPageError;
