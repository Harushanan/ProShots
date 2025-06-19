import ownerImage from "@/assets/owner.jpg";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from 'prop-types';
import { useOutletContext } from "react-router-dom";

const AboutStudio = ({ currentTheme }) => {

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

  const services = [
    "Portrait & Fashion Photography",
    "Wedding & Event Coverage",
    "Product & Commercial Shoots",
    "Professional Headshots",
    "Gift Items Sale"
  ];

  const contactInfo = [
    { icon: "📍", label: "Location:", text: "Manipai Road, Jaffna" },
    { icon: "📞", label: "Contact:", text: "077-456-9254" },
    { icon: "🌐", label: "FaceBook:", text: "ProShots Photography Studio" }
  ]; 


  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`relative bg-gradient-to-b ${bgClasses} py-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl overflow-hidden rounded-xl shadow-xl`}
        initial={{ opacity: 0, scale: 0.95, zIndex: -1 }}
        animate={{ opacity: 1, scale: 1, zIndex: 0 }}
        exit={{ opacity: 0, scale: 0.95, zIndex: -1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          boxShadow: "0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 25px -5px rgba(0, 0, 0, 0.1)"
        }}
      >

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-start relative z-10">
          {/* Photographer Image */}
          <motion.div 
            className="flex flex-col items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="w-full h-80 md:h-96 bg-cover bg-center rounded-lg shadow-lg"
              style={{ backgroundImage: `url(${ownerImage})` }}
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.p 
              className="text-center text-xl font-semibold text-gray-800 mt-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Atharva (Senior Photographer)
            </motion.p>        
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="space-y-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-gray-800"
              whileHover={{ scale: 1.02 }}
            >
              Capture Timeless Moments with Us!
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 leading-relaxed"
              whileHover={{ scale: 1.01 }}
            >
              Welcome to <span className="font-semibold text-blue-600">ProShots</span>, a professional
              photography studio dedicated to transforming your memories into stunning visual stories.
            </motion.p>

            <motion.div 
              className="mt-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.h2 
                className="text-2xl font-semibold text-gray-800"
                whileHover={{ scale: 1.02 }}
              >
                ✨ Our Services:
              </motion.h2>
              
              <motion.ul 
                className="text-lg text-gray-600 space-y-2"
              >
                {services.map((service, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ 
                      delay: 0.7 + (index * 0.1),
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{service}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>

          {/* Contact Info - Desktop */}
          <motion.div 
            className="hidden lg:block space-y-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div 
              className="space-y-4"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.h2 
                className="text-2xl font-semibold text-gray-800"
                whileHover={{ scale: 1.02 }}
              >
                ✨ Contact Us
              </motion.h2>
              
              {contactInfo.map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start space-x-3"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-700">{item.icon}</span>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-700">{item.label}</span> {item.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.p 
              className="text-lg text-gray-600 leading-relaxed"
              whileHover={{ scale: 1.01 }}
            >
              With state-of-the-art equipment, expert lighting, and a passion for storytelling, we
              create images that leave a lasting impression. Visit us today and let's bring your
              vision to life!
            </motion.p>
          </motion.div>
        </div>

        {/* Contact Info - Mobile */}
        <motion.div 
          className="lg:hidden mt-12 space-y-6 relative z-10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.h2 
            className="text-2xl font-semibold text-gray-800"
            whileHover={{ scale: 1.02 }}
          >
            Contact Us
          </motion.h2>
          
          <motion.div 
            className="space-y-4"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {contactInfo.map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-start space-x-3"
                whileHover={{ x: 5 }}
              >
                <span className="text-gray-700">{item.icon}</span>
                <p>
                  <span className="font-semibold">{item.label}</span> {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p 
            className="text-lg text-gray-600 leading-relaxed"
            whileHover={{ scale: 1.01 }}
          >
            With state-of-the-art equipment, expert lighting, and a passion for storytelling, we
            create images that leave a lasting impression. Visit us today and let's bring your
            vision to life!
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

AboutStudio.propTypes = {
  currentTheme: PropTypes.string.isRequired
};

export default AboutStudio;