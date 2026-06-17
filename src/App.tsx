import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "./components/layout";
import { Dashboard } from "./pages/dashboard";
import { Carrom } from "./pages/carrom";
import { Chess } from "./pages/chess";
import { Jenga } from "./pages/jenga";
import { Olympics } from "./pages/olympics";
import { Rulebook } from "./pages/rulebook";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/carrom" component={Carrom} />
        <Route path="/chess" component={Chess} />
        <Route path="/jenga" component={Jenga} />
        <Route path="/olympics" component={Olympics} />
        <Route path="/rulebook" component={Rulebook} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
