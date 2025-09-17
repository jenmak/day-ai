import { Layout } from "@/Layout"
import { Route, Routes } from "react-router"
import { Search } from "./pages/SearchPage"
import { Place } from "./pages/PlacePage"

/**
 * This is the main entry point for the frontend application.
 */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Search />} />
        <Route path="/:slug" element={<Place />} />
      </Route>
    </Routes>
  )
}
