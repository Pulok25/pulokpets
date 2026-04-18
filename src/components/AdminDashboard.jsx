import React, { useMemo, useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Package, AlertTriangle, Layers, Fish, Trash2, PowerOff, PlusCircle, X, Star, Send } from 'lucide-react';

const AdminDashboard = () => {
  const { isAdminLoggedIn, inventory, chatThreads, sendAdminReply, removeFishType, toggleStock, addFishType, addCategory, updateCategory, removeCategory, addSubcategory, removeSubcategory, toggleFeatured, deleteAllCategories, logout } = useAdmin();

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [addCategoryForm, setAddCategoryForm] = useState({ title: '', description: '', image: '' });
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [editCategoryForm, setEditCategoryForm] = useState({ id: '', title: '', description: '', image: '' });
  
  const [isAddSubcategoryModalOpen, setIsAddSubcategoryModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [addSubcategoryForm, setAddSubcategoryForm] = useState({ name: '', description: '', size: '', price: '0' });

  if (!isAdminLoggedIn) {
    return null;
  }

  const handleAddCategorySubmit = () => {
    if (!addCategoryForm.title.trim()) {
      alert('Category title is required');
      return;
    }
    addCategory(addCategoryForm.title, addCategoryForm.description, addCategoryForm.image);
    setAddCategoryForm({ title: '', description: '', image: '' });
    setIsAddCategoryModalOpen(false);
  };

  const handleAddSubcategorySubmit = () => {
    if (!addSubcategoryForm.name.trim()) {
      alert('Subcategory name is required');
      return;
    }
    if (isNaN(addSubcategoryForm.price)) {
      alert('Invalid price');
      return;
    }
    addSubcategory(selectedCategoryId, addSubcategoryForm.name, parseFloat(addSubcategoryForm.price), addSubcategoryForm.description, addSubcategoryForm.size);
    setAddSubcategoryForm({ name: '', description: '', size: '', price: '0' });
    setIsAddSubcategoryModalOpen(false);
  };

  const handleOpenAddSubcategoryModal = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setIsAddSubcategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (category) => {
    setEditCategoryForm({
      id: category.id,
      title: category.title,
      description: category.description || '',
      image: category.image || ''
    });
    setIsEditCategoryModalOpen(true);
  };

  const handleCategoryFileChange = (event, isEdit = false) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      if (isEdit) {
        setEditCategoryForm(prev => ({ ...prev, image: imageData }));
      } else {
        setAddCategoryForm(prev => ({ ...prev, image: imageData }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateCategorySubmit = () => {
    if (!editCategoryForm.title.trim()) {
      alert('Category title is required');
      return;
    }
    updateCategory(editCategoryForm.id, editCategoryForm.title, editCategoryForm.description, editCategoryForm.image);
    setEditCategoryForm({ id: '', title: '', description: '', image: '' });
    setIsEditCategoryModalOpen(false);
  };

  const handleRemoveCategory = (categoryId) => {
    if (!window.confirm('Delete this category and all its subcategories?')) return;
    removeCategory(categoryId);
  };

  const handleRemoveSubcategory = (categoryId, subcategoryId) => {
    if (!window.confirm('Delete this subcategory and all its types?')) return;
    removeSubcategory(categoryId, subcategoryId);
  };

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

  useEffect(() => {
    if (!selectedThreadId && chatThreads.length > 0) {
      setSelectedThreadId(chatThreads[0].id);
    }
  }, [chatThreads, selectedThreadId]);

  const handleSelectThread = (threadId) => {
    setSelectedThreadId(threadId);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || selectedThreadId == null) return;
    await sendAdminReply(selectedThreadId, replyMessage.trim());
    setReplyMessage('');
  };

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

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-2">Manage your inventory, categories, and stock availability.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-aquatic-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-aquatic-500"
            >
              Add Category
            </button>
            <button
              onClick={() => {
                if (window.confirm('Delete ALL categories and all their data? This cannot be undone!')) {
                  deleteAllCategories();
                }
              }}
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
            >
              Delete All
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
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

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {inventory.map(category => (
          <div key={category.id} className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src={category.image || 'https://via.placeholder.com/640x360?text=No+Image'}
                alt={category.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute left-5 bottom-5 text-white">
                <p className="text-sm uppercase tracking-[0.2em] text-white/80">Category</p>
                <h3 className="text-2xl font-bold">{category.title}</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-600 text-sm leading-6">{category.description || 'No description provided yet.'}</p>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{category.subcategories.length} subcategories</span>
                <span>{category.subcategories.reduce((count, sub) => count + (sub.types && sub.types.length > 0 ? sub.types.length : 1), 0)} varieties</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleOpenEditCategoryModal(category)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleOpenAddSubcategoryModal(category.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-aquatic-700 hover:bg-aquatic-50 transition-colors"
                >
                  Add Subcategory
                </button>
                <button
                  onClick={() => handleRemoveCategory(category.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Chat */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
        <div className="xl:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Incoming Contacts</h2>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {chatThreads.length === 0 && (
              <p className="text-slate-500">No customer conversations yet. New messages will appear here.</p>
            )}
            {chatThreads.map(thread => (
              <button
                key={thread.id}
                onClick={() => handleSelectThread(thread.id)}
                className={`w-full text-left rounded-3xl p-4 border ${selectedThreadId === thread.id ? 'border-aquatic-500 bg-aquatic-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'} transition-colors`}
              >
                <p className="font-semibold text-slate-900">{thread.customerName}</p>
                <p className="text-sm text-slate-500">{thread.customerEmail}</p>
                <p className="text-xs text-slate-400 mt-2">Latest: {new Date(thread.messages[thread.messages.length - 1].createdAt).toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Active Conversation</h2>
          {!selectedThreadId && (
            <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              Select a customer message to reply from the left panel.
            </div>
          )}
          {selectedThreadId && (
            <div className="space-y-6">
              {chatThreads.find(thread => thread.id === selectedThreadId)?.messages.map((msg) => (
                <div key={msg.id} className={`rounded-3xl p-5 ${msg.sender === 'admin' ? 'bg-aquatic-50 border border-aquatic-100 text-slate-900' : 'bg-slate-100 border border-slate-200 text-slate-900'}`}>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>{msg.sender === 'admin' ? 'Seller Reply' : 'Customer Message'}</span>
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}

              <div className="space-y-3">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-100"
                  placeholder="Write your reply to the customer"
                />
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <p className="text-sm text-slate-500">Admin replies are added to the active conversation.</p>
                  <button
                    onClick={handleSendReply}
                    className="inline-flex items-center gap-2 rounded-full bg-aquatic-600 px-5 py-3 text-sm font-semibold text-white hover:bg-aquatic-500 transition-colors"
                  >
                    <Send size={16} /> Send Reply
                  </button>
                </div>
              </div>
            </div>
          )}
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
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Subcategory</th>
                <th className="px-6 py-4 font-bold">Variety / Fish Type</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
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
                            <td className="px-6 py-4 text-slate-500 italic">Base Type - ৳{sub.price}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${sub.outOfStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {sub.outOfStock ? 'Out of Stock' : 'In Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 flex-wrap">
                              <button onClick={() => handleAddFish(cat.id, sub.name)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Add Variety">
                                <PlusCircle size={16} />
                              </button>
                              <button onClick={() => handleOpenAddSubcategoryModal(cat.id)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Add Subcategory">
                                +
                              </button>
                              <button onClick={() => toggleStock(cat.id, sub.name)} className={`p-2 rounded-lg transition-colors ${sub.outOfStock ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`} title="Toggle Stock">
                                <PowerOff size={16} />
                              </button>
                              <button onClick={() => handleRemoveSubcategory(cat.id, sub.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Subcategory">
                                <Trash2 size={16} />
                              </button>
                              {subIdx === 0 && (
                                <>
                                  <button onClick={() => toggleFeatured(cat.id)} className={`p-2 rounded-lg transition-colors ${cat.featured ? 'text-yellow-500 hover:bg-yellow-50' : 'text-slate-400 hover:bg-slate-100'}`} title={cat.featured ? 'Remove from Featured' : 'Add to Featured'}>
                                    <Star size={16} fill={cat.featured ? 'currentColor' : 'none'} />
                                  </button>
                                  <button onClick={() => handleRemoveCategory(cat.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Category">
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
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
                            <td className="px-6 py-4 text-slate-900 font-medium">{type.name} <span className="text-aquatic-600 ml-2">৳{type.price}</span></td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${type.outOfStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {type.outOfStock ? 'Out of Stock' : 'In Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right border-l border-slate-50">
                              <div className="flex justify-end gap-2 flex-wrap">
                                {typeIdx === 0 && (
                                  <button onClick={() => handleOpenAddSubcategoryModal(cat.id)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Add Subcategory">
                                    +
                                  </button>
                                )}
                                {typeIdx === 0 && (
                                  <button onClick={() => handleRemoveSubcategory(cat.id, sub.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Subcategory">
                                    <Trash2 size={16} />
                                  </button>
                                )}
                                {subIdx === 0 && typeIdx === 0 && (
                                  <button onClick={() => handleRemoveCategory(cat.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Category">
                                    <Trash2 size={16} />
                                  </button>
                                )}
                                <button onClick={() => toggleStock(cat.id, sub.name, type.name)} className={`p-2 rounded-lg transition-colors ${type.outOfStock ? 'text-green-600 hover:bg-green-50' : 'text-amber-600 hover:bg-amber-50'}`} title="Toggle Stock">
                                  <PowerOff size={16} />
                                </button>
                                <button onClick={() => removeFishType(cat.id, sub.name, type.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove Variety">
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

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg mx-4 sm:mx-auto p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsAddCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Add New Category</h3>
              <p className="text-slate-500 mt-2">Create a new fish category.</p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category Title *</label>
                <input 
                  type="text" 
                  value={addCategoryForm.title}
                  onChange={e => setAddCategoryForm({ ...addCategoryForm, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-500/20 outline-none transition-all"
                  placeholder="e.g., Tropical Tetras"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  value={addCategoryForm.description}
                  onChange={e => setAddCategoryForm({ ...addCategoryForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-500/20 outline-none transition-all"
                  placeholder="Describe this category..."
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={addCategoryForm.image}
                  onChange={e => setAddCategoryForm({ ...addCategoryForm, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-500/20 outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCategoryFileChange(e, false)}
                  className="w-full text-sm text-slate-600"
                />
              </div>
              {addCategoryForm.image && (
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img src={addCategoryForm.image} alt="Preview" className="w-full h-48 object-cover" />
                </div>
              )}
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddCategorySubmit}
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-aquatic-600 transition-colors"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditCategoryModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg mx-4 sm:mx-auto p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsEditCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Edit Category</h3>
              <p className="text-slate-500 mt-2">Update category details, description, and image.</p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category Title *</label>
                <input 
                  type="text" 
                  value={editCategoryForm.title}
                  onChange={e => setEditCategoryForm({ ...editCategoryForm, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-500/20 outline-none transition-all"
                  placeholder="e.g., Tropical Tetras"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  value={editCategoryForm.description}
                  onChange={e => setEditCategoryForm({ ...editCategoryForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-500/20 outline-none transition-all"
                  placeholder="Describe this category..."
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={editCategoryForm.image}
                  onChange={e => setEditCategoryForm({ ...editCategoryForm, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-500/20 outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCategoryFileChange(e, true)}
                  className="w-full text-sm text-slate-600"
                />
              </div>
              {editCategoryForm.image && (
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img src={editCategoryForm.image} alt="Preview" className="w-full h-48 object-cover" />
                </div>
              )}
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setIsEditCategoryModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateCategorySubmit}
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-aquatic-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {isAddSubcategoryModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg mx-4 sm:mx-auto p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsAddSubcategoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Add New Subcategory</h3>
              <p className="text-slate-500 mt-2">Add a fish variant to this category.</p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subcategory Name *</label>
                <input 
                  type="text" 
                  value={addSubcategoryForm.name}
                  onChange={e => setAddSubcategoryForm({ ...addSubcategoryForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-500/20 outline-none transition-all"
                  placeholder="e.g., Red Tetra"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Price *</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={addSubcategoryForm.price}
                  onChange={e => setAddSubcategoryForm({ ...addSubcategoryForm, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-500/20 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  value={addSubcategoryForm.description}
                  onChange={e => setAddSubcategoryForm({ ...addSubcategoryForm, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-500/20 outline-none transition-all"
                  placeholder="Describe this subcategory..."
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Size</label>
                <input 
                  type="text" 
                  value={addSubcategoryForm.size}
                  onChange={e => setAddSubcategoryForm({ ...addSubcategoryForm, size: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-500/20 outline-none transition-all"
                  placeholder="e.g., 5-7 cm"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setIsAddSubcategoryModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddSubcategorySubmit}
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-aquatic-600 transition-colors"
                >
                  Add Subcategory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
