import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// 👉 Child Component with scroll + center detection
const PackageScroll = ({ allPackage }) => {
    const containerRef = useRef(null);
    const [centerIndex, setCenterIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    // Auto-scroll to center on load
    useEffect(() => {
        const container = containerRef.current;
        const children = Array.from(container.children);
        const middleChild = children[Math.floor(children.length / 2)];
        if (middleChild) {
            container.scrollTo({
                left: middleChild.offsetLeft - container.offsetWidth / 2 + middleChild.offsetWidth / 2,
                behavior: "smooth",
            });
        }
    }, [allPackage]);

    // Detect center card on scroll
    useEffect(() => {
        const container = containerRef.current;

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
        <div className="flex items-center justify-center py-10 text-center">
            <div className="w-11/12">
            <div
                ref={containerRef}
                className="flex gap-6 px-10 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory scrollbar-hide"
            >
                {allPackage.map((pkg, index) => {
                    const isCenter = index === centerIndex;
                    const scale =
                        index === centerIndex
                            ? "scale-110 z-20"
                            : "scale-90 opacity-80 z-10";
                    const paddingTop = isCenter ? "pt-12" : "pt-6";
                    const cornerRadius = isCenter ? "rounded-xl" : null;


                    return (
                        <div
    key={index}
    className={`
        snap-center 
        transform 
        transition-all duration-500 
        flex-shrink-0 
        min-w-[280px] md:min-w-[300px] lg:min-w-[350px]
        bg-white 
        p-6 
        border border-gray-200 
        shadow-lg hover:shadow-2xl 
        rounded-2xl 
        ${scale} ${paddingTop} ${cornerRadius}
    `}
>
    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2 truncate">
        {pkg.packageHead}
    </h3>

    <p className="text-lg md:text-2xl text-gray-500 italic mb-4 truncate">
        {pkg.packageSubhead}
    </p>

    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
        {pkg.price}
        <span className="ml-1 text-base text-gray-500 font-normal">Rs</span>
    </div>

    <ul className="text-gray-700 space-y-2 mb-6 text-base md:text-lg">
        <li><strong>{pkg.sessionPeriod}</strong> Hour Photoshoot</li>
        <li><strong>{pkg.noOfCameraman}</strong> Cameramen Included</li>
        <li><strong>{pkg.photoCount}</strong> Digital Photos</li>
        <li className="text-sm text-gray-500">{pkg.albumDetails}</li>
    </ul>

    <button
        onClick={() => navigate('/client/faq')}
        className="w-full bg-blue-500 hover:bg-blue-600 transition text-white font-semibold py-2 px-4 rounded-xl"
    >
        INQUIRE NOW
    </button>
</div>

                    );
                })}
            </div>
            </div>
        </div>
    );
};

// 👉 Main Parent Component with Fetch Logic
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
