import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-xl font-bold mb-3">
              StoreRating
            </h3>

            <p className="text-gray-400">
              Trusted store ratings and customer reviews.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>

            <div className="space-y-2">
              <p>Features</p>
              <p>Stores</p>
              <p>Reviews</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>

            <p className="text-gray-400">
              support@storerating.com
            </p>
          </div>

        </div>

        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-gray-400">
          © 2026 StoreRating Platform. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;