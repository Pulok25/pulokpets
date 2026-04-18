import React from 'react';

const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Browse our available categories and add your favorite fish varieties to the cart. Once you have selected the items, follow the checkout instructions provided on the page.'
  },
  {
    question: 'Do you ship live fish?',
    answer: 'Yes! We carefully package all live fish with temperature control and oxygenated water so they arrive safely at your doorstep.'
  },
  {
    question: 'Can I ask an expert for advice?',
    answer: 'Absolutely. Use the contact chat widget to send a direct message to our seller/admin, and you will receive a reply as soon as possible.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a live arrival guarantee on all healthy fish. If the shipment arrives damaged or dead, contact us immediately and we will assist you with a replacement or refund.'
  },
  {
    question: 'How can I keep my new fish healthy?',
    answer: 'Keep water quality high, maintain appropriate temperature, and provide proper food. If you need care guidance, use the chat option and our team will guide you step-by-step.'
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-aquatic-600 tracking-widest uppercase mb-2">Need Help?</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
          <p className="text-lg text-slate-600">Quick answers to common questions about our fish, shipping, and support process.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((item, index) => (
            <div key={index} className="border border-slate-200 rounded-3xl p-8 bg-slate-50 shadow-sm">
              <h4 className="text-xl font-semibold text-slate-900 mb-4">{item.question}</h4>
              <p className="text-slate-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
