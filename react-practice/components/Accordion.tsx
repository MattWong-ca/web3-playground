import React, { useState } from 'react';

const AccordionItem = ({ item }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="border border-gray-300 rounded mb-2">
      <div
        className="flex justify-between items-center p-4 bg-gray-200 cursor-pointer"
        onClick={toggle}
      >
        <span>{item.title}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && item.children && (
        <div className="pl-4">
          {item.children.map((child: any, index: any) => (
            <AccordionItem key={index} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const Accordion = ({ data }: any) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {data.map((item: any, index: any) => (
        <AccordionItem key={index} item={item} />
      ))}
    </div>
  );
};

export default Accordion;