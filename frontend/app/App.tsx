import { Layout } from "@/Layout"
import { Route, Routes } from "react-router"
import { Search } from "./pages/SearchPage"
import { Location } from "./pages/LocationPage"

/**
 * This is the main entry point for the frontend application.
 */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Search />} />
        <Route path="/:normalizedLocation" element={<Location />} />
      </Route>
    </Routes>
  )
}
