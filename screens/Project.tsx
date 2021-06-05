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
  Collapse,
} from "react-native-magnus";
import { ProjectHeader } from "../components/ProjectHeader";
import UserContainer from "../components/UserContainer";
import { TopicContainer } from "../components/TopicContainer";

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
                <Div row>
                  <Text
                    ml={15}
                    fontSize="5xl"
                    fontFamily="latinmodernroman-bold"
                    fontWeight="bold"
                  >
                    {props.route.params.name}
                  </Text>
                  <Div
                    ml={5}
                    bg="pink500"
                    rounded="md"
                    px="sm"
                    alignSelf="center"
                  >
                    <Text color="white" fontSize="sm">
                      In Progress
                    </Text>
                  </Div>
                </Div>
                <Text
                  mx={15}
                  lineHeight={20}
                  fontSize="xl"
                  fontFamily="latinmodernroman-bold"
                  color="gray600"
                >
                  Restoration of old 1940's Batman Comics
                </Text>
                <Text
                  mx={15}
                  fontSize="md"
                  fontFamily="latinmodernroman-bold"
                  color="blue600"
                >
                  #batman #comics
                </Text>
              </Div>
            </Div>
          </Div>
          <Div row w="90%" mt={25}>
            <Div>
              <Text mx={15} fontSize="5xl" color="fruxgreen">
                $1000
              </Text>
              <Text
                mx={15}
                lineHeight={20}
                fontSize="xl"
                fontFamily="latinmodernroman-bold"
                color="gray600"
              >
                Out of $500000
              </Text>
            </Div>
            <Div></Div>
          </Div>
          <Div w="90%" row justifyContent="center">
            <Collapse w="50%" m={5}>
              <Collapse.Header
                active
                color="gray900"
                fontSize="md"
                p="xl"
                px="none"
                prefix={<Icon name="wallet" mr="md" color="gray400" />}
              >
                13 Sponsors
              </Collapse.Header>
              <Collapse.Body pb="xl">
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                  nobis corporis ut, ex sed aperiam. Debitis, facere! Animi quis
                  laudantium, odio nulla recusandae labore pariatur in, vitae
                  corporis delectus repellendus.
                </Text>
              </Collapse.Body>
            </Collapse>
            <Collapse w="50%" m={5}>
              <Collapse.Header
                active
                color="gray900"
                fontSize="md"
                p="xl"
                px="none"
                prefix={<Icon name="wallet" mr="md" color="gray400" />}
              >
                35 Watchers
              </Collapse.Header>
              <Collapse.Body pb="xl">
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus
                  nobis corporis ut, ex sed aperiam. Debitis, facere! Animi quis
                  laudantium, odio nulla recusandae labore pariatur in, vitae
                  corporis delectus repellendus.
                </Text>
              </Collapse.Body>
            </Collapse>
          </Div>
        </MainView>
      </ScrollView>
    </View>
  );
}
