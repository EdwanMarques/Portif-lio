import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Página inicial carregada diretamente para melhor performance
import HomePage from "@/pages/HomePage";

// Lazy loading para as páginas menos frequentes
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const SetupPage = lazy(() => import("@/pages/SetupPage"));
const ProjectDetailPage = lazy(() => import("@/pages/ProjectDetailPage"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Componente de fallback durante o carregamento
const PageLoader = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-black">
    <div className="w-full max-w-md space-y-4 p-6">
      <Skeleton className="h-8 w-3/4 bg-gray-800" />
      <Skeleton className="h-32 w-full bg-gray-800" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-gray-800" />
        <Skeleton className="h-4 w-5/6 bg-gray-800" />
        <Skeleton className="h-4 w-4/6 bg-gray-800" />
      </div>
    </div>
  </div>
);

// Wrapper para componentes lazy-loaded
const LazyComponent = ({ Component }: { Component: React.ComponentType<any> }) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/projects/:slug">
        {(params) => (
          <Suspense fallback={<PageLoader />}>
            <ProjectDetailPage slug={params.slug} />
          </Suspense>
        )}
      </Route>
      <Route path="/login">
        {() => <LazyComponent Component={LoginPage} />}
      </Route>
      <Route path="/admin">
        {() => <LazyComponent Component={AdminPage} />}
      </Route>
      <Route path="/setup">
        {() => <LazyComponent Component={SetupPage} />}
      </Route>
      <Route>
        {() => <LazyComponent Component={NotFound} />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Router />
    </div>
  );
}

export default App;
