import { ImageSourcePropType } from "react-native";

type IconType = { name: string; fontFamily: any };

interface AppIconType {
  [key: string]: IconType;
}
export const AppIcons: AppIconType = {
  projects: { name: "trees", fontFamily: "Foundation" },
  seed: { name: "seed-outline", fontFamily: "MaterialCommunityIcons" },
  discover: { name: "seedling", fontFamily: "FontAwesome5" },
};

export const UserIcons: IconType[] = [
  { name: "seed-outline", fontFamily: "MaterialCommunityIcons" },
  { name: "seedling", fontFamily: "FontAwesome5" },
  { name: "tree", fontFamily: "Entypo" },
  { name: "seed", fontFamily: "MaterialCommunityIcons" },
  { name: "tree-outline", fontFamily: "MaterialCommunityIcons" },
];

interface StageColorType {
  [key: string]: string;
}
export const StageColor: StageColorType = {
  CREATED: "pink500",
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
