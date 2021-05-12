import * as React from "react";
import { StyleSheet } from "react-native";

import { View } from "../components/Themed";
import { Icon, Input, Div, Tag } from "react-native-magnus";
import { Header } from "../components/Header";

export default function Discover() {
  return (
    <>
      <Header title="Discover" icon="discover" />
      <View>
        <Div w="65%" mt={25}>
          <Div flexDir="row" alignItems="center" alignSelf="flex-start">
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
          <Div my={15} flexDir="row" alignItems="center" alignSelf="flex-start">
            <Tag ml="sm" bg="yellow300" borderColor="yellow700" borderWidth={1}>
              In Progress
            </Tag>
            <Tag ml="sm" bg="blue300" borderColor="blue700" borderWidth={1}>
              Almost Done!
            </Tag>
            <Tag ml="sm" bg="red300" borderColor="red700" borderWidth={1}>
              Complete
            </Tag>
          </Div>
          <Div flex={10} row flexWrap="wrap">
            <Div
              alignItems="center"
              justifyContent="center"
              h={80}
              w={80}
              m={10}
              bg="pink500"
            >
              Sports
            </Div>
            <Div
              alignItems="center"
              justifyContent="center"
              h={80}
              w={80}
              m={10}
              bg="green500"
            >
              Art
            </Div>
            <Div
              alignItems="center"
              justifyContent="center"
              h={80}
              w={80}
              m={10}
              bg="teal500"
            >
              Music
            </Div>
            <Div
              alignItems="center"
              justifyContent="center"
              h={80}
              w={80}
              m={10}
              bg="yellow500"
            >
              Batman
            </Div>
            <Div
              alignItems="center"
              justifyContent="center"
              h={80}
              w={80}
              m={10}
              bg="red500"
            >
              Books
            </Div>
            <Div
              alignItems="center"
              justifyContent="center"
              h={80}
              w={80}
              m={10}
              bg="pink500"
            >
              Sports
            </Div>
            <Div
              alignItems="center"
              justifyContent="center"
              h={80}
              w={80}
              m={10}
              bg="pink500"
            >
              Sports
            </Div>
            <Div
              alignItems="center"
              justifyContent="center"
              h={80}
              w={80}
              m={10}
              bg="pink500"
            >
              Sports
            </Div>
            <Div
              alignItems="center"
              justifyContent="center"
              h={80}
              w={80}
              m={10}
              bg="pink500"
            >
              Sports
            </Div>
            <Div
              alignItems="center"
              justifyContent="center"
              h={80}
              w={80}
              m={10}
              bg="pink500"
            >
              Sports
            </Div>
            <Div
              alignItems="center"
              justifyContent="center"
              h={80}
              w={80}
              m={10}
              bg="pink500"
            >
              Sports
            </Div>
          </Div>
        </Div>
      </View>
    </>
  );
}
