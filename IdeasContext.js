import React, { createContext, useContext, useState } from 'react';

const IdeasContext = createContext();

export function IdeasProvider({ children }) {
  const [ideas, setIdeas] = useState([]);

  const addIdea = (text) => {
    const newIdea = {
      id: Date.now().toString(),
      text,
      thumbnail: `https://picsum.photos/seed/${Math.random()}/400/200`,
      timestamp: new Date().toLocaleString('tr-TR'),
    };
    setIdeas((prev) => [newIdea, ...prev]);
  };

  const removeIdea = (id) => {
    setIdeas((prev) => prev.filter((item) => item.id !== id));
  };

  const clearArchive = () => {
    setIdeas([]);
  };

  return (
    <IdeasContext.Provider value={{ ideas, addIdea, removeIdea, clearArchive }}>
      {children}
    </IdeasContext.Provider>
  );
}

export function useIdeas() {
  const context = useContext(IdeasContext);
  if (!context) {
    throw new Error('useIdeas must be used within an IdeasProvider');
  }
  return context;
}
