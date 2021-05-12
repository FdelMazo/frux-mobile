import * as React from "react";
import { StyleSheet } from "react-native";

import { View } from "../components/Themed";
import { Icon, Input, Div, Tag } from "react-native-magnus";
import { Header } from "../components/Header";
import { TopicContainer } from "../components/TopicContainer";

export default function Discover() {
  return (
    <>
      <Header title="Discover" icon="discover" />
      <View>
        <Div w="65%" mt={25}>
          <Div flexDir="row" alignItems="center" alignSelf="center">
            <Input
              placeholder="Search"
              focusBorderColor="blue700"
              suffix={
                <Icon name="search" color="gray900" fontFamily="Feather" />
              }
            />
            <Icon
              ml={5}
              fontSize="2xl"
              name="location"
              color="gray900"
              fontFamily="Ionicons"
            />
          </Div>
          <Div my={15} flexDir="row" alignItems="center" alignSelf="center">
            <Tag
              ml="sm"
              bg="yellow200"
              borderColor="yellow700"
              borderWidth={1}
              suffix={
                <Icon ml={2} name="close" color="gray700" fontSize="caption" />
              }
            >
              In Progress
            </Tag>
            <Tag
              ml="sm"
              bg="blue200"
              borderColor="blue700"
              borderWidth={1}
              suffix={
                <Icon ml={2} name="close" color="gray700" fontSize="caption" />
              }
            >
              Almost Done!
            </Tag>
            <Tag
              ml="sm"
              bg="green200"
              borderColor="green700"
              borderWidth={1}
              suffix={
                <Icon ml={2} name="close" color="gray700" fontSize="caption" />
              }
            >
              Complete
            </Tag>
          </Div>
          <Div row flexWrap="wrap">
            <TopicContainer
              name="Sports"
              img="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.ReOALncSB413CqN4o51PmQHaIM%26pid%3DApi&f=1"
            />
            <TopicContainer
              name="Tech"
              img="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvectors%2Fcogwheel-gear-mechanism-icon-black-minimalist-icon-isolated-on-white-vector-id858148342%3Fk%3D6%26m%3D858148342%26s%3D170667a%26w%3D0%26h%3D9IjQ2MmVS2a0MS8qNQR-l4Gz5foaX1ILVtlYmp6DMak%3D&f=1&nofb=1"
            />
            <TopicContainer
              name="Art"
              img="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Fpng-vector%2F20190115%2Fourlarge%2Fpngtree-paint-brush-vector-with-one-line-art-drawing-illustration-minimalist-style-png-image_316254.jpg&f=1&nofb=1"
            />
            <TopicContainer
              name="Music"
              img="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fone-line-drawing-piano-music-instrument-vector-illustration-minimalist-design-musical-art-isolated-sketch-musician-concept-158868025.jpg&f=1&nofb=1"
            />
          </Div>
        </Div>
      </View>
    </>
  );
}
