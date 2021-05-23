import * as React from "react";
import { StyleSheet } from "react-native";

import { View } from "../components/Themed";
import {
  Icon,
  Input,
  Div,
  Tag,
  Skeleton,
  Text,
  Fab,
  Button,
} from "react-native-magnus";
import { Header } from "../components/Header";
import { TopicContainer } from "../components/TopicContainer";
import { TouchableHighlight } from "react-native-gesture-handler";

export default function Discover({ navigation }) {
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
              suffix={<Icon ml={2} name="close" color="gray700" />}
            >
              In Progress
            </Tag>
            <Tag
              ml="sm"
              bg="blue200"
              borderColor="blue700"
              borderWidth={1}
              suffix={<Icon ml={2} name="close" color="gray700" />}
            >
              Almost Done!
            </Tag>
            <Tag
              ml="sm"
              bg="green200"
              borderColor="green700"
              borderWidth={1}
              suffix={<Icon ml={2} name="close" color="gray700" />}
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
        <Div my={25}>
          <Text fontSize="xl">Recommended Seeds</Text>
          <TouchableHighlight
            onPress={() => {
              navigation.navigate("ProjectScreen", { name: "Batman Comics" });
            }}
            underlayColor="white"
          >
            <Div>
              <Div>
                <Div
                  rounded="xl"
                  h={150}
                  w={250}
                  bgImg={{
                    uri: "https://static2.cbrimages.com/wordpress/wp-content/uploads/2021/01/batman-1-1940-header.jpg",
                  }}
                >
                  <Div
                    bg="pink500"
                    rounded="md"
                    row
                    flexWrap="wrap"
                    px="md"
                    m="lg"
                    alignSelf="flex-start"
                  >
                    <Text color="white" fontSize="sm">
                      In Progress
                    </Text>
                  </Div>
                </Div>
                <Div row alignItems="center">
                  <Div flex={1}>
                    <Text fontWeight="bold" fontSize="xl" mt="sm">
                      Batman Comic
                    </Text>
                    <Text color="gray500" fontSize="sm">
                      Art
                    </Text>
                  </Div>
                  <Div row alignItems="center">
                    <Text color="blue500" fontWeight="bold" fontSize="xl">
                      $500
                    </Text>
                  </Div>
                </Div>
              </Div>
            </Div>
          </TouchableHighlight>
        </Div>
        <Fab shadowColor="none" bg="blue600" h={50} w={50}>
          <Button />
        </Fab>
      </View>
    </>
  );
}
