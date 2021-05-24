import * as React from "react";

import { View, ScrollView, MainView } from "../components/Themed";
import {
  Button,
  Div,
  Text,
  Input,
  Skeleton,
  Dropdown,
  Icon,
  Badge,
  Snackbar,
} from "react-native-magnus";
import { loggingOut, resetPassword } from "../auth";
import { Header } from "../components/Header";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { TopicContainer } from "../components/TopicContainer";

const User = ({ data }) => {
  if (!data.profile) return <></>;
  const [emailSent, setEmailSent] = React.useState(false);
  const dropdownRef = React.createRef();

  return (
    <View>
      <Header
        onPress={() => dropdownRef.current.open()}
        title={data.profile.username || data.profile.email}
        icon={data.profile.picture || "seed"}
      />

      <ScrollView>
        <MainView></MainView>
      </ScrollView>

      <Dropdown
        ref={dropdownRef}
        title={
          <Div alignSelf="center">
            <Input placeholder="Username" w="65%" focusBorderColor="blue700" />
            <Div flexDir="row" justifyContent="space-between">
              <Text mt={10} fontSize="sm">
                {data.profile.email}
              </Text>
              <Text
                mt={10}
                onPress={() => {
                  if (emailSent) return;
                  resetPassword(data.profile.email).then(() =>
                    setEmailSent(true)
                  );
                }}
                textAlign="right"
                color={emailSent ? "black" : "fruxgreen"}
                fontSize="sm"
              >
                {emailSent ? "Mail Sent!" : "Reset password"}
              </Text>
            </Div>
          </Div>
        }
        showSwipeIndicator={true}
        roundedTop="xl"
      >
        <Dropdown.Option justifyContent="space-evenly">
          <Button bg={undefined}>
            <Icon
              bg="fruxbrown"
              h={40}
              w={40}
              rounded="circle"
              name={"seed-outline"}
              color="fruxgreen"
              borderWidth={2}
              borderColor="fruxgreen"
              fontSize="2xl"
              fontFamily={"MaterialCommunityIcons"}
            />
          </Button>
          <Button bg={undefined}>
            <Icon
              bg="fruxbrown"
              h={40}
              w={40}
              rounded="circle"
              name={"seedling"}
              color="fruxgreen"
              borderWidth={2}
              fontSize="2xl"
              fontFamily={"FontAwesome5"}
            />
          </Button>
          <Button bg={undefined}>
            <Icon
              bg="fruxbrown"
              h={40}
              w={40}
              rounded="circle"
              name={"tree"}
              color="fruxgreen"
              borderWidth={2}
              fontSize="2xl"
              fontFamily={"Entypo"}
            />
          </Button>
          <Button bg={undefined}>
            <Icon
              bg="fruxbrown"
              h={40}
              w={40}
              rounded="circle"
              name={"seed"}
              color="fruxgreen"
              borderWidth={2}
              fontSize="2xl"
              fontFamily={"MaterialCommunityIcons"}
            />
          </Button>
          <Button bg={undefined}>
            <Icon
              bg="fruxbrown"
              h={40}
              w={40}
              rounded="circle"
              name={"tree-outline"}
              color="fruxgreen"
              borderWidth={2}
              fontSize="2xl"
              fontFamily={"MaterialCommunityIcons"}
            />
          </Button>
        </Dropdown.Option>
      </Dropdown>
    </View>
  );
};

export default function RenderUser(props: any) {
  const query = gql`
    query Profile {
      profile {
        id
        email
      }
    }
  `;
  const UserScreenRender = graphql(query)(User);

  return <UserScreenRender {...props} />;
}
