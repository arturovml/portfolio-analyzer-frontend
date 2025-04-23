import { useState } from 'react';

const Collapsible = ({ title, children, defaultOpen = false, className = "", titleClassName = "" }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden mb-4 ${className}`}>
      <button
        className={`w-full flex justify-between items-center p-4 text-left font-medium bg-gray-50 hover:bg-gray-100 transition-colors ${titleClassName}`}
        onClick={toggle}
      >
        <span>{title}</span>
        <span className="text-sm font-medium">{isOpen ? "▲" : "▼"}</span>
      </button>
      
      {isOpen && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapsible; 