import React, { useEffect, useState } from "react";
import {
  Facebook,
  Twitter,
  LinkedIn,
  LocationOn,
} from "@mui/icons-material";
import axiosInstance from "../utils/axiosInstance";

const Footer = () => {
  const [visitors, setVisitors] = useState(0);
  const userId = "PSG-VISITOR"; // constant ID for general site-level tracking

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        // Include institution in POST request to fix duplicate index error
        await axiosInstance.post(`/api/visitors/${userId}`, {
          institution: "PSG"
        });

        const res = await axiosInstance.get(`/api/visitors/${userId}`);
        if (res.data?.count) {
          setVisitors(res.data.count);
        }
      } catch (err) {
        console.error("Visitor tracking failed:", err);
      }
    };
    fetchVisitorCount();
  }, []);

  return (
    <footer className="bg-gradient-to-b from-white to-blue-50 text-gray-800 font-sans border-t border-blue-100">
      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-5xl font-serif font-extrabold text-center text-blue-900 mb-12 tracking-tight">
          Contact Us
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Google Map */}
          <div className="rounded-xl overflow-hidden shadow-md border border-blue-100">
            <iframe
              title="PSG Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7832.382858792162!2d77.00024787498151!3d11.024259654573672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8582f1435fa59%3A0x137d95bfd8909293!2sPSG%20College%20Of%20Technology!5e0!3m2!1sen!2sin!4v1750401673457!5m2!1sen!2sin"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Contact Info */}
          <div className="text-lg leading-relaxed space-y-6 font-medium text-blue-900">
            <p>
              <strong className="font-bold">Address:</strong><br />
              PSG INSTITUTIONS<br />
              Peelamedu, Coimbatore - 641004,<br />
              Tamil Nadu, India.
            </p>

            <p>
              <strong className="font-bold">Telephone No:</strong><br />
              0422-4344782 / +91 95009 81372
            </p>

            <p>
              <strong className="font-bold">Fax:</strong><br />
              0422-2573833
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-6 pt-4">
              <a
                href="#"
                className="text-blue-600 hover:text-white hover:bg-blue-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md"
                title="Facebook"
              >
                <Facebook fontSize="large" />
              </a>
              <a
                href="#"
                className="text-sky-500 hover:text-white hover:bg-sky-500 p-2 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md"
                title="Twitter"
              >
                <Twitter fontSize="large" />
              </a>
              <a
                href="#"
                className="text-blue-800 hover:text-white hover:bg-blue-800 p-2 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md"
                title="LinkedIn"
              >
                <LinkedIn fontSize="large" />
              </a>
            </div>

            {/* Visitor Count */}
            <div className="pt-6 text-sm font-light text-gray-600">
              Visitors:{" "}
              <span className="font-bold text-blue-700 animate-pulse">
                {visitors}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <div className="bg-blue-900 text-white text-center py-4 text-sm font-medium tracking-wide shadow-inner">
        © {new Date().getFullYear()} PSG College of Technology. All Rights Reserved.<br />
        <span className="text-sm font-light">Powered By PSG Tech Careers Team.</span>
      </div>
    </footer>
  );
};

export default Footer;





