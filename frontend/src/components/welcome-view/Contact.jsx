import React from 'react';
import { motion } from 'framer-motion';
import logo from '../../assets/LogoHome.jpeg';
import { FiMail, FiPhone, FiMapPin, FiClock, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const ContactPage = () => {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-50 flex flex-col">
      {/* Header */}
            <header className="py-0 border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <img 
                                src={logo} 
                                alt="ProShots Logo" 
                                onClick={()=>navigate('/')}
                                className="h-24 w-auto"
                            />
                        </div>
                        <nav className="ml-auto hidden md:block">
                            <ul className="flex space-x-8">
                                <li><Link to="/" className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium">Home</Link></li>
                                <li><Link to="/common/blog" className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium">Blog</Link></li>
                                <li><Link to="/common/contact" className="text-red-600 hover:text-purple-600 transition-colors duration-200 font-medium">Contact</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Our Studio</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visit us or reach out through any of these channels. We'd love to create beautiful memories together.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg space-y-8"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg text-purple-600">
                <FiMapPin className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Studio Location</h3>
                <p className="text-gray-600">123 Photography Avenue</p>
                <p className="text-gray-600">Creative District, CA 90210</p>
                <p className="text-gray-500 text-sm mt-2">Free parking available in the rear</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg text-purple-600">
                <FiClock className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Working Hours</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600 font-medium">Monday - Friday</p>
                  <p className="text-gray-600">9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600 font-medium">Saturday</p>
                  <p className="text-gray-600">10:00 AM - 4:00 PM</p>
                  <p className="text-gray-600 font-medium">Sunday</p>
                  <p className="text-gray-600">Closed</p>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg text-purple-600">
                <FiMail className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 hover:text-purple-600 transition-colors">
                  <a href="mailto:bookings@proshots.com">bookings@proshots.com</a>
                </p>
                <p className="text-gray-600 hover:text-purple-600 transition-colors">
                  <a href="mailto:support@proshots.com">support@proshots.com</a>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg text-purple-600">
                <FiPhone className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 hover:text-purple-600 transition-colors">
                  <a href="tel:+15551234567">(555) 123-4567</a> (Bookings)
                </p>
                <p className="text-gray-600 hover:text-purple-600 transition-colors">
                  <a href="tel:+15559876543">(555) 987-6543</a> (Support)
                </p>
              </div>
            </div>
          </motion.div>

          {/* Map and Social Media */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Map Embed */}
            <div className="bg-white p-1 rounded-2xl shadow-lg overflow-hidden h-64 md:h-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126325.25779977471!2d79.94940995820312!3d9.672500900000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe547040755555%3A0x1a00a7a1a547f70!2sKantharmadam%2C%20Jaffna!5e0!3m2!1sen!2slk!4v1716980000000!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="ProShots Studio Location in Kantharmadam, Jaffna"
                className="rounded-xl"
              ></iframe>
            </div>

            {/* Social Media */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Connect With Us</h3>
              <div className="flex justify-center space-x-6">
                <motion.a 
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="https://www.instagram.com/proshots_studio/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-purple-100 p-3 rounded-full text-purple-600 hover:bg-purple-200 transition-colors"
                  aria-label="Instagram"
                >
                  <FiInstagram className="w-6 h-6" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="https://web.facebook.com/Proshots.lk/?_rdc=1&_rdr#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-purple-100 p-3 rounded-full text-purple-600 hover:bg-purple-200 transition-colors"
                  aria-label="Facebook"
                >
                  <FiFacebook className="w-6 h-6" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="https://twitter.com/proshots" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-purple-100 p-3 rounded-full text-purple-600 hover:bg-purple-200 transition-colors"
                  aria-label="Twitter"
                >
                  <FiTwitter className="w-6 h-6" />
                </motion.a>
              </div>
              <p className="text-center text-gray-500 mt-4">
                Follow us for updates and special offers
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} ProShots Studio Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;