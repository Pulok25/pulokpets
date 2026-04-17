import React, { useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Package, AlertTriangle, Layers, Fish, Trash2, PowerOff, PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { isAdminLoggedIn, inventory, removeFishType, toggleStock, addFishType } = useAdmin();

  if (!isAdminLoggedIn) {
    return null;
  }

  const metrics = useMemo(() => {
    let totalCategories = inventory.length;
    let totalSubcategories = 0;
    let totalVarieties = 0;
    let outOfStockVarieties = 0;

    inventory.forEach(cat => {
      totalSubcategories += cat.subcategories.length;
      cat.subcategories.forEach(sub => {
        if (!sub.types || sub.types.length === 0) {
          totalVarieties++;
          if (sub.outOfStock) outOfStockVarieties++;
        } else {
          totalVarieties += sub.types.length;
          sub.types.forEach(t => {
            if (t.outOfStock) outOfStockVarieties++;
          });
        }
      });
    });

    return { totalCategories, totalSubcategories, totalVarieties, outOfStockVarieties };
  }, [inventory]);

  const handleAddFish = (categoryId, subcategoryName) => {
    const name = window.prompt(`Enter new fish variant name for ${subcategoryName}:`);
    if (!name) return;
    const price = window.prompt(`Enter price for ${name}:`, '10.99');
    if (!price || isNaN(price)) {
      alert("Invalid price.");
      return;
    }
    addFishType(categoryId, subcategoryName, name, price);
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Manage your inventory, categories, and stock availability.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Layers size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Categories</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.totalCategories}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-teal-100 text-teal-600 rounded-xl"><Package size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Subcategories</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.totalSubcategories}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-aquatic-100 text-aquatic-600 rounded-xl"><Fish size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Varieties</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.totalVarieties}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Out of Stock</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.outOfStockVarieties}</p>
          </div>
        </div>
      </div>

      {/* Inventory Management Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Inventory Management</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-semibold font-bold">Category</th>
                <th className="px-6 py-4 font-semibold font-bold">Subcategory</th>
                <th className="px-6 py-4 font-semibold font-bold">Variety / Fish Type</th>
                <th className="px-6 py-4 font-semibold font-bold">Status</th>
                <th className="px-6 py-4 font-semibold font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map(cat => (
                <React.Fragment key={cat.id}>
                  {cat.subcategories.map((sub, subIdx) => {
                    const hasTypes = sub.types && sub.types.length > 0;
                    
                    if (!hasTypes) {
                      return (
                        <tr key={`${cat.id}-${sub.name}`} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            {subIdx === 0 ? <span className="font-bold text-slate-900">{cat.title}</span> : <span className="text-slate-400">"</span>}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-700">{sub.name}</td>
                          <td className="px-6 py-4 text-slate-500 italic">Base Type - ${sub.price}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${sub.outOfStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {sub.outOfStock ? 'Out of Stock' : 'In Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleAddFish(cat.id, sub.name)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Add Variety">
                                <PlusCircle size={16} />
                              </button>
                              <button onClick={() => toggleStock(cat.id, sub.name)} className={`p-2 rounded-lg transition-colors ${sub.outOfStock ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`} title="Toggle Stock">
                                <PowerOff size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <React.Fragment key={`${cat.id}-${sub.name}`}>
                        {sub.types.map((type, typeIdx) => (
                          <tr key={`${cat.id}-${sub.name}-${type.name}`} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              {subIdx === 0 && typeIdx === 0 ? <span className="font-bold text-slate-900">{cat.title}</span> : <span className="text-slate-400">"</span>}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-700">
                              {typeIdx === 0 ? sub.name : <span className="text-slate-300 ml-4 font-normal">↳</span>}
                            </td>
                            <td className="px-6 py-4 text-slate-900 font-medium">{type.name} <span className="text-aquatic-600 ml-2">${type.price}</span></td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${type.outOfStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {type.outOfStock ? 'Out of Stock' : 'In Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right border-l border-slate-50">
                              <div className="flex justify-end gap-2">
                                {typeIdx === 0 && (
                                  <button onClick={() => handleAddFish(cat.id, sub.name)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Add another variety to this Subcategory">
                                    <PlusCircle size={16} />
                                  </button>
                                )}
                                <button onClick={() => toggleStock(cat.id, sub.name, type.name)} className={`p-2 rounded-lg transition-colors ${type.outOfStock ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`} title="Toggle Stock">
                                  <PowerOff size={16} />
                                </button>
                                <button onClick={() => removeFishType(cat.id, sub.name, type.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
