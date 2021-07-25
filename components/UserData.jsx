import { gql } from "@apollo/client";
import * as React from "react";
import { Clipboard } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
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
import FruxOverlay from "./FruxOverlay";
export default function Component({ data, isViewer, mutations }) {
  const [firstName, setFirstName] = React.useState(data.user.firstName);
  const [lastName, setLastName] = React.useState(data.user.lastName);
  const [description, setDescription] = React.useState(data.user.description);

  const [basicDataOverlay, setBasicDataOverlay] = React.useState(false);
  const [walletOverlay, setWalletOverlay] = React.useState(false);
  const [walletShown, setWalletShown] = React.useState(false);
  const snackbarRef = React.createRef();

  const [dollarBalance, setDollarBalance] = React.useState(0);
  React.useEffect(() => {
    if (isViewer) return;
    async function dollars() {
      let d = await toDollars(data.user.wallet.balance);
      setDollarBalance(d);
    }
    dollars();
  }, [data.user.wallet.balance]);

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
        <Div row justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Wallet
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="fruxgreen">
            {data.user.wallet.balance} ETH
          </Text>
        </Div>
        <Div row justifyContent="flex-end">
          <Text fontSize="lg" fontWeight="bold" color="gray600">
            ~{dollarBalance} USD
          </Text>
        </Div>

        <Div my="md">
          <Text>
            This is your own personal ethereum wallet address, by adding funds
            onto this address you'll be able to sponsor the different seeds
            throught <Text color="fruxgreen">Frux</Text>.
          </Text>

          <Button
            bg={undefined}
            underlayColor={"none"}
            p={0}
            onPress={() => {
              Clipboard.setString(data.user.wallet.address);
              if (snackbarRef.current && !walletShown) {
                snackbarRef.current.show(
                  "Wallet address copied to clipboard!",
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
              {data.user.wallet.address}
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
    </>
  );
}

Component.fragments = {
  user: gql`
    fragment UserData on User {
      id
      firstName
      lastName
      description
      wallet {
        id
        balance
        address
      }
    }
  `,
};
