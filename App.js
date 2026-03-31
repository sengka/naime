import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as LucideIcons from 'lucide-react-native';
import features from './features.json';
import { IdeasProvider, useIdeas } from './IdeasContext';

const Stack = createStackNavigator();

const renderIcon = (name, color, size = 24) => {
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
  return <IconComponent color={color} size={size} />;
};

function WorkshopScreen({ navigation }) {
  const { theme, screen } = features;
  const { addIdea } = useIdeas();
  const [idea, setIdea] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', { hour12: false });
  };

  const handleAction = (action) => {
    switch (action) {
      case 'transform_idea':
        if (!idea.trim()) {
          Alert.alert('Hata', 'Lütfen önce bir fikir yazın!');
          return;
        }
        setIsProcessing(true);
        setTimeout(() => {
          addIdea(idea);
          Alert.alert(
            'Fikir Dönüştürüldü! 🚀',
            `"${idea}" fikrin bir prototip araca dönüştürüldü. Fikir defterine görseliyle kaydedildi.`,
            [{ text: 'HARİKA', onPress: () => {
              setIdea('');
              setIsProcessing(false);
            }}]
          );
        }, 1500);
        break;
      case 'view_archive':
        navigation.navigate('Archive');
        break;
      default:
        console.log(`Bilinmeyen aksiyon: ${action}`);
    }
  };

  const renderComponent = (component, index) => {
    switch (component.type) {
      case 'header':
        return (
          <View key={index} style={styles.headerContainer}>
            <View style={styles.header}>
              {renderIcon(component.icon, theme.primary, 36)}
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                {component.title}
              </Text>
            </View>
            <View style={[styles.clockContainer, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}>
              {renderIcon('Clock', theme.primary, 14)}
              <Text style={[styles.clockText, { color: theme.primary }]}>{formatTime(time)}</Text>
            </View>
          </View>
        );
      case 'card':
        return (
          <View key={index} style={[styles.card, { borderColor: theme.secondary + '30' }]}>
            <Text style={[styles.cardTitle, { color: theme.primary }]}>
              {component.title}
            </Text>
            <Text style={[styles.cardContent, { color: theme.text }]}>
              {component.content}
            </Text>
            {component.footer && (
              <View style={styles.cardFooterContainer}>
                <View style={[styles.footerBadge, { backgroundColor: theme.primary + '20' }]}>
                  <Text style={[styles.cardFooter, { color: theme.primary }]}>
                    {component.footer}
                  </Text>
                </View>
              </View>
            )}
          </View>
        );
      case 'text-input':
        return (
          <View key={index} style={styles.inputWrapper}>
            <View style={[styles.inputContainer, { borderColor: theme.secondary + '40' }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={component.placeholder}
                placeholderTextColor={theme.secondary}
                value={idea}
                onChangeText={setIdea}
                multiline
              />
            </View>
            <TouchableOpacity
              style={[styles.inputButton, { backgroundColor: theme.primary }]}
              onPress={() => handleAction(component.action)}
              activeOpacity={0.8}
              disabled={isProcessing}
            >
              <Text style={styles.inputButtonLabel}>
                {isProcessing ? 'İŞLENİYOR...' : component.buttonLabel}
              </Text>
              {renderIcon('Zap', '#ffffff', 18)}
            </TouchableOpacity>
          </View>
        );
      case 'button':
        return (
          <TouchableOpacity
            key={index}
            style={[styles.button, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '40' }]}
            activeOpacity={0.8}
            onPress={() => handleAction(component.action)}
          >
            {renderIcon(component.icon, theme.primary, 20)}
            <Text style={[styles.buttonLabel, { color: theme.primary }]}>{component.label}</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.main}>
            {screen.components.map((comp, idx) => renderComponent(comp, idx))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ArchiveScreen({ navigation }) {
  const { theme } = features;
  const { ideas, removeIdea, updateIdea, clearArchive } = useIdeas();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  
  const handleClear = () => {
    if (ideas.length === 0) return;
    Alert.alert('Arşivi Temizle', 'Tüm fikirlerini silmek istediğine emin misin?', [
      { text: 'İPTAL', style: 'cancel' },
      { text: 'SİL', onPress: clearArchive, style: 'destructive' }
    ]);
  };

  const openEdit = (item) => {
    setEditingIdea(item);
    setEditTitle(item.title || 'Fikir Başlığı');
    setEditText(item.text);
    setModalVisible(true);
  };

  const saveEdit = () => {
    if (editingIdea) {
      updateIdea(editingIdea.id, { title: editTitle, text: editText });
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.archiveHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          {renderIcon('ChevronLeft', theme.text, 28)}
        </TouchableOpacity>
        <Text style={[styles.archiveTitle, { color: theme.text }]}>Fikir Arşivi</Text>
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          {renderIcon('Trash2', theme.secondary, 20)}
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          {ideas.length === 0 ? (
            <View style={[styles.card, { borderColor: theme.secondary + '30', borderStyle: 'dashed' }]}>
              <View style={styles.emptyIconContainer}>
                {renderIcon('Inbox', theme.secondary, 48)}
              </View>
              <Text style={[styles.cardContent, { color: theme.secondary, textAlign: 'center' }]}>
                Henüz bir fikir arşivlenmemiş. Atölye'ye gidip bir şeyler üretmeye başla!
              </Text>
            </View>
          ) : (
            ideas.map((item) => (
              <View key={item.id} style={[styles.card, { padding: 0, overflow: 'hidden', borderColor: theme.secondary + '20' }]}>
                <Image source={{ uri: item.thumbnail }} style={styles.ideaImage} />
                <View style={styles.ideaContent}>
                  <View style={styles.ideaHeader}>
                    <View style={styles.ideaMeta}>
                      <Text style={[styles.ideaTime, { color: theme.secondary }]}>{item.timestamp}</Text>
                      <Text style={[styles.ideaTitleText, { color: theme.primary }]}>{item.title || 'Adsız Fikir'}</Text>
                    </View>
                    <View style={styles.ideaActions}>
                      <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionIcon}>
                        {renderIcon('Edit3', theme.secondary, 18)}
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removeIdea(item.id)} style={styles.actionIcon}>
                        {renderIcon('X', theme.secondary, 18)}
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={[styles.ideaText, { color: theme.text }]}>{item.text}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background, borderColor: theme.primary + '30' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Fikri Düzenle</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                {renderIcon('X', theme.text, 24)}
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={[styles.inputLabel, { color: theme.secondary }]}>BAŞLIK</Text>
              <TextInput
                style={[styles.modalInput, { color: theme.text, borderColor: theme.secondary + '30' }]}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Fikir Başlığı"
                placeholderTextColor={theme.secondary}
              />
              
              <Text style={[styles.inputLabel, { color: theme.secondary, marginTop: 20 }]}>FİKİR DETAYI</Text>
              <TextInput
                style={[styles.modalInput, { color: theme.text, borderColor: theme.secondary + '30', minHeight: 100 }]}
                value={editText}
                onChangeText={setEditText}
                multiline
                placeholder="Fikrini detaylandır..."
                placeholderTextColor={theme.secondary}
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={saveEdit}
            >
              <Text style={styles.saveButtonText}>KAYDET</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  const { theme } = features;
  
  return (
    <IdeasProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: theme.background },
            animationEnabled: true,
          }}
        >
          <Stack.Screen name="Workshop" component={WorkshopScreen} />
          <Stack.Screen name="Archive" component={ArchiveScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </IdeasProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 30,
  },
  main: {
    paddingHorizontal: 24,
    gap: 24,
  },
  headerContainer: {
    marginBottom: 10,
    marginTop: 20,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  clockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  clockText: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  archiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  clearButton: {
    padding: 8,
  },
  archiveTitle: {
    fontSize: 24,
    fontWeight: '800',
    flex: 1,
  },
  emptyIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
    opacity: 0.5,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    opacity: 0.9,
  },
  cardContent: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    marginBottom: 20,
  },
  cardFooterContainer: {
    flexDirection: 'row',
  },
  footerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardFooter: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ideaImage: {
    width: '100%',
    height: 160,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  ideaContent: {
    padding: 24,
  },
  ideaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ideaMeta: {
    flex: 1,
  },
  ideaActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionIcon: {
    padding: 4,
  },
  ideaTime: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  ideaTitleText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  ideaText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    paddingBottom: 50,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  modalBody: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  saveButton: {
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 24,
    gap: 12,
    shadowColor: '#3b82f6',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  inputWrapper: {
    gap: 16,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    minHeight: 120,
  },
  input: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    textAlignVertical: 'top',
  },
  inputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  inputButtonLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
