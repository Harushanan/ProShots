import ownerImage from "@/assets/owner.jpg";

const AboutStudio = () => {
  return (
    <div className="hidden md:block bg-gray-300 py-6 px-4 md:px-10 lg:px-20 mx-8 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        <div>
          <div
            className="w-full h-[400px] md:h-[420px] bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${ownerImage})` }}
          ></div>
            <p className="text-center text-2xl font-semibold text-gray-800 mt-2 underline">
                Atharva (Senior Photographer)
            </p>        
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Capture Timeless Moments with Us!
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to <span className="font-semibold text-gray-800">ProShots</span>, a professional
            photography studio dedicated to transforming your memories into stunning visual stories.
          </p>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">✨ Our Services:</h2>
            <ul className="text-lg text-gray-600 space-y-2">
              <li>✅ Portrait & Fashion Photography</li>
              <li>✅ Wedding & Event Coverage</li>
              <li>✅ Product & Commercial Shoots</li>
              <li>✅ Professional Headshots</li>
              <li>✅ Gift Items Sale</li>
            </ul>
          </div>
        </div>

        <div className="hidden lg:block text-lg text-gray-700 mt-3">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">✨ Contact Us</h2>
          <p>
            📍 <span className="font-semibold">Location:</span> Manipai Road, Jaffna
          </p>
          <p>
            📞 <span className="font-semibold">Contact:</span> 077-456-9254
          </p>
          <p>
            🌐 <span className="font-semibold">FaceBook:</span> ProShots Photography Studio
          </p>

          <p className="text-lg text-gray-600 mt-6">
            With state-of-the-art equipment, expert lighting, and a passion for storytelling, we
            create images that leave a lasting impression. Visit us today and let’s bring your
            vision to life!
          </p>
        </div>
      </div>

      <div className="lg:hidden text-lg text-gray-700 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Contact Us</h2>
        <p>
          📍 <span className="font-semibold">Location:</span> Manipai Road, Jaffna
        </p>
        <p>
          📞 <span className="font-semibold">Contact:</span> 077-456-9254
        </p>
        <p>
          🌐 <span className="font-semibold">FaceBook:</span> ProShots Photography Studio
        </p>

        <p className="text-lg text-gray-600 mt-6">
          With state-of-the-art equipment, expert lighting, and a passion for storytelling, we
          create images that leave a lasting impression. Visit us today and let’s bring your
          vision to life!
        </p>
      </div>
    </div>
  );
};

export default AboutStudio;
