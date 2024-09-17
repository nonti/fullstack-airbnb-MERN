import { Outlet } from "react-router-dom"
import Header from "../Header"

const Layout = () => {
  return (
    <div className="py-4 px-8 flex flex-col gap-2 min-h-screen">
      <Header/>
      <Outlet/>
    </div>
  )
}

export default Layout