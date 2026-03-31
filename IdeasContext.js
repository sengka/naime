import React, { createContext, useContext, useState } from 'react';

const IdeasContext = createContext();

export function IdeasProvider({ children }) {
  const [ideas, setIdeas] = useState([]);

  const addIdea = (text) => {
    const newIdea = {
      id: Date.now().toString(),
      text,
      title: 'Yeni Fikir',
      thumbnail: `https://picsum.photos/seed/${Math.random()}/400/200`,
      timestamp: new Date().toLocaleString('tr-TR'),
    };
    setIdeas((prev) => [newIdea, ...prev]);
  };

  const removeIdea = (id) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
  };

  const updateIdea = (id, newData) => {
    setIdeas((prev) =>
      prev.map((idea) => (idea.id === id ? { ...idea, ...newData } : idea))
    );
  };

  const clearArchive = () => {
    setIdeas([]);
  };

  return (
    <IdeasContext.Provider value={{ ideas, addIdea, removeIdea, updateIdea, clearArchive }}>
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
