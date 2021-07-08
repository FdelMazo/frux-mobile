import * as React from "react";
import { Image } from "react-native-magnus";

const pictures = {
  star: require("../assets/images/star.png"),
  "half-star": require("../assets/images/half-star.png"),
  "no-star": require("../assets/images/no-star.png"),
};

const ratingsPictures = {
  0: ["no-star", "no-star", "no-star", "no-star", "no-star"],
  0.5: ["half-star", "no-star", "no-star", "no-star", "no-star"],
  1: ["star", "no-star", "no-star", "no-star", "no-star"],
  1.5: ["star", "half-star", "no-star", "no-star", "no-star"],
  2: ["star", "star", "no-star", "no-star", "no-star"],
  2.5: ["star", "star", "half-star", "no-star", "no-star"],
  3: ["star", "star", "star", "no-star", "no-star"],
  3.5: ["star", "star", "star", "half-star", "no-star"],
  4: ["star", "star", "star", "star", "no-star"],
  4.5: ["star", "star", "star", "star", "half-star"],
  5: ["star", "star", "star", "star", "star"],
};

const Component = ({ rating, size }) => {
  return ratingsPictures[rating].map((imgname, i) => (
    <Image key={i} mx="xs" w={size} h={size} source={pictures[imgname]} />
  ));
};

export default Component;
