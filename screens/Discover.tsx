import * as React from "react";
import { StyleSheet } from "react-native";

import { View, ScrollView, MainView } from "../components/Themed";
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
import { ProjectContainer } from "../components/ProjectContainer";
import { TouchableHighlight } from "react-native-gesture-handler";

export default function Discover({ navigation }) {
  const [searchLocation, setSearchLocation] = React.useState(false);
  const [progressFilters, setProgressFilters] = React.useState({
    inProgress: false,
    almostDone: false,
    complete: false,
  });

  return (
    <View>
      <Header title="Discover" icon="discover" />
      <ScrollView>
        <MainView>
          <Div mt={25} alignItems="center">
            <Div w="65%" flexDir="row" alignItems="center">
              <Input
                placeholder="Search"
                focusBorderColor="blue700"
                suffix={
                  <Icon name="search" color="gray900" fontFamily="Feather" />
                }
              />
              <TouchableHighlight
                underlayColor="white"
                onPress={() => setSearchLocation(!searchLocation)}
              >
                <Icon
                  m={5}
                  fontSize="3xl"
                  name={searchLocation ? "location-sharp" : "location-outline"}
                  color="gray900"
                  fontFamily="Ionicons"
                />
              </TouchableHighlight>
            </Div>
            <Div my={15} flexDir="row">
              <TouchableHighlight
                underlayColor="white"
                onPress={() =>
                  setProgressFilters({
                    inProgress: !progressFilters.inProgress,
                    almostDone: progressFilters.almostDone,
                    complete: progressFilters.complete,
                  })
                }
              >
                <Tag
                  mx={5}
                  bg={progressFilters.inProgress ? "pink300" : "pink100"}
                  borderColor="pink700"
                  borderWidth={1}
                >
                  In Progress
                </Tag>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="white"
                onPress={() =>
                  setProgressFilters({
                    inProgress: progressFilters.inProgress,
                    almostDone: !progressFilters.almostDone,
                    complete: progressFilters.complete,
                  })
                }
              >
                <Tag
                  mx={5}
                  bg={progressFilters.almostDone ? "blue300" : "blue100"}
                  borderColor="blue700"
                  borderWidth={1}
                >
                  Almost Done!
                </Tag>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="white"
                onPress={() =>
                  setProgressFilters({
                    inProgress: progressFilters.inProgress,
                    almostDone: progressFilters.almostDone,
                    complete: !progressFilters.complete,
                  })
                }
              >
                <Tag
                  mx={5}
                  bg={progressFilters.complete ? "green300" : "green100"}
                  borderColor="green700"
                  borderWidth={1}
                >
                  Complete
                </Tag>
              </TouchableHighlight>
            </Div>

            <Div w="90%" row flexWrap="wrap">
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
                img="https://png.pngtree.com/png-vector/20191113/ourmid/pngtree-one-line-drawing-of-music-notes-isolated-vector-object-continuous-simplicity-png-image_1987219.jpg"
              />
              <TopicContainer
                name="Music"
                img="https://png.pngtree.com/png-vector/20191113/ourmid/pngtree-one-line-drawing-of-music-notes-isolated-vector-object-continuous-simplicity-png-image_1987219.jpg"
              />
              <TopicContainer
                name="Music"
                img="https://png.pngtree.com/png-vector/20191113/ourmid/pngtree-one-line-drawing-of-music-notes-isolated-vector-object-continuous-simplicity-png-image_1987219.jpg"
              />
              <TopicContainer
                name="Music"
                img="https://png.pngtree.com/png-vector/20191113/ourmid/pngtree-one-line-drawing-of-music-notes-isolated-vector-object-continuous-simplicity-png-image_1987219.jpg"
              />
              <TopicContainer
                name="Music"
                img="https://png.pngtree.com/png-vector/20191113/ourmid/pngtree-one-line-drawing-of-music-notes-isolated-vector-object-continuous-simplicity-png-image_1987219.jpg"
              />
            </Div>
          </Div>
          <Div my={15}>
            <Div row>
              <Icon
                color="gray800"
                fontSize="3xl"
                name="caretleft"
                fontFamily="AntDesign"
              />
              <Div>
                <Text fontSize="xl" fontWeight="bold" mb={5}>
                  Recommended Seeds
                </Text>
                <ProjectContainer navigation={navigation} />
              </Div>
              <Icon
                color="gray800"
                fontSize="3xl"
                name="caretright"
                fontFamily="AntDesign"
              />
            </Div>
          </Div>
        </MainView>
      </ScrollView>
    </View>
  );
}
