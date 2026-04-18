import React, { useEffect, useState } from 'react';
import { MessageSquare, Send, Mail, Phone, MapPin } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Contact = () => {
  const { chatThreads, sendCustomerMessage, loadChat } = useAdmin();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadChat();
    const storedThread = localStorage.getItem('pulokpets_active_thread');
    if (storedThread) {
      setActiveThreadId(Number(storedThread));
    }
  }, []);

  useEffect(() => {
    if (activeThreadId) {
      localStorage.setItem('pulokpets_active_thread', activeThreadId);
    }
  }, [activeThreadId]);

  const activeThread = chatThreads.find(thread => thread.id === activeThreadId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusMessage('Please fill in all fields before sending.');
      return;
    }

    const result = await sendCustomerMessage(activeThreadId, name.trim(), email.trim(), message.trim());
    if (result?.threadId) {
      setActiveThreadId(result.threadId);
      setStatusMessage('Message sent! The seller will reply shortly.');
      setMessage('');
    } else {
      setStatusMessage('Unable to send your message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <div className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-2xl bg-aquatic-100 p-3 text-aquatic-600">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-sm text-aquatic-600 uppercase tracking-[0.25em]">Contact Seller</p>
                <h2 className="text-3xl font-bold text-slate-900">Live Chat & Support</h2>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mb-8">
              Send a message directly to the seller. Your inquiry will appear on the admin dashboard, and the admin can reply in real time.
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-slate-500">
                <MapPin size={20} className="text-aquatic-500" />
                <span>440 Shaheenbaag Tejgaon, Dhaka 1215</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Phone size={20} className="text-aquatic-500" />
                <span>+8801868989263</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Mail size={20} className="text-aquatic-500" />
                <span>support@pulokpets.com</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-100" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-100" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-aquatic-500 focus:ring-2 focus:ring-aquatic-100" placeholder="Tell us what you need help with"></textarea>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-aquatic-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-aquatic-500 transition-colors">
                <Send size={16} /> Send Message
              </button>
            </form>
            {statusMessage && <p className="mt-4 text-sm text-slate-600">{statusMessage}</p>}
          </div>

          <div className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h3 className="text-2xl font-semibold text-slate-900 mb-5">Your Conversation</h3>
            {!activeThread && (
              <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-slate-600">
                <p className="font-semibold mb-2">No active chat yet</p>
                <p>Send a message above to start a conversation with our seller.</p>
              </div>
            )}
            {activeThread && (
              <div className="space-y-4">
                {activeThread.messages.map((msg) => (
                  <div key={msg.id} className={`rounded-3xl p-4 ${msg.sender === 'admin' ? 'bg-aquatic-50 border border-aquatic-100 text-slate-900' : 'bg-slate-100 border border-slate-200 text-slate-900'}`}>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>{msg.sender === 'admin' ? 'Seller reply' : activeThread.customerName}</span>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
