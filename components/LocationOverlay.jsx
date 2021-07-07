import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as React from "react";
import { Button, Div, Icon, Overlay } from "react-native-magnus";
import MapView, { Circle, Marker } from "react-native-maps";
import Colors from "../constants/Colors";
import { DefaultLocation } from "../constants/Constants";
import { useCurrentLocation } from "../services/location";

export default function Component({
  visible,
  setVisible,
  location,
  setLocation,
  radius,
  setRadius,
  canRemove,
}) {
  const [locationLoading, setLocationLoading] = React.useState(false);

  return (
    <Overlay visible={visible}>
      <MapView
        initialRegion={{
          latitude: location.latitude
            ? parseFloat(location.latitude)
            : DefaultLocation.latitude,
          longitude: location.longiutde
            ? parseFloat(location.longitude)
            : DefaultLocation.longitude,
          latitudeDelta: 0.015 * (radius / 1000) || 0.015,
          longitudeDelta: 0.015 * (radius / 1000) || 0.015,
        }}
        style={{ height: 400 }}
        showsUserLocation={true}
        onLongPress={(e) => setLocation(e.nativeEvent.coordinate)}
      >
        {location.latitude && (
          <Marker
            coordinate={{
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            }}
          />
        )}
        {!!location.latitude && !!radius && (
          <Circle
            center={{
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            }}
            radius={radius}
            fillColor={Colors.fruxgreentransparent}
          />
        )}
      </MapView>

      <Div my="md" row justifyContent="space-between">
        <Div alignSelf="center">
          {!!location.latitude && !!radius && (
            <MultiSlider
              selectedStyle={{ backgroundColor: Colors.fruxgreen }}
              markerStyle={{
                backgroundColor: Colors.fruxgreen,
              }}
              values={[radius / 1000]}
              sliderLength={200}
              onValuesChangeFinish={(v) => {
                setRadius(Math.floor(v * 1000));
              }}
              step={3}
              min={1}
              max={55}
            />
          )}
          <Button
            py={0}
            px={0}
            bg={undefined}
            color="gray800"
            fontSize="md"
            disabled={locationLoading}
            onPress={async () => {
              setLocationLoading(true);
              const location = await useCurrentLocation();
              setLocation(location);
              setLocationLoading(false);
            }}
            prefix={
              <Icon
                name={locationLoading ? "spinner" : "my-location"}
                fontFamily={locationLoading ? "EvilIcons" : "MaterialIcons"}
                fontSize="sm"
                mr="xs"
                color="gray800"
              />
            }
          >
            Use My Location
          </Button>
          {canRemove && (
            <Button
              py={0}
              px={0}
              bg={undefined}
              color="gray800"
              fontSize="md"
              disabled={locationLoading}
              onPress={async () => {
                setLocation({ latitude: undefined, longitude: undefined });
              }}
              prefix={
                <Icon
                  name={"location-disabled"}
                  fontFamily={"MaterialIcons"}
                  fontSize="sm"
                  mr="xs"
                  color="gray800"
                />
              }
            >
              Don't Use Location
            </Button>
          )}
        </Div>

        <Div row alignSelf="flex-end">
          <Button
            mx="sm"
            fontSize="sm"
            p="md"
            bg="fruxgreen"
            color="white"
            onPress={() => {
              setVisible(false);
            }}
          >
            Done
          </Button>
        </Div>
      </Div>
    </Overlay>
  );
}
