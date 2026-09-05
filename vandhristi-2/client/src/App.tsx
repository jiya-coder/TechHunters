import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import FloatingAssistant from "./components/FloatingAssistant";
import Assistant from "./pages/Assistant";
import Home from "./pages/Home";
import Knowledge from "./pages/Knowledge";
import Maps from "./pages/Maps";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/maps" component={Maps} />
      <Route path="/knowledge" component={Knowledge} />
      <Route path="/assistant" component={Assistant} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [location] = useLocation();
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <div className="page-transition" key={location}>
            <Router />
          </div>
          <FloatingAssistant />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

