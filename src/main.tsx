import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { router } from "./routes/router";
import { Provider } from "react-redux";
import "./index.css";
import store from "./stores";
import Loading from "./components/Loading";
import { Toaster } from "@/components/ui/sonner";
import { getInitialTheme } from "./lib/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme={getInitialTheme()} enableSystem={false}>
      <Provider store={store}>
        <Suspense fallback={<Loading />}>
          <RouterProvider router={router} />
          <Toaster />
        </Suspense>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
