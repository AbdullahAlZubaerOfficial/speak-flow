import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const activeColor = Colors[colorScheme ?? 'light'].tint;
  const inactiveColor = isDark ? '#6B7280' : '#9CA3AF';
  const tabBarBg = isDark ? '#1A1A2E' : '#FFFFFF';
  const borderColor = isDark ? '#2D2D44' : '#F0F0F5';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,

        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 14,
          paddingTop: 8,
          backgroundColor: tabBarBg,
          borderTopWidth: 1,
          borderTopColor: borderColor,

          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: isDark ? 0.35 : 0.1,
              shadowRadius: 10,
            },
            android: {
              elevation: 12,
            },
          }),
        },

        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600',
          marginTop: 2,
        },

        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} activeColor={activeColor}>
              <IconSymbol size={26} name="house.fill" color={color} />
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} activeColor={activeColor}>
              <IconSymbol size={26} name="book.fill" color={color} />
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} activeColor={activeColor}>
              <IconSymbol size={26} name="checkmark.circle.fill" color={color} />
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} activeColor={activeColor}>
              <IconSymbol size={26} name="chatbubble.fill" color={color} />
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="call"
        options={{
          title: 'Calls',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} activeColor={activeColor}>
              <IconSymbol size={26} name="phone.fill" color={color} />
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} activeColor={activeColor}>
              <IconSymbol size={26} name="person.fill" color={color} />
            </TabIcon>
          ),
        }}
      />

      {/* Hidden Screens */}
      <Tabs.Screen name="profile/notifications" options={{ href: null }} />
      <Tabs.Screen name="profile/privacy-settings" options={{ href: null }} />
      <Tabs.Screen name="profile/account-settings" options={{ href: null }} />
      <Tabs.Screen name="profile/help-support" options={{ href: null }} />
      <Tabs.Screen name="profile/more-about" options={{ href: null }} />
      <Tabs.Screen name="screens/CreatePostScreen" options={{ href: null }} />
      <Tabs.Screen name="screens/FriendsScreen" options={{ href: null }} />
      <Tabs.Screen name="screens/HomeScreen" options={{ href: null }} />
      <Tabs.Screen name="screens/ProfileScreen" options={{ href: null }} />
    </Tabs>
  );
}

// ====================== TabIcon Component ======================
function TabIcon({
  focused,
  activeColor,
  children,
}: {
  focused: boolean;
  activeColor: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.iconWrapper}>
      {focused && (
        <View
          style={[
            styles.activeIndicator,
            { backgroundColor: activeColor + '18' },
          ]}
        />
      )}

      {children}


    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 40,
  },
  activeIndicator: {
    position: 'absolute',
    width: 48,
    height: 38,
    borderRadius: 12,
  },

});