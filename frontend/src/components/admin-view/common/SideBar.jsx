import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { assets } from "@/assets/assets";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


// Optional: React Icons for modern icons
import { FaBars, FaImages, FaUsers, FaCalendarCheck, FaBlog, FaBoxOpen, FaClipboardList, FaTruck, FaComments, FaBox, FaPaperPlane } from "react-icons/fa";

const SideBar = ({ isOpen, setIsOpen }) => {
  const [visibleGallery, setVisibleGallery] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => { 
    if (!isOpen) {
      setVisibleGallery(false);
    }
  }, [isOpen]);

  const commands = [
    {
        command: 'open Content Management',
        callback: () => {
          setVisibleGallery(!visibleGallery);
        },
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.8
    },
    {
      command: 'close Content Management',
      callback: () => {
        setVisibleGallery(!visibleGallery);
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.8
  },
  ]

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ commands });
      

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          className="cursor-pointer absolute top-4 left-3 z-50"
          onClick={() => setIsOpen(true)}
        >
          <img src={assets.admin_menu_icon} alt="menu" className="h-[45px]" />
        </SheetTrigger>

        <SheetContent side="left" className="w-[350px] bg-black border-r-4 shadow-xl p-4 overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-4 mb-6">
              <img src="/bgHead.png" alt="logo" className="w-20 bg-white rounded-lg h-auto" />
              <span className="text-3xl font-bold text-white">ProShots</span>
            </div>
            <SheetTitle className="text-[26px] text-center text-white font-semibold ps-2 border-b-4 border-gray-500">ADMIN  DASHBOARD</SheetTitle>
          </SheetHeader>

          {/* Content Management */}
          <div
            className="flex items-center justify-between hover:bg-blue-600 px-4 py-2 rounded-md cursor-pointer mt-4 transition"
            onClick={() => setVisibleGallery(!visibleGallery)}
          >
            <div className="flex items-center gap-3">
              <FaImages className="text-xl text-white" />
              <span className="text-lg font-medium text-white">Content Management</span>
            </div>
            <img
              src={assets.adminDropdown}
              alt=""
              className={`w-7 h-auto rounded-lg transition-transform duration-300 ${visibleGallery ? "rotate-0" : "-rotate-90"}`}
            />
          </div>

          {visibleGallery && (
            <nav className="ml-8 mt-2 flex flex-col gap-2 text-white">
              <Link
                to="/admin/gallery"
                className="py-1 px-2 rounded hover:bg-blue-400 transition"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-base">↳ Slider</span>
              </Link>
              <Link
                to="/admin/uploadPage"
                className="py-1 px-2 rounded hover:bg-blue-400 transition"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-base">↳ Upload Photos</span>
              </Link>
            </nav>
          )}

          {/* Sidebar Links */}
          <div className="mt-2 flex flex-col gap-3 text-white px-2">

            <SidebarItem icon={<FaUsers />} text="User Management" to="/admin/dashboard" setIsOpen={setIsOpen} />
            <SidebarItem icon={<FaCalendarCheck />} text="Bookings Management" to="/admin/EventBookings" setIsOpen={setIsOpen} />
            <SidebarItem icon={<FaBlog />} text="Blog Management" to="/admin/oldEventUpload" setIsOpen={setIsOpen} />
            <SidebarItem icon={<FaBox />} text="Package Management" to="/admin/newPackages" setIsOpen={setIsOpen} />
            <SidebarItem icon={<FaBoxOpen />} text="Inventory Management" to="/admin/create-product" setIsOpen={setIsOpen} />
            <SidebarItem icon={<FaClipboardList />} text="Order Management" to="/admin/placedOrders" setIsOpen={setIsOpen} />
            <SidebarItem icon={<FaTruck />} text="Delivery Management" to="/admin/delivery" setIsOpen={setIsOpen} />
            <SidebarItem icon={<FaComments />} text="Feedback Management" to="/admin/feedback" setIsOpen={setIsOpen} />
            <SidebarItem icon={<FaPaperPlane />} text="Livechat Management" to="/admin/liveChat" setIsOpen={setIsOpen} />

          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const SidebarItem = ({ icon, text, to, setIsOpen }) => (
  <Link
    to={to}
    onClick={() => setIsOpen(false)}
    className="flex items-center gap-3 py-2 px-3 rounded hover:bg-blue-600 transition"
  >
    <span className="text-lg text-white">{icon}</span>
    <span className="text-lg font-medium">{text}</span>
  </Link>
);

export default SideBar;
