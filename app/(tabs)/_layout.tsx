import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Icon and label mappings
const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home',
  stepcounter: 'barbell',
};

const labelMap: Record<string, string> = {
  index: 'Home',
  stepcounter: 'Step Counter',
};

// Always show icon, but change color on focus
type TabIconProps = {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

const TabIcon = ({ focused, icon }: TabIconProps) => {
  return (
    <View style={styles.tabIconDefault}>
      <Ionicons
        name={icon}
        size={30}
        color={focused ? '#ffffff' : '#A8B5DB'}
        style={{ paddingBottom: 2 }}
      />
    </View>
  );
};

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }: { route: { name: string } }) => ({
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#cccccc',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          height: 100,
          paddingBottom: 5,
          paddingTop: 12,
          backgroundColor: '#000000',
        },
        headerShown: false,
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <TabIcon focused={focused} icon={iconMap[route.name] ?? 'apps'} />
        ),
        tabBarLabel: labelMap[route.name] ?? route.name,
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="stepcounter" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconDefault: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    borderRadius: 10,
  },
});
