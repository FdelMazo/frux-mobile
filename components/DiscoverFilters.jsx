import { gql } from "@apollo/client";
import * as React from "react";
import DelayInput from "react-native-debounce-input";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Div, Icon, Tag } from "react-native-magnus";
import LocationOverlay from "../components/LocationOverlay";
import TopicContainer from "../components/TopicContainer";
import { States } from "../constants/Constants";
import { toggler } from "../services/helpers";

export default function Component({ data, isLogged, refetchSeeds }) {
  const [searchText, setSearchText] = React.useState("");
  const [progressFilters, setProgressFilters] = React.useState([]);
  const [topicsFilter, setTopicsFilter] = React.useState([]);

  const [radius, setRadius] = React.useState(10000);
  const [location, setLocation] = React.useState({
    latitude: undefined,
    longitude: undefined,
  });
  const [locationOverlay, setLocationOverlay] = React.useState(false);

  React.useEffect(() => {
    let hashtags = [];
    let nonHashtagWords = [];
    searchText
      .trim()
      .split(" ")
      .forEach((w) => {
        w[0] === "#"
          ? hashtags.push(w.substr(1).toLowerCase())
          : nonHashtagWords.push(w);
      });
    const nameAndDescription = "%" + nonHashtagWords.join("%") + "%";

    const filters = {
      categoryNameIn: (topicsFilter.length && topicsFilter) || undefined,
      currentStateIn: (progressFilters.length && progressFilters) || undefined,
      isCloserThan:
        (!!location.latitude && [
          location.latitude,
          location.longitude,
          radius / 1000 || 10,
        ]) ||
        undefined,
      or:
        (nameAndDescription && [
          { or: [{ nameIlike: nameAndDescription }] },
          {
            or: [{ descriptionIlike: nameAndDescription }],
          },
        ]) ||
        undefined,
      hasHashtag: (hashtags.length && hashtags) || undefined,
    };

    refetchSeeds(filters);
  }, [searchText, location, radius, progressFilters, topicsFilter]);

  return (
    <Div mt="xl" alignItems="center">
      <Div w="65%" row alignItems="center">
        {isLogged && (data.profile.latitude || data.profile.interests) && (
          <TouchableOpacity
            onPress={() => {
              if (data.profile.latitude) {
                setLocation({
                  latitude: data.profile.latitude,
                  longitude: data.profile.longitude,
                });
                setRadius(10000);
              }
              if (data.profile.interests.edges.length) {
                setTopicsFilter(
                  data.profile.interests.edges.map((n) => n.node.name)
                );
              }
            }}
          >
            <Icon
              m="sm"
              fontSize="3xl"
              color="fruxgreen"
              name="color-wand"
              fontFamily="Ionicons"
            />
          </TouchableOpacity>
        )}

        <DelayInput
          placeholder="Search"
          value={searchText}
          minLength={3}
          onChangeText={setSearchText}
          delayTimeout={500}
          style={{
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 3,
            width: "80%",
          }}
        />
        <TouchableOpacity onPress={() => setLocationOverlay(true)}>
          <Icon
            m="sm"
            fontSize="3xl"
            name={!!location.latitude ? "location-sharp" : "location-outline"}
            color="gray900"
            fontFamily="Ionicons"
          />
        </TouchableOpacity>
      </Div>

      <Div my="lg" flexDir="row">
        {Object.keys(States).map((k) => {
          const { name, color } = States[k];
          return (
            <TouchableOpacity
              key={name}
              onPress={() => toggler(progressFilters, setProgressFilters, k)}
            >
              <Tag
                mx="xs"
                fontSize="md"
                bg={progressFilters.includes(k) ? color + 300 : color + 100}
                borderColor={color + 700}
                borderWidth={1}
              >
                {name}
              </Tag>
            </TouchableOpacity>
          );
        })}
      </Div>
      <Div w="90%" row my="md" flexWrap="wrap">
        {data.allCategories.edges.map((item) => (
          <Button
            key={item.node.name}
            bg={undefined}
            p={0}
            underlayColor="fruxgreen"
            onPress={() => {
              toggler(topicsFilter, setTopicsFilter, item.node.name);
            }}
          >
            <TopicContainer
              active={topicsFilter.includes(item.node.name)}
              key={item.node.name}
              showName={true}
              name={item.node.name}
            />
          </Button>
        ))}
      </Div>

      <LocationOverlay
        location={location}
        setLocation={setLocation}
        visible={locationOverlay}
        setVisible={setLocationOverlay}
        radius={radius}
        setRadius={setRadius}
        canRemove={true}
      />
    </Div>
  );
}

Component.fragments = {
  allCategories: gql`
    fragment DiscoverFilters_allCategories on CategoryConnection {
      edges {
        node {
          id
          name
        }
      }
    }
  `,
  user: gql`
    fragment DiscoverFilters_user on User {
      id
      longitude
      latitude
      interests {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `,
};
