import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { ShoppingCart } from 'lucide-react';

const FeaturedProducts = ({ onAddToCart }) => {
  const { inventory } = useAdmin();

  // Filter categories marked as featured
  const featured = inventory.filter(cat => cat.featured);

  // If no featured categories, return null
  if (featured.length === 0) {
    return null;
  }

  return (
    <section id="featured" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-aquatic-600 tracking-widest uppercase mb-2">Editor's Pick</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Featured Products</h3>
          <p className="text-lg text-slate-600">
            Hand-selected, premium specimens for the most discerning aquarists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {featured.map((category) => (
            <div key={category.id} className="group relative rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row bg-slate-50 border border-slate-100/50 hover:shadow-aquatic-500/20 transition-all duration-500">
              <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                 <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                 <img src={category.image} alt={category.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                 <div className="absolute top-4 left-4 z-20 bg-aquatic-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                   Featured
                 </div>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <h4 className="text-2xl font-bold text-slate-900 mb-2">{category.title}</h4>
                <p className="text-slate-600 mb-4 text-sm">
                  {category.subcategories.length} varieties available
                </p>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {category.description}
                </p>
                <button 
                  onClick={onAddToCart}
                  className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-aquatic-600 transition-colors w-full md:w-auto mt-auto"
                >
                  <ShoppingCart size={18} />
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
