import { View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  withDecay,
  useSharedValue,
  cancelAnimation,
  clamp,
  withClamp,
} from "react-native-reanimated";
import Card from "./Card";
import { useState } from "react";

const cards = [
  require("../../assets/cards/Card 1.png"),
  require("../../assets/cards/Card 2.png"),
  require("../../assets/cards/Card3.png"),
  require("../../assets/cards/Card 4.png"),
  require("../../assets/cards/Card 5.png"),
  require("../../assets/cards/Card 6.png"),
  require("../../assets/cards/Card 7.png"),
  require("../../assets/cards/Card 8.png"),
  require("../../assets/cards/Card 9.png"),
];

const CardsList = () => {
  const [listHeight, setListHeight] = useState(0);
  const { height: screenHeight } = useWindowDimensions();

  const activeCardIdx = useSharedValue(null);
  const scrollY = useSharedValue(0);
  const maxScrollY = listHeight - screenHeight + 70;

  const pan = Gesture.Pan()
    .onBegin(() => {
      cancelAnimation(scrollY);
    })
    .onStart(() => {})
    .onChange((event) => {
      scrollY.value = clamp(scrollY.value - event.changeY, 0, maxScrollY);
    })
    .onEnd((event) => {
      scrollY.value = withClamp(
        { min: 0, max: maxScrollY },
        withDecay({ velocity: -event.velocityY })
      );
    });

  return (
    <GestureDetector gesture={pan}>
      <View
        style={{ padding: 10 }}
        onLayout={(event) => setListHeight(event.nativeEvent.layout.height)}
      >
        {cards.map((card, idx) => (
          <Card card={card} idx={idx} scrollY={scrollY} activeCardIdx={activeCardIdx} />
        ))}
      </View>
    </GestureDetector>
  );
};

export default CardsList;
