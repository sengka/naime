import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import features from './features.json';

export default function App() {
  const { theme, screen } = features;

  const renderIcon = (name, color, size = 24) => {
    // Lucide names in JSON might be Brain, Lightbulb
    // lucide-react-native exports them as Brain, Lightbulb
    const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
    return <IconComponent color={color} size={size} />;
  };

  const renderComponent = (component, index) => {
    switch (component.type) {
      case 'header':
        return (
          <View key={index} style={styles.header}>
            {renderIcon(component.icon, theme.primary, 36)}
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {component.title}
            </Text>
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
      case 'button':
        return (
          <TouchableOpacity
            key={index}
            style={[styles.button, { backgroundColor: theme.primary }]}
            activeOpacity={0.8}
          >
            {renderIcon(component.icon, '#ffffff', 20)}
            <Text style={styles.buttonLabel}>{component.label}</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          {screen.components.map((comp, idx) => renderComponent(comp, idx))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 60,
  },
  main: {
    paddingHorizontal: 24,
    gap: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 32,
    padding: 28,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
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
    fontSize: 20,
    lineHeight: 30,
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 24,
    gap: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
