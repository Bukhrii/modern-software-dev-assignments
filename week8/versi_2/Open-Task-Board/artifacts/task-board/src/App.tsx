import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/" component={Home} />
            <Route>
              <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center p-4">
                <h1 className="font-display text-4xl font-extrabold text-foreground mb-2">404</h1>
                <p className="text-muted-foreground">The page you are looking for does not exist.</p>
                <a href="/" className="mt-6 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity">
                  Return Home
                </a>
              </div>
            </Route>
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
