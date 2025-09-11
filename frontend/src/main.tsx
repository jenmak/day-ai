import "./main.css"

import { QueryClientProvider } from "@tanstack/react-query"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { App } from "../app/App"
import { TooltipProvider } from "./components/ui/tooltip"
import { queryClient } from "./lib/trpc"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <App />
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
)
