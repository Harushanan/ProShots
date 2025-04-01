import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import ClientHeader from "./Header";
import Footer from "./Footer";



const ClientLayout = () => {
  const location = useLocation();
  

  return (
    <div className="overflow-x-hidden">
        { !location.pathname.startsWith('/client/DisplayOldFullEvent/') && 
            <header className="absolute z-10 w-full bg-black/50 backdrop-blur-sm">
            <ClientHeader />
        </header>
        }
        <main className="relative z-1">
            <Outlet />
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
  )
}

export default ClientLayout;