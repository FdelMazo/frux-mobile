import { StackNavigationProp } from "@react-navigation/stack";
import * as Location from "expo-location";
import gql from "graphql-tag";
import * as React from "react";
import { MutationFunction, useMutation, useQuery } from "react-apollo";
import {
  Button,
  Div,
  Dropdown,
  Icon,
  Input,
  Overlay,
  Text,
} from "react-native-magnus";
import MapView, { Marker } from "react-native-maps";
import { resetPassword } from "../auth";
import Header from "../components/Header";
import { MainView, ScrollView, View } from "../components/Themed";
import { UserIcons } from "../constants/Constants";

type Data = {
  user: {
    name: string;
    email: string;
    imagePath: string;
  };
};
type Navigation = StackNavigationProp<any>;

function Screen({
  data,
  navigation,
  mutations,
}: {
  data: Data;
  navigation: Navigation;
  mutations: { mutateName: MutationFunction<any> };
}) {
  const defaultName = data.user.name || data.user.email.split("@")[0];
  const [name, setName] = React.useState(defaultName);
  const [emailSent, setEmailSent] = React.useState(false);
  const dropdownRef = React.createRef();

  const [location, setLocation] = React.useState(null);
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [locationOverlay, setLocationOverlay] = React.useState(false);
  const useCurrentLocation = async () => {
    await Location.requestForegroundPermissionsAsync();
    const userLocation = await Location.getCurrentPositionAsync();
    // @ts-expect-error
    setLocation(userLocation.coords);
  };

  return (
    <View>
      <Header
        onPress={() =>
          // @ts-expect-error
          dropdownRef.current.open()
        }
        navigation={navigation}
        title={defaultName}
        icon={data.user.imagePath || "seed"}
      />

      <ScrollView>
        <MainView></MainView>
      </ScrollView>

      <Dropdown
        // @ts-expect-error
        ref={dropdownRef}
        title={
          <Div alignSelf="center">
            <Div row justifyContent="space-between">
              <Text mb="sm" fontSize="sm">
                {data.user.email}
              </Text>
              <Text
                mb="sm"
                onPress={() => {
                  if (emailSent) return;
                  resetPassword(data.user.email).then(() => setEmailSent(true));
                }}
                color={emailSent ? "black" : "fruxgreen"}
                fontSize="sm"
              >
                {emailSent ? "Mail Sent!" : "Reset password"}
              </Text>
            </Div>
            <Input
              placeholder="Username"
              w="65%"
              focusBorderColor="blue700"
              value={name}
              onChangeText={setName}
              suffix={
                <>
                  {name !== defaultName && (
                    <Button
                      bg={undefined}
                      p={0}
                      onPress={() => {
                        mutations.mutateName({
                          variables: {
                            name,
                          },
                        });
                      }}
                    >
                      <Icon name="check" color="gray900" fontFamily="Feather" />
                    </Button>
                  )}
                </>
              }
            />
            <Div row justifyContent="flex-end">
              <Button
                py="sm"
                px={0}
                bg={undefined}
                color="blue500"
                underlayColor="blue100"
                fontSize="sm"
                onPress={() => {
                  setLocationOverlay(true);
                }}
                suffix={
                  <Icon
                    name="location-outline"
                    fontFamily="Ionicons"
                    fontSize="xl"
                    color="blue600"
                  />
                }
              >
                {location ? "Change Location" : "Set Location"}
              </Button>
            </Div>
          </Div>
        }
        showSwipeIndicator={true}
        roundedTop="xl"
      >
        {/*@ts-expect-error*/}
        <Dropdown.Option justifyContent="space-evenly">
          {UserIcons.map((item) => (
            <Button bg={undefined}>
              <Icon
                bg="fruxbrown"
                h={40}
                w={40}
                rounded="circle"
                name={item.name}
                color="fruxgreen"
                borderWidth={2}
                borderColor={
                  item.name === data.user.imagePath ? "fruxgreen" : "black"
                }
                fontSize="2xl"
                fontFamily={item.fontFamily}
              />
            </Button>
          ))}
        </Dropdown.Option>
      </Dropdown>

      <Overlay visible={locationOverlay}>
        <MapView
          initialRegion={{
            // @ts-expect-error
            latitude: location?.latitude || -34.5723074,
            // @ts-expect-error
            longitude: location?.longitude || -58.4346815,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          style={{ height: 400 }}
          showsUserLocation={true}
          // @ts-expect-error
          onLongPress={(e) => setLocation(e.nativeEvent.coordinate)}
        >
          {location && (
            <Marker
              // @ts-expect-error
              coordinate={location}
            />
          )}
        </MapView>

        <Div my="md" row justifyContent="space-between">
          <Div alignSelf="center">
            <Button
              py={0}
              px={0}
              bg={undefined}
              color="gray800"
              fontSize="md"
              disabled={locationLoading}
              onPress={async () => {
                setLocationLoading(true);
                await useCurrentLocation();
                setLocationLoading(false);
              }}
              prefix={
                <Icon
                  name={locationLoading ? "spinner" : "location-outline"}
                  fontFamily={locationLoading ? "EvilIcons" : "Ionicons"}
                  fontSize="xl"
                  color="gray800"
                />
              }
            >
              Use My Location
            </Button>
          </Div>

          <Div row>
            <Button
              mx="sm"
              fontSize="sm"
              p="md"
              bg={undefined}
              borderWidth={1}
              borderColor="fruxgreen"
              color="fruxgreen"
              onPress={() => {
                setLocationOverlay(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                setLocationOverlay(false);
              }}
              mx="sm"
              fontSize="sm"
              p="md"
              bg="fruxgreen"
              color="white"
            >
              Save
            </Button>
          </Div>
        </Div>
      </Overlay>
    </View>
  );
}

type Props = {
  navigation: Navigation;
  dbId: number;
};

export default function Render(props: Props) {
  const query = gql`
    query User($dbId: Int!) {
      user(dbId: $dbId) {
        id
        name
        email
        imagePath
      }
    }
  `;

  const updateNameMutation = gql`
    mutation mutateUpdateUser($name: String) {
      mutateUpdateUser(name: $name) {
        id
        name
      }
    }
  `;
  const [mutateName] = useMutation(updateNameMutation);

  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.dbId },
  });
  if (error) alert(JSON.stringify(error));
  if (loading) return null;
  return (
    <Screen
      data={data}
      navigation={props.navigation}
      mutations={{ mutateName }}
    />
  );
}
