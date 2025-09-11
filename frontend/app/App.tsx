import { Layout } from "@/Layout"
import { Route, Routes } from "react-router"

/**
 * This is the main entry point for the frontend application.
 */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      </Route>
    </Routes>
  )
}
