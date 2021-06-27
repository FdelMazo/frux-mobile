import { ImageSourcePropType } from "react-native";

type IconType = { name: string; fontFamily: any };

interface AppIconType {
  [key: string]: IconType;
}
export const AppIcons: AppIconType = {
  projects: { name: "trees", fontFamily: "Foundation" },
  discover: { name: "seedling", fontFamily: "FontAwesome5" },
  "seed-outline": {
    name: "seed-outline",
    fontFamily: "MaterialCommunityIcons",
  },
  seedling: { name: "seedling", fontFamily: "FontAwesome5" },
  tree: { name: "tree", fontFamily: "Entypo" },
  seed: { name: "seed", fontFamily: "MaterialCommunityIcons" },
  "tree-outline": {
    name: "tree-outline",
    fontFamily: "MaterialCommunityIcons",
  },
};

export const UserIcons: IconType[] = [
  { name: "seed-outline", fontFamily: "MaterialCommunityIcons" },
  { name: "seedling", fontFamily: "FontAwesome5" },
  { name: "tree", fontFamily: "Entypo" },
  { name: "seed", fontFamily: "MaterialCommunityIcons" },
  { name: "tree-outline", fontFamily: "MaterialCommunityIcons" },
];

export const States = {
  CREATED: { name: "Created", color: "pink" },
  IN_PROGRESS: { name: "In Progress", color: "blue" },
  COMPLETE: { name: "Complete", color: "green" },
};

interface ImgType {
  [key: string]: ImageSourcePropType;
}
export const TopicImage: ImgType = {
  Tech: require(`../assets/images/topics/tech.png`),
  Art: require(`../assets/images/topics/art.png`),
  Books: require(`../assets/images/topics/books.png`),
  Film: require(`../assets/images/topics/film.png`),
  Food: require(`../assets/images/topics/food.png`),
  Games: require(`../assets/images/topics/games.png`),
  Music: require(`../assets/images/topics/music.png`),
  Other: require(`../assets/images/topics/other.png`),
};

export const toggler = (arr, setArr, item) => {
  let newArr = [];
  if (arr.includes(item)) {
    newArr = arr.filter((i) => i !== item);
  } else {
    newArr = [...arr, item];
  }
  setArr(newArr);
};
