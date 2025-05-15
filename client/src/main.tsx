import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/context/auth-context";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="prismon-theme">
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);
