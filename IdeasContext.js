import React, { createContext, useState, useContext, useEffect } from 'react';
import { LayoutAnimation } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IdeasContext = createContext();

const STORAGE_KEYS = {
  IDEAS: '@fikir_atolyesi_ideas',
  THEME: '@fikir_atolyesi_theme',
};

export function IdeasProvider({ children }) {
  const [ideas, setIdeas] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadPersistentData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveIdeas();
      saveTheme();
    }
  }, [ideas, isDarkMode, isLoaded]);

  const loadPersistentData = async () => {
    try {
      const savedIdeas = await AsyncStorage.getItem(STORAGE_KEYS.IDEAS);
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      
      if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
      if (savedTheme) setIsDarkMode(JSON.parse(savedTheme));
    } catch (e) {
      console.error('Veri yükleme hatası:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveIdeas = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
    } catch (e) {
      console.error('Fikirleri kaydetme hatası:', e);
    }
  };

  const saveTheme = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDarkMode));
    } catch (e) {
      console.error('Tema kaydetme hatası:', e);
    }
  };

  const generateNextSteps = (text) => {
    // Mock AI Logic to generate contextual steps
    if (text.toLowerCase().includes('uygulama') || text.toLowerCase().includes('app')) {
      return ['UX/UI Taslaklarını Oluştur', 'Teknoloji Yığınını Seç', 'MVP Özelliklerini Belirle'];
    } else if (text.toLowerCase().includes('yemek') || text.toLowerCase().includes('tarif')) {
      return ['Malzeme Listesi Çıkar', 'Sunum Tekniklerini Araştır', 'Tadım Testi Yap'];
    } else if (text.toLowerCase().includes('oyun') || text.toLowerCase().includes('game')) {
      return ['Oyun Mekaniklerini Tasarla', 'Karakter Eskizlerini Çiz', 'Level Tasarımına Başla'];
    }
    return ['Pazar Araştırması Yap', 'Bütçe Planı Oluştur', 'İlk Prototipi Hazırla'];
  };

  const addIdea = (text) => {
    const newIdea = {
      id: Date.now().toString(),
      text,
      title: 'Yeni Fikir',
      actionItems: generateNextSteps(text),
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

  const toggleDarkMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDarkMode((prev) => !prev);
  };

  return (
    <IdeasContext.Provider value={{ ideas, addIdea, removeIdea, updateIdea, clearArchive, isDarkMode, toggleDarkMode, isLoaded }}>
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
