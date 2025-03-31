import React from 'react';
import Layout from './Layout';

const PageBase = ({ title, subtitle, children }) => {
  return (
    <Layout>
      <div className="p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm sm:text-base text-gray-600">{subtitle}</p>
          )}
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </Layout>
  );
};

export default PageBase; 