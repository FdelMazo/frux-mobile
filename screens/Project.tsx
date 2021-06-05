import * as React from "react";
import { StyleSheet } from "react-native";

import { View, ScrollView, MainView } from "../components/Themed";
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
import UserContainer from "../components/UserContainer";

export default function Project(props) {
  return (
    <View>
      <ProjectHeader img="https://static2.cbrimages.com/wordpress/wp-content/uploads/2021/01/batman-1-1940-header.jpg" />

      <ScrollView>
        <MainView>
          <Div w="90%" mt={15}>
            <Div flexDir="row">
              <UserContainer id={7} />

              <Div>
                <Text
                  mx={15}
                  fontSize="5xl"
                  fontFamily="latinmodernroman-bold"
                  fontWeight="bold"
                >
                  {props.route.params.name}
                </Text>
                <Text
                  mx={15}
                  lineHeight={20}
                  fontSize="xl"
                  fontFamily="latinmodernroman-bold"
                  color="gray600"
                >
                  Restoration of old 1940's Batman Comics
                </Text>
              </Div>
            </Div>
          </Div>
        </MainView>
      </ScrollView>
    </View>
  );
}
