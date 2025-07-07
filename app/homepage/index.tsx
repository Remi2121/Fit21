import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styles from './homepagestyles';

export default function WelcomeScreen() {
  const opacity = useSharedValue(1);
  const router = useRouter();

  // ✅ Function to navigate
  const navigateToTabs = () => {
    router.push('/(tabs)');
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 700 }, (finished) => {
        if (finished) {
          runOnJS(navigateToTabs)(); // navigate after animation
        }
      });
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image
        style={styles.backgroundImage}
        source={require('../../assets/images/logo.png')}
      />

      <View style={styles.HomefirstContainer}>
        {/* Custom Touchable Button */}
        <TouchableOpacity onPress={navigateToTabs} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
