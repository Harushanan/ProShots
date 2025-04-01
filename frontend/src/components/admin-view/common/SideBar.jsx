import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { assets } from "@/assets/assets";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleEvent, setVisibleEvent] = useState(false);
  const [visibleGallery, setVisibleGallery] = useState(false);
  
  useEffect(() => {
    if (!isOpen) {
      setVisibleEvent(false);
    }
  }, [isOpen]);
  
  return (
    <div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger 
                className="cursor-pointer absolute top-4 left-3"
                onClick={() => setIsOpen(true)}
            >
                <img src={assets.admin_menu_icon} alt="" className="h-[45px]"/>
            </SheetTrigger>
            <SheetContent side="left" className="w-[350px]">
                <SheetHeader>
                <div className="flex items-center mb-7">
                    <img src={assets.adminImg} alt="logo" className="w-16 h-auto" />
                    <span className="text-2xl font-bold">ProShots</span>
                </div>
                    <SheetTitle className="text-4xl"></SheetTitle>
                </SheetHeader>


                {/*  Content Management */}
                    <div className="flex items-center gap-2 hover:bg-gray-100 py-1 hover:cursor-pointer mt-6" onClick={() => setVisibleGallery(!visibleGallery)}>
                        <span className="text-2xl mr-6">Content Management </span>
                        <img src={assets.adminDropdown} alt="" className={`w-6 h-auto transition-transform duration-300 ${visibleGallery ? "rotate-90" : ""}`}/>
                    </div>
                    
                    { visibleGallery ? 
                        <nav className="mt-2 flex flex-col gap-3">
                            <Link to="/admin/gallery" className="text-xl text-black px-4 py-1 hover:bg-gray-200 hover:underline rounded-md" onClick={() => setIsOpen(false)}>
                                <span className="text-2xl font-extrabold">↳ </span> Slider
                            </Link>
                            <Link to="/admin/uploadPage" className="text-xl text-black px-4 py-1 hover:bg-gray-200 rounded-md hover:underline" onClick={() => setIsOpen(false)}>
                                <span className="text-2xl font-extrabold">↳ </span> Upload Photos
                            </Link>
                        </nav> : null 
                    }



                    {/*  User Management */}
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-2 hover:bg-gray-100 mt-6 py-1 hover:cursor-pointer">
                            <span className="text-2xl mr-6">User Management</span>
                        </div>
                    </Link>




                    {/* <Link to="/admin/inventory" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-2 hover:bg-gray-100 mt-6 py-1 hover:cursor-pointer">
                            <span className="text-2xl mr-6">Inventory</span>
                        </div>
                    </Link> */}
                    


                    <Link to="/admin/EventBookings" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-2 hover:bg-gray-100 mt-6 py-1 hover:cursor-pointer">
                            <span className="text-2xl mr-6">Bookings Management</span>
                        </div>
                    </Link>


                    <Link to="/admin/oldEventUpload" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-2 hover:bg-gray-100 mt-6 py-1 hover:cursor-pointer">
                            <span className="text-2xl mr-6">Blog Management</span>
                        </div>
                    </Link>

                
                    <Link to="/admin/create-product" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-2 hover:bg-gray-100 mt-6 py-1 hover:cursor-pointer">
                            <span className="text-2xl mr-6">Inventory Management</span>
                        </div>
                    </Link>


                    <Link to="/admin/placedOrders" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-2 hover:bg-gray-100 mt-6 py-1 hover:cursor-pointer">
                            <span className="text-2xl mr-6">Order Management</span>
                        </div>
                    </Link>
            </SheetContent>
        </Sheet>
    </div>
  );
};

export default SideBar;
