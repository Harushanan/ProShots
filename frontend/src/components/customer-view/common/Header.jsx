import { assets } from "@/assets/assets";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import userprofile from '../../../assets/userimge.png'
import Logout from "@/components/auth-view/Common/Logout";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter 
  } from "@/components/ui/dialog";
import PropTypes from 'prop-types';

 
const ClientHeader = ({ onThemeChange, currentTheme }) => {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const [settingsOpen, setSettingsOpen] = useState(false);
    

    const themes = [
        { name: "Ocean", value: "ocean", previewColor: "bg-blue-300" },
        { name: "Forest", value: "forest", previewColor: "bg-green-200" },
        { name: "Royal", value: "royal", previewColor: "bg-purple-300" },
        { name: "Blossom", value: "blossom", previewColor: "bg-rose-200" },
        { name: "Tropical", value: "tropical", previewColor: "bg-emerald-300" },
        { name: "Golden", value: "golden", previewColor: "bg-amber-200" },
        { name: "Berry", value: "berry", previewColor: "bg-fuchsia-300" },
        { name: "Misty", value: "misty", previewColor: "bg-gray-300" },
        { name: "Sunset", value: "sunset", previewColor: "bg-orange-300" },
        { name: "Midnight", value: "midnight", previewColor: "bg-indigo-300" },
        { name: "Coral", value: "coral", previewColor: "bg-rose-400" },
        { name: "Sapphire", value: "sapphire", previewColor: "bg-blue-400" },
        { name: "Emerald", value: "emerald", previewColor: "bg-emerald-400" },
        { name: "Lavender", value: "lavender", previewColor: "bg-purple-200" },
        { name: "Amber", value: "amber", previewColor: "bg-amber-300" }
      ];
    
       // Remove the interface and add this instead:
  ClientHeader.propTypes = {
    onThemeChange: PropTypes.func.isRequired,
    currentTheme: PropTypes.string.isRequired,
  };

  return (
        <div className="flex items-center justify-around py-5 font-medium bg-white/70 md:bg-transparent h-14 sm:h-28">
            <Link to='/client/home'><img src={assets.logo} alt="Logo" className="w-36" /></Link>
                    
            <ul className="hidden sm:flex gap-5 text-5m text-white">
                <NavLink to='/client/home' className="flex flex-col items-center gap-1">
                    <p className="text-base">HOME</p>
                    <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
                </NavLink>
                <NavLink to='/client/blog' className="flex flex-col items-center gap-1">
                    <p className="text-base">BLOGS</p>
                    <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
                </NavLink>
                <NavLink to='/client/products' className="flex flex-col items-center gap-1">
                    <p className="text-base">PRODUCTS</p>
                    <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
                </NavLink>
                <NavLink to='/client/contact' className="flex flex-col items-center gap-1">
                    <p className="text-base">FEEDBACK</p>
                    <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
                </NavLink>
                <NavLink to='/client/liveChat' className="flex flex-col items-center gap-1">
                    <p className="text-base">LIVECHAT</p>
                    <hr className="w-2/4 border-none bg-gray-700 h-[1.5px] hidden" />
                </NavLink>
            </ul>

            {/* code for right side icon */}
            <div className='flex items-center gap-6'>
                <div className='group relative'>
                    <img src={userprofile} alt="User" className="w-[50px] md:w-[60px] h-[50px] md:[60px] opacity-65" style={{ borderRadius: "50%", border: "3px solid aqua", marginRight: "10px" }} />
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                            <Link to='/client/profile'><p className='cursor-pointer hover:text-black'>Profile</p></Link>
                            <Link to='/client/myBookings'><p className='cursor-pointer hover:text-black'>MyBookings</p></Link>
                            <Link to='/client/my-orders'><p className='cursor-pointer hover:text-black'>My Orders</p></Link>
                            <Logout />
                            <button onClick={() => {setSettingsOpen(true)}}><p className='cursor-pointer hover:text-black text-left'>Settings</p></button>
                        </div>
                    </div>
                </div>
            </div> 

            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogContent className="sm:max-w-md rounded-lg">
                    <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-xl font-semibold">Theme Preferences</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-3">COLOR THEMES</h3>
                        <div className="grid grid-cols-5 gap-3">
                        {themes.map((theme) => (
                            <button
                            key={theme.value}
                            onClick={() => {
                                onThemeChange(theme.value);
                            }}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                                currentTheme === theme.value
                                ? "bg-gray-100 ring-2 ring-primary/50"
                                : "hover:bg-gray-50"
                            }`}
                            >
                            <div className={`w-10 h-10 rounded-full ${theme.previewColor} shadow-md transition-transform ${currentTheme === theme.value ? "scale-110" : "scale-100"}`} />
                            <span className="text-xs font-medium text-gray-700">{theme.name}</span>
                            </button>
                        ))}
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium text-gray-600 mb-3">CURRENT THEME</h3>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-12 h-12 rounded-lg ${themes.find(t => t.value === currentTheme)?.previewColor} shadow-inner`} />
                        <div>
                            <p className="font-medium">{themes.find(t => t.value === currentTheme)?.name} Theme</p>
                            <p className="text-xs text-gray-500">Selected color palette</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    
                    <DialogFooter className="border-t pt-4">
                    <button 
                        onClick={() => setSettingsOpen(false)}
                        className="
                            px-8 py-1 
                            text-lg font-medium 
                            text-gray-200 hover:text-white
                            bg-red-500 hover:bg-red-600 
                            border border-gray-200
                            rounded-lg 
                            shadow-sm hover:shadow
                            transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                            active:bg-gray-100 active:shadow-inner
                        "
                        >
                            Close
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />        {/* only visible to phone*/ }    


            {/* sidebar menu for small screens */}
            <div className={`absolute top-0 right-0 bottom-0 bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col overflow-hidden text-white'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer bg-gray-400'>
                        <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="dropdown" />
                        <p>Back</p>
                    </div>

                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border bg-gray-400' to='/client/home'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border bg-gray-400' to='/client/blog'>BLOG</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border bg-gray-400' to='/client/products'>PRODUCTS</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border bg-gray-400' to='/client/contact'>FEEDBACK</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border bg-gray-400' to='/client/liveChat'>LIVECHAT</NavLink>
                </div>
            </div>
        </div>
  )
}

export default ClientHeader