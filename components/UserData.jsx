import { gql } from "@apollo/client";
import * as React from "react";
import { Clipboard, TouchableOpacity } from "react-native";
import {
  Button,
  Div,
  Icon,
  Input,
  Overlay,
  Snackbar,
  Text,
} from "react-native-magnus";
import { toDollars } from "../services/helpers";
import { getAddressName } from "../services/location";
import FruxOverlay from "./FruxOverlay";
import LocationOverlay from "./LocationOverlay";
export default function Component({ data, isViewer, mutations }) {
  const [firstName, setFirstName] = React.useState(data.user.firstName);
  const [lastName, setLastName] = React.useState(data.user.lastName);
  const [description, setDescription] = React.useState(data.user.description);

  const [basicDataOverlay, setBasicDataOverlay] = React.useState(false);
  const [walletOverlay, setWalletOverlay] = React.useState(false);
  const [walletShown, setWalletShown] = React.useState(false);
  const [privateKeyShown, setPrivateKeyShown] = React.useState(false);
  const snackbarRef = React.createRef();

  const [dollarBalance, setDollarBalance] = React.useState(0);
  React.useEffect(() => {
    if (!isViewer) return;
    async function dollars() {
      let d = await toDollars(data.profile.wallet.balance);
      setDollarBalance(d);
    }
    dollars();
  }, [isViewer, data.profile.wallet.balance]);

  const [location, setLocation] = React.useState({
    latitude: data.user?.latitude,
    longitude: data.user?.longitude,
  });
  const [locationText, setLocationText] = React.useState("");
  const [locationOverlay, setLocationOverlay] = React.useState(false);
  React.useEffect(() => {
    if (!isViewer) return;
    mutations.mutateUpdateUser({
      variables: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  }, [isViewer, location]);

  React.useEffect(() => {
    if (!isViewer) return;
    async function _getAddress() {
      let text = "Set Location";
      if (data.user.latitude) {
        text = await getAddressName({
          latitude: parseFloat(data.user.latitude),
          longitude: parseFloat(data.user.longitude),
        });
      }
      setLocationText(text);
    }
    _getAddress();
  }, [isViewer, data.user.latitude]);

  return (
    <>
      <Div>
        <Div
          row
          mx="lg"
          mb="xs"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          {isViewer && !firstName && !lastName && !description && (
            <TouchableOpacity
              activeOpacity={isViewer ? 0.2 : 1}
              onPress={
                isViewer
                  ? () => {
                      setBasicDataOverlay(true);
                    }
                  : undefined
              }
            >
              <Text
                fontSize="xl"
                fontFamily="latinmodernroman-bold"
                color="gray600"
              >
                Tell us your name!
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={isViewer ? 0.2 : 1}
            onPress={
              isViewer
                ? () => {
                    setBasicDataOverlay(true);
                  }
                : undefined
            }
          >
            <Div row>
              {!!lastName && (
                <Text
                  fontSize="4xl"
                  fontFamily="latinmodernroman-bold"
                  color="fruxgreen"
                >
                  {firstName ? lastName + ", " : lastName}
                </Text>
              )}
              {!!firstName && (
                <Text
                  fontSize="4xl"
                  fontFamily="latinmodernroman-bold"
                  color="fruxbrown"
                >
                  {firstName}
                </Text>
              )}
            </Div>
          </TouchableOpacity>
          <Div>
            {isViewer && (
              <TouchableOpacity
                onPress={() => {
                  setWalletOverlay(true);
                }}
              >
                <Icon
                  name="wallet"
                  color="fruxgreen"
                  fontFamily="AntDesign"
                  h={40}
                  w={40}
                  borderColor="fruxgreen"
                  borderWidth={1}
                  rounded="sm"
                  fontSize="xl"
                  bg="white"
                />
              </TouchableOpacity>
            )}
          </Div>
        </Div>

        <Div mx="lg">
          {!!description && (
            <TouchableOpacity
              activeOpacity={isViewer ? 0.2 : 1}
              onPress={
                isViewer
                  ? () => {
                      setBasicDataOverlay(true);
                    }
                  : undefined
              }
            >
              <Text
                lineHeight={20}
                fontSize="xl"
                fontFamily="latinmodernroman-bold"
                color="gray600"
              >
                {description}
              </Text>
            </TouchableOpacity>
          )}
        </Div>

        {isViewer && (
          <Div row justifyContent="flex-start">
            <Button
              py="sm"
              bg={undefined}
              color="blue500"
              underlayColor="blue100"
              fontSize="sm"
              onPress={() => {
                setLocationOverlay(true);
              }}
              prefix={
                <Icon
                  name="location-outline"
                  fontFamily="Ionicons"
                  fontSize="xl"
                  color="blue600"
                />
              }
            >
              {locationText}
            </Button>
          </Div>
        )}
      </Div>

      <FruxOverlay
        visible={basicDataOverlay}
        title="Hi, how are you?"
        body={
          <>
            <Input
              mt="md"
              maxLength={10}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
            />
            <Input
              mt="md"
              maxLength={10}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
            />
            <Input
              mt="md"
              multiline
              maxLength={124}
              numberOfLines={3}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
            />
          </>
        }
        success={{
          action: () => {
            mutations.mutateUpdateUser({
              variables: {
                firstName,
                lastName,
                description,
              },
            });
            setBasicDataOverlay(false);
          },
        }}
      />

      <Overlay visible={walletOverlay}>
        <Div row justifyContent="space-between" alignItems="center">
          <Div row>
            <Icon
              name="ethereum"
              fontFamily="MaterialCommunityIcons"
              color="gray900"
              fontSize="2xl"
            />
            <Text fontSize="xl" fontWeight="bold">
              Wallet
            </Text>
          </Div>
          <Text fontSize="xl" fontWeight="bold" color="fruxgreen">
            {data.profile.wallet.balance} ETH
          </Text>
        </Div>
        <Div row justifyContent="flex-end">
          <Text fontSize="lg" fontWeight="bold" color="gray600">
            ~{dollarBalance} USD
          </Text>
        </Div>

        <Div my="md">
          {privateKeyShown ? (
            <Text>
              This is your own personal ethereum wallet{" "}
              <Text fontWeight="bold">private</Text> key. The keyword in here is{" "}
              <Text fontWeight="bold">private</Text>. You should never, never,
              and I really mean never share this key with anyone. Not even your
              mum.
            </Text>
          ) : (
            <Text>
              This is your own personal ethereum wallet address, by adding funds
              onto this address you'll be able to sponsor the different seeds
              throught <Text color="fruxgreen">Frux</Text>.
            </Text>
          )}

          <Button
            bg={undefined}
            underlayColor={"none"}
            p={0}
            onPress={() => {
              if (privateKeyShown)
                Clipboard.setString(data.profile.walletPrivateKey);
              else Clipboard.setString(data.profile.walletAddress);
              if (snackbarRef.current && !walletShown) {
                snackbarRef.current.show(
                  `${
                    privateKeyShown ? "Private key" : "Wallet address"
                  } copied to clipboard!`,
                  {
                    duration: 2000,
                  }
                );
                setWalletShown(true);
                setTimeout(() => {
                  setWalletShown(false);
                }, 2500);
              }
            }}
          >
            <Text
              fontFamily="monospace"
              m="lg"
              color="fruxgreen"
              bg="#1b1d23"
              rounded="sm"
              p="sm"
            >
              {privateKeyShown
                ? data.profile.walletPrivateKey
                : data.profile.walletAddress}
            </Text>
          </Button>

          <Button
            bg={undefined}
            underlayColor={"none"}
            p={0}
            onPress={() => {
              setPrivateKeyShown(!privateKeyShown);
            }}
          >
            <Icon
              name={privateKeyShown ? "wallet" : "key"}
              fontFamily={privateKeyShown ? "AntDesign" : "Foundation"}
              mx="xs"
              color="gray800"
            />
            <Text>
              Show {privateKeyShown ? "Wallet Address" : "Private Key"}
            </Text>
          </Button>
        </Div>
        <Snackbar
          ref={snackbarRef}
          bg={undefined}
          fontSize="xs"
          color="fruxgreen"
        />
        <Div row alignSelf="flex-end">
          <Button
            onPress={() => {
              setWalletOverlay(false);
            }}
            mx="sm"
            p="md"
            bg="fruxgreen"
            color="white"
          >
            Done
          </Button>
        </Div>
      </Overlay>

      <LocationOverlay
        location={location}
        setLocation={setLocation}
        visible={locationOverlay}
        setVisible={setLocationOverlay}
      />
    </>
  );
}

Component.fragments = {
  user: gql`
    fragment UserData_user on User {
      id
      firstName
      lastName
      description
      latitude
      longitude
    }
  `,
  profile: gql`
    fragment UserData_profile on User {
      id
      walletAddress
      walletPrivateKey
      wallet {
        balance
      }
    }
  `,
};
