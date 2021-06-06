import gql from "graphql-tag";
import * as React from "react";
import { useMutation, useQuery } from "react-apollo";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import {
  Button,
  Div,
  Dropdown,
  Icon,
  Input,
  Overlay,
  Text,
} from "react-native-magnus";
import { resetPassword } from "../auth";
import { Header } from "../components/Header";
import { MainView, ScrollView, View } from "../components/Themed";

const User = ({ data, mutations, navigation }) => {
  const defaultName = data.user.name || data.user.email.split("@")[0];
  const [name, setName] = React.useState(defaultName);
  const [emailSent, setEmailSent] = React.useState(false);
  const dropdownRef = React.createRef();

  const [location, setLocation] = React.useState(null);
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [locationOverlay, setLocationOverlay] = React.useState(false);
  const useCurrentLocation = async () => {
    await Location.requestForegroundPermissionsAsync();
    const userLocation = await Location.getCurrentPositionAsync({});
    setLocation(userLocation.coords);
  };

  return (
    <View>
      <Header
        onPress={() => dropdownRef.current.open()}
        navigation={navigation}
        title={defaultName}
        icon={data.user.picture || "seed"}
      />

      <ScrollView>
        <MainView></MainView>
      </ScrollView>

      <Dropdown
        ref={dropdownRef}
        title={
          <Div alignSelf="center">
            <Div flexDir="row" justifyContent="space-between">
              <Text mb={5} fontSize="sm">
                {data.user.email}
              </Text>
              <Text
                mb={5}
                onPress={() => {
                  if (emailSent) return;
                  resetPassword(data.user.email).then(() => setEmailSent(true));
                }}
                textAlign="right"
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
                            name: name,
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
            <Div flexDir="row" justifyContent="space-between">
              <Div></Div>
              <Button
                py={5}
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

      <Overlay visible={locationOverlay}>
        <MapView
          initialRegion={{
            latitude: location?.latitude || -34.5723074,
            longitude: location?.longitude || -58.4346815,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          style={{ height: 400 }}
          showsUserLocation={true}
          onLongPress={(e) => setLocation(e.nativeEvent.coordinate)}
        >
          {location && <Marker coordinate={location} />}
        </MapView>

        <Div my={10} row justifyContent="space-between">
          <Div alignSelf="flex-end">
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

          <Div row alignSelf="flex-end">
            <Button
              mx={5}
              fontSize="sm"
              p={8}
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
              mx={5}
              fontSize="sm"
              p={8}
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
};

export default function RenderUser(props) {
  const query = gql`
    query User($dbId: Int!) {
      user(dbId: $dbId) {
        id
        name
        email
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
    variables: { dbId: props.data.profile.dbId },
  });

  if (loading) return null;
  return (
    <User
      data={data}
      navigation={props.navigation}
      mutations={{ mutateName }}
    />
  );
}
