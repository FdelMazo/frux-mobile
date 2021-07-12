import { gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import ProjectData from "../components/ProjectData";
import ProjectFavAndInvest from "../components/ProjectFavAndInvest";
import ProjectHeader from "../components/ProjectHeader";
import { MainView, View } from "../components/Themed";
import { useUser } from "../services/user";
import Error from "./Error";
import Loading from "./Loading";

function Screen({ data, navigation, mutations }) {
  const { user } = useUser();
  const created = React.useMemo(
    () => user && data.project.owner.email === user.email,
    [user]
  );
  // const [sponsorOverlay, setSponsorOverlay] = React.useState(false);
  // const [deleteConfirmation, setDeleteConfirmation] = React.useState("");
  // const [deleteOverlay, setDeleteOverlay] = React.useState(false);
  // const [toSponsor, setToSponsor] = React.useState(0.05 * data.project.goal);

  // const [reviewOverlay, setReviewOverlay] = React.useState(false);
  // const [comment, setComment] = React.useState("");
  // const [rating, setRating] = React.useState(0);

  // const dropdownRef = React.createRef();
  return (
    <View>
      <ProjectHeader
        data={data}
        created={created}
        mutations={mutations}
        navigation={navigation}
      />
      <MainView>
        <ProjectData
          data={data}
          created={created}
          mutations={mutations}
          navigation={navigation}
        />

        <ProjectFavAndInvest
          data={data}
          created={created}
          mutations={mutations}
        />

        {/* <TouchableOpacity onPress={() => setReviewOverlay(true)}>
          <Div row my="lg">
            <StarRating rating={2.5} size={35} />
          </Div>
        </TouchableOpacity> */}

        {/*
        <Div row w="90%" mt="xs" justifyContent="space-between">
          <TouchableOpacity onPress={() => dropdownRef.current.open()}>
            <Div>
              <Text fontSize="lg">
                <Text fontSize="lg" fontWeight="bold">
                  Stage 3:{" "}
                </Text>
                StageName
              </Text>
              <MultiSlider
                selectedStyle={{ backgroundColor: Colors.fruxgreen }}
                touchDimensions={{
                  height: 0,
                  width: 0,
                  borderRadius: 0,
                  slipDisplacement: 0,
                }}
                markerStyle={{
                  borderRadius: 0,
                  width: 7,
                  backgroundColor: Colors.fruxgreen,
                }}
                values={[
                  (data.project.amountCollected / data.project.goal) * 10,
                ]}
                sliderLength={150}
              />
            </Div>
          </TouchableOpacity>
          <Div>
            <Text mx="md" fontSize="5xl" color="fruxgreen" textAlign="right">
              {"$"}
              {data.project.amountCollected}
            </Text>
            <Text
              mx="md"
              lineHeight={20}
              fontSize="xl"
              fontFamily="latinmodernroman-bold"
              color="gray600"
            >
              Out of ${data.project.goal}
            </Text>
          </Div>
        </Div>*/}
      </MainView>

      {/* <Dropdown
        ref={dropdownRef}
        title={
          <Div alignSelf="center" mb="sm">
            <Text fontSize="2xl" fontWeight="bold">
              {data.project.name} - Stages
            </Text>
          </Div>
        }
        showSwipeIndicator={true}
        roundedTop="xl"
      >
        <Dropdown.Option py="lg" px="xl">
          <Text fontSize="xl" fontWeight="bold">
            Stage 1:{" "}
          </Text>
          <Text fontSize="xl">Detective Comics #33</Text>
          <Div position="absolute" right={0}>
            <Text fontSize="xl" fontWeight="bold" color="fruxgreen">
              $700
            </Text>
          </Div>
        </Dropdown.Option>
      </Dropdown> */}

      {/* <Fab bg="fruxgreen" h={40} w={40} p={10} fontSize="2xl">
        {created ? (
          <Button
            my="xs"
            p={0}
            bg={undefined}
            underlayColor="gray"
            alignSelf="flex-end"
            onPress={() => setDeleteOverlay(true)}
          >
            <Div rounded="sm" bg="white" p="sm">
              <Text fontSize="md">Delete</Text>
            </Div>
            <Icon
              name="trash-outline"
              color="fruxred"
              fontFamily="Ionicons"
              h={45}
              w={45}
              fontSize="2xl"
              rounded="circle"
              ml="lg"
              bg="white"
            />
          </Button>
        ) : (
          <>
            <Button
              my="xs"
              p={0}
              bg={undefined}
              underlayColor="gray"
              alignSelf="flex-end"
              onPress={() => setSponsorOverlay(true)}
            >
              <Div rounded="sm" bg="white" p="sm">
                <Text fontSize="md">Seed</Text>
              </Div>
              <Icon
                name="wallet"
                color="fruxgreen"
                fontFamily="AntDesign"
                h={45}
                w={45}
                fontSize="xl"
                rounded="circle"
                ml="lg"
                bg="white"
              />
            </Button>
            <Button
              my="xs"
              p={0}
              bg={undefined}
              underlayColor="gray"
              alignSelf="flex-end"
            >
              <Div rounded="sm" bg="white" p="sm">
                <Text fontSize="md">Fav</Text>
              </Div>
              <Icon
                name="hearto"
                color="fruxgreen"
                fontSize="xl"
                fontFamily="AntDesign"
                h={45}
                w={45}
                rounded="circle"
                ml="lg"
                bg="white"
              />
            </Button>
          </>
        )}
      </Fab> */}

      {/* <Overlay visible={sponsorOverlay}>
        <Text fontSize="xl" fontWeight="bold">
          How much do you want to chip in?
        </Text>
        <Div alignSelf="center">
          <MultiSlider
            selectedStyle={{ backgroundColor: Colors.fruxgreen }}
            enabledOne={false}
            markerStyle={{
              borderRadius: 0,
              width: 7,
              backgroundColor: Colors.fruxgreen,
            }}
            values={[
              Math.floor(
                (data.project.amountCollected / data.project.goal) * 10
              ),
              Math.floor(
                ((data.project.amountCollected + toSponsor) /
                  data.project.goal) *
                  10
              ),
            ]}
            onValuesChange={(v) => {
              setToSponsor(
                Math.floor(
                  v[1] * 0.1 * data.project.goal - data.project.amountCollected
                )
              );
            }}
            step={0.5}
            sliderLength={250}
          />
        </Div>
        <Div>
          <Div row>
            <Text mx="md" fontSize="5xl" color="gray600">
              {"$"}
              {data.project.amountCollected}
            </Text>
            <Text mx="md" fontSize="5xl" color="fruxgreen">
              {"+ $"}
              {toSponsor}
            </Text>
          </Div>

          <Text
            mx="md"
            lineHeight={20}
            fontSize="xl"
            fontFamily="latinmodernroman-bold"
            color="gray600"
          >
            With a goal of ${data.project.goal}
          </Text>
        </Div>
        <Div row alignSelf="flex-end">
          <Button
            mx="sm"
            fontSize="sm"
            p="md"
            bg={undefined}
            borderWidth={1}
            borderColor="fruxgreen"
            color="fruxgreen"
            onPress={() => {
              setSponsorOverlay(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={() => {
              mutations.invest({
                variables: {
                  investedAmount: toSponsor,
                  idProject: data.project.dbId,
                },
              });
              setSponsorOverlay(false);
            }}
            mx="sm"
            fontSize="sm"
            p="md"
            bg="fruxgreen"
            color="white"
          >
            Seed
          </Button>
        </Div>
      </Overlay>

      <Overlay visible={reviewOverlay}>
        <Text fontSize="xl" fontWeight="bold">
          Reviews
        </Text>
        <Div>
          <Div row justifyContent="space-between" my="xs">
            <Text color="fruxgreen">Ringo</Text>

            <Div alignSelf="flex-end" row>
              <StarRating rating={5} size={10} />
            </Div>
          </Div>
          <Text
            borderColor="fruxgreen"
            borderLeftWidth={2}
            ml="xs"
            mb="sm"
            pl="md"
          >
            Esta ensalada de papas tiene toda la pinta. En las fotos parece que
            tiene... mayonesa? Siento que va a ser la mejor ensalada de papas de
            la historia
          </Text>
        </Div>

        <Div>
          <Div row justifyContent="space-between" my="xs">
            <Text color="fruxgreen">John</Text>

            <Div alignSelf="flex-end" row>
              <StarRating rating={4} size={10} />
            </Div>
          </Div>
          <Text
            borderColor="fruxgreen"
            borderLeftWidth={2}
            ml="xs"
            mb="sm"
            pl="md"
          >
            OH MY FREAKING GOD. If you are not trying this salad tonight, you
            are missing on everything that's good for you. I did find it a
            little bit extra on the potatoes, though, you feel me?
          </Text>
        </Div>

        <Div>
          <Text fontWeight="bold" mt="sm">
            Leave your review
          </Text>
          <Div row justifyContent="space-between">
            <Input
              w="60%"
              my="md"
              value={comment}
              onChangeText={setComment}
              placeholder="Review"
            />
            <Div alignSelf="center">
              <Button
                bg={undefined}
                onPress={() => {
                  if (rating === 5) setRating(0);
                  else setRating(rating + 0.5);
                }}
              >
                <Div row alignSelf="center">
                  <StarRating rating={rating} size={12} />
                </Div>
              </Button>
            </Div>
          </Div>
        </Div>

        <Div row alignSelf="flex-end" mt="sm">
          <Button
            mx="sm"
            p="md"
            bg={undefined}
            borderWidth={1}
            borderColor="fruxgreen"
            color="fruxgreen"
            onPress={() => {
              setReviewOverlay(false);
            }}
          >
            Close
          </Button>
          <Button
            onPress={() => {
              if (!rating || !comment) return;
              alert("Mock review action");
              setReviewOverlay(false);
            }}
            mx="sm"
            p="md"
            bg="fruxgreen"
            color="white"
          >
            Review
          </Button>
        </Div>
      </Overlay> */}
    </View>
  );
}

export default function Render(props) {
  const query = gql`
    query Project($dbId: Int!, $isLogged: Boolean!) {
      profile @include(if: $isLogged) {
        ...ProjectFavAndInvest_user
      }
      project(dbId: $dbId) {
        id
        dbId
        ...ProjectHeader_project
        ...ProjectData
        ...ProjectFavAndInvest_project
        owner {
          email
        }
      }
      allCategories {
        ...ProjectHeader_allCategories
      }
    }
    ${ProjectHeader.fragments.project}
    ${ProjectHeader.fragments.allCategories}
    ${ProjectData.fragments.project}
    ${ProjectFavAndInvest.fragments.project}
    ${ProjectFavAndInvest.fragments.user}
  `;

  const updateMutation = gql`
    mutation updateMutation(
      $idProject: Int!
      $name: String
      $description: String
      $longitude: String
      $latitude: String
      $hashtags: [String]
      $uriImage: String
      $category: String
    ) {
      mutateUpdateProject(
        idProject: $idProject
        name: $name
        description: $description
        latitude: $latitude
        longitude: $longitude
        hashtags: $hashtags
        uriImage: $uriImage
        category: $category
      ) {
        id
        ...ProjectHeader_project
        ...ProjectData
      }
    }
    ${ProjectHeader.fragments.project}
    ${ProjectData.fragments.project}
  `;

  const favMutation = gql`
    mutation favMutation($idProject: Int!) {
      mutateFavProject(idProject: $idProject) {
        project {
          ...ProjectFavAndInvest_project
        }
      }
    }
    ${ProjectFavAndInvest.fragments.project}
  `;

  const unfavMutation = gql`
    mutation unfavMutation($idProject: Int!) {
      mutateUnfavProject(idProject: $idProject) {
        project {
          ...ProjectFavAndInvest_project
        }
      }
    }
    ${ProjectFavAndInvest.fragments.project}
  `;

  // const investMutation = gql`
  //   mutation Invest($idProject: Int!, $investedAmount: Float!) {
  //     mutateInvestProject(
  //       idProject: $idProject
  //       investedAmount: $investedAmount
  //     ) {
  //       project {
  //         id
  //         amountCollected
  //       }
  //     }
  //   }
  // `;

  // const [mutateInvestProject, { error: mutateInvestProjectError }] =
  // useMutation(investMutation);

  const { user } = useUser();
  const isLogged = !!user;
  const { loading, error, data } = useQuery(query, {
    variables: {
      dbId: props.route.params.dbId,
      isLogged,
    },
  });

  const [mutateUpdateProject, { error: mutateUpdateProjectError }] =
    useMutation(updateMutation);

  const [mutateFavProject, { error: mutateFavProjectError }] =
    useMutation(favMutation);

  const [mutateUnfavProject, { error: mutateUnfavProjectError }] = useMutation(
    unfavMutation,
    {
      refetchQueries: [
        {
          query,
          variables: {
            dbId: props.route.params.dbId,
            isLogged,
          },
        },
      ],
    }
  );

  const errors = [
    error,
    mutateFavProjectError,
    mutateUnfavProjectError,
    mutateUpdateProjectError,
  ]; //, mutateInvestProjectError];

  if (errors.some((e) => e)) return <Error errors={errors} />;
  if (loading) return <Loading />;
  return (
    <Screen
      data={data}
      navigation={props.navigation}
      mutations={{ mutateUpdateProject, mutateFavProject, mutateUnfavProject }} //, mutateInvestProject }}
    />
  );
}
