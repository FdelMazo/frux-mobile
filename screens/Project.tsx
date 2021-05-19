import * as React from "react";
import { StyleSheet } from "react-native";

import { View } from "../components/Themed";
import {
  Icon,
  Avatar,
  Div,
  Tag,
  Skeleton,
  Text,
  Fab,
  Button,
} from "react-native-magnus";
import { ProjectHeader } from "../components/ProjectHeader";
import { TopicContainer } from "../components/TopicContainer";
import { TouchableHighlight } from "react-native-gesture-handler";
import ProgressBar from "react-native-progress-bar-modest";

export default function Project(props) {
  return (
    <>
      <ProjectHeader img="https://static2.cbrimages.com/wordpress/wp-content/uploads/2021/01/batman-1-1940-header.jpg" />
      <View>
        <Div w="90%" mt={15}>
          <Div flexDir="row" alignSelf="flex-start">
            <Avatar size={60} bg="red300" color="red800">
              FdM
            </Avatar>
            <Div>
              <Text
                ml={15}
                fontSize="6xl"
                fontFamily="latinmodernroman-bold"
                fontWeight="bold"
              >
                {props.route.params.name}
              </Text>
              <Text
                ml={15}
                fontSize="2xl"
                color="gray600"
                fontFamily="latinmodernroman-bold"
              >
                Restoration of old 1940's Batman Comics
              </Text>
              <Div m={15}>
                <ProgressBar
                  reachedBarColor="#5E8AAD"
                  reachedBarHeight={20}
                  unreachedBarColor="#ff4c4c"
                  unreachedBarHeight={20}
                  value={70}
                  showValue={false}
                  borderRadius={5}
                />
                <Text fontSize="2xl">$500 out of ...</Text>
              </Div>
            </Div>
          </Div>
        </Div>
      </View>
    </>
  );
}
