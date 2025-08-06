import React from 'react';
import { Recycle, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Recycle className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-xl font-bold">GreenLoop</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Bangladesh's leading cloud-based recycling platform, connecting communities 
              with sustainable waste management solutions for a greener future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-emerald-500 transition-colors">How it Works</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-500 transition-colors">Find Centers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-500 transition-colors">For Businesses</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-500 transition-colors">Sustainability Report</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-500 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-emerald-500 mr-3" />
                <span className="text-gray-300">+880 1234-567890</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-emerald-500 mr-3" />
                <span className="text-gray-300">hello@greenloop.bd</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-emerald-500 mr-3" />
                <span className="text-gray-300">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 GreenLoop. All rights reserved. Building a sustainable Bangladesh.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-emerald-500 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;