/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { Icon } from "react-native-magnus";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Profile from "../screens/Profile";
import Discover from "../screens/Discover";
import {
  BottomTabParamList,
  ProfileParamList,
  DiscoverParamList,
} from "../types";
import Project from "../screens/Project";
import User from "../screens/User";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Discover"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Discover"
        component={DiscoverNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="seedling" fontFamily="FontAwesome5" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color }) => <Icon name="user" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

const DiscoverStack = createStackNavigator<DiscoverParamList>();

function DiscoverNavigator() {
  return (
    <DiscoverStack.Navigator>
      <DiscoverStack.Screen
        name="DiscoverScreen"
        component={Discover}
        options={{ headerShown: false }}
      />
      <DiscoverStack.Screen
        name="UserScreen"
        component={User}
        options={{ headerShown: false }}
      />
      <DiscoverStack.Screen
        name="ProjectScreen"
        component={Project}
        options={{ headerShown: false }}
      />
    </DiscoverStack.Navigator>
  );
}

const ProfileStack = createStackNavigator<ProfileParamList>();

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={Profile}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="UserScreen"
        component={User}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="ProjectScreen"
        component={Project}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
}
