import React, { useRef, useEffect } from 'react';

const handleAutoResize = (textarea) => {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const DescriptionBlock = ({ descriptionHtml, handleDescriptionChange, handleDeleteDescriptionItem, handleAddDescriptionItem }) => {
  const textAreaRefs = useRef([]);

  useEffect(() => {
    textAreaRefs.current.forEach((textarea) => {
      if (textarea) {
        handleAutoResize(textarea);
      }
    });
  }, [descriptionHtml]);

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Спосіб приготування</h2>
      {descriptionHtml.map((item, index) => (
        <div key={index} className="flex items-center mb-2">
          <textarea
            ref={(el) => (textAreaRefs.current[index] = el)}
            value={item}
            onChange={(e) => {
              handleDescriptionChange(index, e);
              handleAutoResize(e.target);
            }}
            className="w-full p-2 mr-2 border border-gray-300 rounded"
            rows={1} // Initial number of rows
          />
          <button
            onClick={() => handleDeleteDescriptionItem(index)}
          >
            ✖
          </button>
        </div>
      ))}
      <button
        onClick={handleAddDescriptionItem}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Додати крок
      </button>
    </div>
  );
};

export default DescriptionBlock;
