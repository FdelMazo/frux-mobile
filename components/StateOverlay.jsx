import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";
import { States } from "../constants/Constants";
import FruxOverlay from "./FruxOverlay";

export default function Component({ visible, setVisible }) {
  const [selected, setSelected] = React.useState("CREATED");
  const description = {
    CREATED:
      "A project that was just created and is still refining it's stages and end goal. You can look around or fav it for later, but you can't invest on it.",
    FUNDING:
      "A project that has finally set it's goal and is now looking for investors. After the project is complete, the investors will get a piece of the pie in shape of product samples.",
    IN_PROGRESS:
      "A project that has all of it's funding covered and is now being actively developed. The project creator and the project supervisor are in constant talks to get the best out of the promised ware.",
    COMPLETE:
      "A project that has finished it's development and is now doing the final touches to get the wares to the investors, who get an initial sample of the products as per their agreement.",
  };

  return (
    <FruxOverlay
      visible={visible}
      title="Frux States"
      body={
        <>
          <Div row justifyContent="space-around" flexWrap="wrap">
            {Object.keys(States).map((s) => (
              <TouchableOpacity onPress={() => setSelected(s)} key={s}>
                <Div
                  bg={selected === s ? States[s].color + "500" : undefined}
                  borderColor={States[s].color}
                  borderWidth={1}
                  rounded="md"
                  px="xs"
                >
                  <Text
                    color={selected === s ? "white" : States[s].color}
                    fontSize="sm"
                  >
                    {States[s].name.toUpperCase()}
                  </Text>
                </Div>
              </TouchableOpacity>
            ))}
          </Div>

          <Div
            p="sm"
            m="md"
            borderColor={States[selected].color}
            borderWidth={1}
            rounded="md"
            justifyContent="center"
            alignItems="center"
          >
            <Text textAlign="center">{description[selected]}</Text>
          </Div>
        </>
      }
      success={{
        title: "Close",
        action: () => {
          setVisible(false);
        },
      }}
    />
  );
}
