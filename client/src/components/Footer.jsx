import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white py-8">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About CPP</h3>
            <p className="text-sm text-slate-400">
              CPP is a coding platform designed to help developers improve their skills by solving problems, learning from courses, and collaborating with peers.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/problems" className="hover:text-orange-500 transition-colors duration-300">Problems</a></li>
              <li><a href="/courses" className="hover:text-orange-500 transition-colors duration-300">Courses</a></li>
              <li><a href="/about" className="hover:text-orange-500 transition-colors duration-300">About Us</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:220120011@iitdh.ac.in" className="hover:text-orange-500 transition-colors duration-300">
                  Email: 220120011@iitdh.ac.in
                </a>
              </li>
              <li>
                <a href="tel:+919798617996" className="hover:text-orange-500 transition-colors duration-300">
                  Phone: +919798617996
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="flex justify-between items-center mt-8 border-t border-slate-700 pt-6">
          <div className="text-sm text-slate-400">
            <p>&copy; 2024 CPP. All rights reserved.</p>
          </div>
          <div className="space-x-6">
            <a href="/privacy-policy" className="text-sm text-slate-400 hover:text-orange-500 transition-colors duration-300">Privacy Policy</a>
            <a href="/terms-of-service" className="text-sm text-slate-400 hover:text-orange-500 transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
