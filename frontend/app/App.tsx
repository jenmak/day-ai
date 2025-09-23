import { Route, Routes } from "react-router"
import { Search } from "./pages/SearchPage"
import { Place } from "./pages/PlacePage"
import { ErrorPage } from "./pages/ErrorPage"

/**
 * This is the main entry point for the frontend application.
 */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Search />} />
      <Route path="/:slug" element={<Place />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/unknown" element={<ErrorPage />} />
    </Routes>
  )
}
