import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Div, Icon, Input, Tag } from "react-native-magnus";
import TopicContainer from "../components/TopicContainer";
import { States } from "../constants/Constants";
import { toggler } from "../services/helpers";

function Component({ setFilters, data }) {
  const [searchText, setSearchText] = React.useState("");
  const [searchLocation, setSearchLocation] = React.useState(false);
  const [progressFilters, setProgressFilters] = React.useState([]);
  const [topicsFilter, setTopicsFilter] = React.useState([]);

  React.useEffect(() => {
    topicsFilter.length
      ? setFilters({ categoryNameIn: topicsFilter })
      : setFilters({});
  }, [searchText, searchLocation, progressFilters, topicsFilter]);

  return (
    <Div mt="xl" alignItems="center">
      <Div w="65%" row alignItems="center">
        <Input
          placeholder="Search"
          focusBorderColor="blue700"
          value={searchText}
          onChangeText={setSearchText}
          suffix={<Icon name="search" color="gray900" fontFamily="Feather" />}
        />
        <TouchableOpacity onPress={() => setSearchLocation(!searchLocation)}>
          <Icon
            m="sm"
            fontSize="3xl"
            name={searchLocation ? "location-sharp" : "location-outline"}
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
              onPress={() => toggler(progressFilters, setProgressFilters, name)}
            >
              <Tag
                mx="sm"
                bg={progressFilters.includes(name) ? color + 300 : color + 100}
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
    </Div>
  );
}

export default function Render(props) {
  const query = gql`
    query DiscoverFilter {
      allCategories {
        edges {
          node {
            name
          }
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(query);
  if (error) alert(JSON.stringify(error));
  if (loading) return null;
  return <Component data={data} {...props} />;
}
