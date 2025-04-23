import React from 'react';

const ChartFrame = ({ title, src, className = "" }) => {
  const openInNewTab = () => {
    window.open(src, '_blank');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-gray-700 font-medium">{title}</h4>
        <button 
          onClick={openInNewTab} 
          className="px-3 py-1 bg-gray-100 hover:bg-blue-100 rounded-md border border-gray-300 text-gray-700 hover:text-blue-700 font-medium text-sm transition-colors"
          aria-label="Abrir en nueva pestaña"
        >
          Abrir en nueva pestaña
        </button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-md h-96 md:h-[500px]">
        <iframe 
          src={src}
          className="w-full h-full"
          title={title}
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ChartFrame; 