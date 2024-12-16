import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner"
import { router } from "./routes";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { LocationProvider } from "./contexts/LocationContext";
import { ThemeProvider } from "./components/theme/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey="t2r-theme" defaultTheme="light">
        <LocationProvider>
          <Helmet titleTemplate="%s | Talk to Refugee" />
          <Toaster richColors />
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </LocationProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
