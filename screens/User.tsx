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
        <MainView>
          <Div w="65%" mt={25}>
            <Div mt={15}>
              <Text fontSize="xl">My Topics</Text>
              <Div row flexWrap="wrap">
                <TopicContainer
                  name="Tech"
                  img="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvectors%2Fcogwheel-gear-mechanism-icon-black-minimalist-icon-isolated-on-white-vector-id858148342%3Fk%3D6%26m%3D858148342%26s%3D170667a%26w%3D0%26h%3D9IjQ2MmVS2a0MS8qNQR-l4Gz5foaX1ILVtlYmp6DMak%3D&f=1&nofb=1"
                />
              </Div>
            </Div>
            <Div mt={15}>
              <Text fontSize="xl">My Projects</Text>
              <Skeleton.Box mt="sm" />
            </Div>
            <Div mt={15}>
              <Text fontSize="xl">My Seedlings</Text>
              <Skeleton.Box mt="sm" />
            </Div>
            <Div mt={15}>
              <Text fontSize="xl">My Favourites</Text>
              <Skeleton.Box mt="sm" />
            </Div>
            <Div mt={15}>
              <Text fontSize="xl">My Location</Text>
              <Skeleton.Box mt="sm" />
            </Div>
          </Div>
        </MainView>
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
