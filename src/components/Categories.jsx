import React from 'react';
import { useAdmin } from '../context/AdminContext';

const Categories = ({ onAddToCart }) => {
  const { inventory } = useAdmin();

  return (
    <section id="categories" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-aquatic-600 tracking-widest uppercase mb-2">Our Collection</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Discover Your Perfect Match</h3>
          <p className="text-lg text-slate-600">
            Explore our diverse ranges of healthy, sustainably raised freshwater fish. From peaceful communities to majestic solitary species, we have everything to make your aquatic vision come alive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {inventory.map((category) => (
            <div key={category.id} className="group glass-card flex flex-col h-full bg-white hover:-translate-y-2 transition-transform duration-500 cursor-pointer shadow-xl shadow-slate-200/50">
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-aquatic-700 shadow-sm">
                  {category.subcategories.reduce((total, sub) => total + (sub.types?.length > 0 ? sub.types.length : 1), 0)} Varieties
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow relative">
                <h4 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-aquatic-600 transition-colors">
                  {category.title}
                </h4>
                <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                  {category.description}
                </p>

                <div className="pt-4 border-t border-slate-100 mt-auto flex flex-col gap-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Varieties</span>

                  {category.subcategories.map(sub => (
                    <div key={sub.name}>
                      {/* Subcategory with no sub-types (leaf product) */}
                      {(!sub.types || sub.types.length === 0) && (
                        <div className={`rounded-xl border p-4 flex flex-col gap-2 ${sub.outOfStock ? 'border-slate-200 bg-slate-50' : 'border-aquatic-100 bg-aquatic-50/40'}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold text-sm ${sub.outOfStock ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                {sub.name}
                              </p>
                              {sub.description && (
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sub.description}</p>
                              )}
                              {sub.size && (
                                <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-aquatic-700 bg-aquatic-100 px-2 py-0.5 rounded-full">
                                  📏 {sub.size}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              {sub.price && (
                                <span className={`text-lg font-extrabold ${sub.outOfStock ? 'text-slate-400' : 'text-aquatic-600'}`}>
                                  ${sub.price}
                                </span>
                              )}
                              <button 
                                disabled={sub.outOfStock}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddToCart();
                                }} 
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${sub.outOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-aquatic-500 text-white hover:bg-aquatic-600'}`}
                              >
                                {sub.outOfStock ? 'Out of Stock' : '+ Cart'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Subcategory with child types */}
                      {sub.types && sub.types.length > 0 && (
                        <div className="rounded-xl border border-slate-100 bg-slate-50 overflow-hidden">
                          <div className="px-4 py-2 bg-slate-100 border-b border-slate-200">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">{sub.name}</span>
                          </div>
                          <div className="flex flex-col divide-y divide-slate-100">
                            {sub.types.map(type => (
                              <div key={type.name} className="p-3 flex gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className={`font-bold text-sm ${type.outOfStock ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                    {type.name}
                                  </p>
                                  {type.description && (
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{type.description}</p>
                                  )}
                                  {type.size && (
                                    <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-aquatic-700 bg-aquatic-100 px-2 py-0.5 rounded-full">
                                      📏 {type.size}
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                  <span className={`text-base font-extrabold ${type.outOfStock ? 'text-slate-400' : 'text-aquatic-600'}`}>
                                    ${type.price}
                                  </span>
                                  <button 
                                    disabled={type.outOfStock}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onAddToCart();
                                    }} 
                                    className={`px-2 py-1 rounded text-[10px] uppercase font-bold transition-colors ${type.outOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-aquatic-500 text-white hover:bg-aquatic-600'}`}
                                  >
                                    {type.outOfStock ? 'Out of Stock' : '+ Cart'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Categories;
