import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/navbar";
import FilterNewsletter from "@/pages/filter-newsletter";
import FillEmail from "@/pages/fill-email";
import ConnectEmails from "@/pages/connect-emails";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={FilterNewsletter} />
      <Route path="/fill-email" component={FillEmail} />
      <Route path="/connect-emails" component={ConnectEmails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
