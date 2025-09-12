import { Header } from "../app/components/Header"
import { Outlet } from "react-router"

export function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Outlet />
    </div>
  )
}
