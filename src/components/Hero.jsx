import React from 'react';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <header id="home" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1524704654690-b56c05c78a00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Beautiful planted aquarium background" 
          className="w-full h-full object-cover object-center scale-105 animate-float"
          style={{ animationDuration: '20s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/50 hidden md:block"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full">
        <div className="max-w-xl text-left pt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aquatic-500/20 border border-aquatic-400/30 backdrop-blur-sm text-aquatic-300 text-sm font-medium mb-6">
             <span className="w-2 h-2 rounded-full bg-aquatic-400 animate-pulse"></span>
             Premium Aquatic Life Delivery
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Dive Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-aquatic-300 to-aquatic-500">Living Art.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light">
            Discover our curated collection of vibrant Community Fish, majestic Bettas, and awe-inspiring Monster Fish. Expertly selected for your home aquarium.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#categories" className="btn-primary group">
              Explore Collection
              <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#about" className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/30 text-white font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm">
              Our Story
            </a>
          </div>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-white mb-1">100+</div>
              <div className="text-xs text-aquatic-300 uppercase tracking-wider font-semibold">Species Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">24h</div>
              <div className="text-xs text-aquatic-300 uppercase tracking-wider font-semibold">Live Arrival Guarantee</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">4.9</div>
              <div className="text-xs text-aquatic-300 uppercase tracking-wider font-semibold">Star Rating</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
