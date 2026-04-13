import React from 'react';
import { Fish, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-tr from-aquatic-600 to-aquatic-400 p-2 rounded-xl text-white">
                <Fish size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
                Pulok<span className="text-aquatic-500">Pets</span>
              </span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Your premium destination for stunning freshwater fish. We specialize in ethically raised, high-quality aquatic life delivered right to your door.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-800 text-aquatic-400 font-bold hover:bg-aquatic-600 hover:text-white transition-all">
                FB
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-800 text-aquatic-400 font-bold hover:bg-aquatic-600 hover:text-white transition-all">
                IG
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-800 text-aquatic-400 font-bold hover:bg-aquatic-600 hover:text-white transition-all">
                X
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Categories</h4>
            <ul className="space-y-4">
              <li><a href="#categories" className="text-slate-400 hover:text-aquatic-400 transition-colors">Community Fish</a></li>
              <li><a href="#categories" className="text-slate-400 hover:text-aquatic-400 transition-colors">Premium Bettas</a></li>
              <li><a href="#categories" className="text-slate-400 hover:text-aquatic-400 transition-colors">Monster Fish</a></li>
              <li><a href="#" className="text-slate-400 hover:text-aquatic-400 transition-colors">Live Plants</a></li>
              <li><a href="#" className="text-slate-400 hover:text-aquatic-400 transition-colors">Aquarium Supplies</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-aquatic-400 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-aquatic-400 transition-colors">Live Arrival Guarantee</a></li>
              <li><a href="#" className="text-slate-400 hover:text-aquatic-400 transition-colors">Care Guides</a></li>
              <li><a href="#" className="text-slate-400 hover:text-aquatic-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-slate-400 hover:text-aquatic-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-aquatic-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-slate-400">440 Shaheenbaag Tejgaon Dhaka,<br />Dhaka 1215</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-aquatic-500 mr-3 flex-shrink-0" />
                <span className="text-slate-400">+8801868989263</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-aquatic-500 mr-3 flex-shrink-0" />
                <a href="mailto:support@pulokpets.com" className="text-slate-400 hover:text-aquatic-400 transition-colors">support@pulokpets.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Pulok Pets. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
