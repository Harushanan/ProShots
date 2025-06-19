import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

const PackageScroll = ({ allPackage }) => {
    const containerRef = useRef(null);
    const [centerIndex, setCenterIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { currentTheme } = useOutletContext(); // Get current theme from layout

    // Define theme to background color mappings
    const themeBackgrounds = {
        ocean: "from-blue-100 to-blue-100",
        forest: "from-green-100 to-green-100",
        royal: "from-purple-100 to-purple-100",
        blossom: "from-rose-100 to-rose-100",
        tropical: "from-emerald-100 to-emerald-100",
        golden: "from-amber-100 to-amber-100",
        berry: "from-fuchsia-100 to-fuchsia-100",
        misty: "from-gray-100 to-gray-100",
        sunset: "from-orange-100 to-orange-100",
        midnight: "from-indigo-100 to-indigo-100",
        coral: "from-rose-100 to-rose-100",
        sapphire: "from-blue-100 to-blue-100",
        emerald: "from-emerald-100 to-emerald-100",
        lavender: "from-purple-100 to-purple-100",
        amber: "from-amber-100 to-amber-100"
    };

    // Default to ocean theme if currentTheme is not found
    const bgClasses = themeBackgrounds[currentTheme] || themeBackgrounds.ocean;
    const [primaryColor, secondaryColor] = bgClasses.split(' ').map(c => c.split('-')[1]);

    // Auto-scroll to center on load
    useEffect(() => {
        const container = containerRef.current;
        if (container && allPackage.length > 0) {
            const children = Array.from(container.children);
            const middleChild = children[Math.floor(children.length / 2)];
            if (middleChild) {
                container.scrollTo({
                    left: middleChild.offsetLeft - container.offsetWidth / 2 + middleChild.offsetWidth / 2,
                    behavior: "smooth",
                });
            }
        }
    }, [allPackage]);

    // Detect center card on scroll
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const children = Array.from(container.children);
            const center = container.scrollLeft + container.offsetWidth / 2;

            let closestIndex = 0;
            let closestDistance = Infinity;

            children.forEach((child, index) => {
                const boxCenter = child.offsetLeft + child.offsetWidth / 2;
                const distance = Math.abs(center - boxCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            setCenterIndex(closestIndex);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`relative inset-0 py-16 bg-gradient-to-br ${bgClasses}`}>
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Photography Packages</h2>
                <p className="text-lg text-center text-gray-600 max-w-2xl mx-auto mb-12">
                    Choose the perfect package for your special occasion
                </p>

                <div className="relative">
                    {/* Left gradient fade */}
                    <div className={`absolute left-0 top-0 bottom-0 w-24 bg-transparent z-30 pointer-events-none`}></div>
                    
                    {/* Package cards container */}
                    <div
                        ref={containerRef}
                        className="flex gap-8 px-8 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide py-8"
                        style={{ scrollbarWidth: 'none' }} // For Firefox
                    >
                        {allPackage.map((pkg, index) => {
                            const isCenter = index === centerIndex;
                            const scale = isCenter 
                                ? "scale-110 shadow-2xl z-0" 
                                : "scale-95 opacity-90 z-0";
                            const paddingTop = isCenter ? "pt-8" : "pt-6";
                            const borderColor = isCenter ? `border-${primaryColor}-400` : "border-gray-200";

                            return (
                                <div
                                    key={index}
                                    className={`
                                        snap-center 
                                        transform 
                                        transition-all duration-500 ease-in-out
                                        flex-shrink-0 
                                        w-full max-w-xs md:max-w-sm
                                        bg-white 
                                        p-6 
                                        border-2 ${borderColor}
                                        shadow-lg
                                        rounded-2xl
                                        ${scale} ${paddingTop}
                                        hover:shadow-xl
                                    `}
                                >
                                    {/* Package Header */}
                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-extrabold text-gray-800 mb-1">
                                            {pkg.packageHead}
                                        </h3>
                                        <p className={`text-lg text-gray-500 italic`}>
                                            {pkg.packageSubhead}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center mb-6">
                                        <div className={`text-4xl font-bold text-${primaryColor}-600`}>
                                            {pkg.price}
                                            <span className="ml-1 text-lg text-gray-500 font-normal">Rs</span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-8">
                                        <li className="flex items-center">
                                            <svg className={`w-5 h-5 text-${primaryColor}-500 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-gray-600"><strong>{pkg.sessionPeriod}</strong> Hour Photoshoot</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg className={`w-5 h-5 text-${primaryColor}-500 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-gray-600"><strong>{pkg.noOfCameraman}</strong> Cameramen Included</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg className={`w-5 h-5 text-${primaryColor}-500 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-600"><strong>{pkg.photoCount}</strong> Digital Photos</span>
                                        </li>
                                        {pkg.albumDetails && (
                                            <li className="text-sm text-gray-500 italic pt-2 border-t border-gray-100">
                                                {pkg.albumDetails}
                                            </li>
                                        )}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => {navigate('/client/livechat')}}
                                        className={`
                                            w-full 
                                            bg-gradient-to-r from-blue-500 to-blue-600 
                                            hover:from-blue-600 hover:to-blue-700 
                                            text-white 
                                            font-semibold 
                                            py-3 px-6 
                                            rounded-xl
                                            transition-all duration-300
                                            shadow-md hover:shadow-lg
                                            ${isCenter ? 'transform hover:scale-105' : ''}
                                        `}
                                    >
                                        INQUIRE NOW
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right gradient fade */}
                    <div className={`absolute right-0 top-0 bottom-0 w-24 bg-transparent z-30 pointer-events-none`}></div>
                </div>

                {/* Scroll indicator dots */}
                <div className="flex justify-center mt-8 space-x-2">
                    {allPackage.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                const container = containerRef.current;
                                const child = container.children[index];
                                if (child) {
                                    container.scrollTo({
                                        left: child.offsetLeft - container.offsetWidth / 2 + child.offsetWidth / 2,
                                        behavior: "smooth",
                                    });
                                }
                            }}
                            className={`w-3 h-3 rounded-full transition-all ${index === centerIndex ? `bg-blue-500 w-6` : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Packages = () => {
    const [allPackage, setAllPackage] = useState([]);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/getAllPackages', {
                    method: "GET",
                    headers: {
                        "content-type": "application/json"
                    }
                });
                const result = await res.json();
                setAllPackage(result.data);
            } catch (error) {
                console.log("Error fetching packages:", error);
                setAllPackage([]);
            }
        };

        fetchPackage();
    }, []);

    return <PackageScroll allPackage={allPackage} />;
};

export default Packages;