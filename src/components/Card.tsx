import React, { useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  clamp,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const Card = ({ card, idx, scrollY, activeCardIdx }) => {
  const [cardHeight, setCardHeight] = useState(0);
  const translateY = useSharedValue(0);

  const { height: screenHeight } = useWindowDimensions();

  useAnimatedReaction(
    () => scrollY.value,
    (curr) => {
      translateY.value = clamp(-curr, -idx * cardHeight, 0);
    }
  );

  // Look at active card
  useAnimatedReaction(
    () => activeCardIdx.value,
    (curr, prev) => {
      if (curr === prev) {
        return;
      }

      // No card selected, move to list view
      if (activeCardIdx.value === null) {
        translateY.value = withTiming(clamp(-scrollY.value, -idx * cardHeight, 0));
      } else if (activeCardIdx.value === idx) {
        // This card becomes active
        translateY.value = withTiming(-idx * cardHeight, {
          duration: 300,
          easing: Easing.out(Easing.quad),
        });
      } else {
        // Another card is active, move to the bottom
        translateY.value = withTiming(-idx * cardHeight * 0.9 + screenHeight * 0.5, {
          duration: 300,
          easing: Easing.out(Easing.quad),
        });
      }
    }
  );

  const tap = Gesture.Tap().onEnd(() => {
    if (activeCardIdx.value === null) {
      activeCardIdx.value = idx;
    } else {
      activeCardIdx.value = null;
    }
  });

  return (
    <GestureDetector gesture={tap}>
      <Animated.Image
        key={idx}
        source={card}
        onLayout={(event) => setCardHeight(event.nativeEvent.layout.height + 10)}
        style={[
          styles.image,
          {
            transform: [
              {
                translateY,
              },
            ],
          },
        ]}
      />
    </GestureDetector>
  );
};

export default Card;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 7 / 4,
    marginVertical: 5,
  },
});
