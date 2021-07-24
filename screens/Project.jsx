import { gql, useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import { Div } from "react-native-magnus";
import ProjectData from "../components/ProjectData";
import ProjectFavAndInvest from "../components/ProjectFavAndInvest";
import ProjectHeader from "../components/ProjectHeader";
import ProjectMessages from "../components/ProjectMessages";
import ProjectProgress from "../components/ProjectProgress";
import ProjectRating from "../components/ProjectRating";
import ProjectSeer from "../components/ProjectSeer";
import ProjectStatus from "../components/ProjectStatus";
import { MainView, View } from "../components/Themed";
import { useUser } from "../services/user";
import Error from "./Error";
import Loading from "./Loading";

function Screen({ data, navigation, mutations, refetch }) {
  const { user } = useUser();
  const created = React.useMemo(
    () => user && data.project.owner.email === user.email,
    [user]
  );

  return (
    <View>
      <ProjectHeader data={data} created={created} mutations={mutations} />
      <MainView refetch={refetch}>
        <ProjectData
          data={data}
          created={created}
          mutations={mutations}
          navigation={navigation}
        />
        <Div alignItems="center">
          <Div w="90%">
            <ProjectFavAndInvest
              data={data}
              created={created}
              mutations={mutations}
            />
          </Div>
          <Div my="sm">
            {data.project.currentStatus !== "CREATED" && (
              <ProjectRating
                data={data}
                created={created}
                mutations={mutations}
              />
            )}
          </Div>
          <Div mx="md" my="xs">
            <ProjectStatus data={data} created={created} />
          </Div>
        </Div>

        <Div w="85%" my="lg">
          <ProjectProgress
            data={data}
            created={created}
            mutations={mutations}
          />
        </Div>

        <Div w="100%" my="lg">
          {!!user && (
            <Div>
              <ProjectMessages data={data} created={created} />
            </Div>
          )}
          {!!data.project.seer && (
            <Div my="xs">
              <ProjectSeer data={data} />
            </Div>
          )}
        </Div>
      </MainView>
    </View>
  );
}

export default function Render(props) {
  const query = gql`
    query Project($dbId: Int!, $isLogged: Boolean!) {
      profile @include(if: $isLogged) {
        id
        ...ProjectFavAndInvest_user
        ...ProjectSeer_user
      }
      project(dbId: $dbId) {
        id
        dbId
        currentState
        seer {
          id
        }
        ...ProjectRating
        ...ProjectHeader_project
        ...ProjectData
        ...ProjectMessages
        ...ProjectFavAndInvest_project
        ...ProjectProgress_project
        ...ProjectStatus
        ...ProjectSeer_project
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
    ${ProjectProgress.fragments.project}
    ${ProjectRating.fragments.project}
    ${ProjectMessages.fragments.project}
    ${ProjectStatus.fragments.project}
    ${ProjectSeer.fragments.project}
    ${ProjectSeer.fragments.user}
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
          id
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
          id
          ...ProjectFavAndInvest_project
        }
      }
    }
    ${ProjectFavAndInvest.fragments.project}
  `;

  const investMutation = gql`
    mutation Invest($idProject: Int!, $investedAmount: Float!) {
      mutateInvestProject(
        idProject: $idProject
        investedAmount: $investedAmount
      ) {
        project {
          id
          ...ProjectFavAndInvest_project
        }
      }
    }
    ${ProjectFavAndInvest.fragments.project}
  `;

  const [mutateInvestProject, { error: mutateInvestProjectError }] =
    useMutation(investMutation);

  const seerMutation = gql`
    mutation seerMutation($idProject: Int!) {
      mutateSeerProject(idProject: $idProject) {
        id
        ...ProjectProgress_project
      }
    }
    ${ProjectProgress.fragments.project}
  `;

  const stageMutation = gql`
    mutation stageMutation(
      $idProject: Int!
      $description: String!
      $goal: Float!
      $title: String!
    ) {
      mutateProjectStage(
        idProject: $idProject
        description: $description
        goal: $goal
        title: $title
      ) {
        id
        ...ProjectProgress_stage
      }
    }
    ${ProjectProgress.fragments.stage}
  `;

  const reviewMutation = gql`
    mutation reviewMutation(
      $idProject: Int!
      $description: String!
      $score: Float!
    ) {
      mutateReviewProject(
        idProject: $idProject
        description: $description
        score: $score
      ) {
        id
        project {
          ...ProjectRating
        }
      }
    }
    ${ProjectRating.fragments.project}
  `;

  const { user } = useUser();
  const isLogged = !!user;
  const { loading, error, data, refetch } = useQuery(query, {
    variables: {
      dbId: props.route.params.dbId,
      isLogged,
    },
  });

  const [mutateUpdateProject, { error: mutateUpdateProjectError }] =
    useMutation(updateMutation);

  const [mutateReviewProject, { error: mutateReviewProjectError }] =
    useMutation(reviewMutation);

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

  const [mutateProjectStage, { error: mutateProjectStageError }] = useMutation(
    stageMutation,
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

  const [mutateSeerProject, { error: mutateSeerProjectError }] =
    useMutation(seerMutation);

  const errors = [
    error,
    mutateFavProjectError,
    mutateUnfavProjectError,
    mutateUpdateProjectError,
    mutateProjectStageError,
    mutateSeerProjectError,
    mutateInvestProjectError,
    mutateReviewProjectError,
  ];

  if (errors.some((e) => e)) return <Error errors={errors} />;
  if (loading) return <Loading />;
  return (
    <Screen
      data={data}
      refetch={refetch}
      navigation={props.navigation}
      mutations={{
        mutateUpdateProject,
        mutateFavProject,
        mutateUnfavProject,
        mutateProjectStage,
        mutateSeerProject,
        mutateInvestProject,
        mutateReviewProject,
      }}
    />
  );
}
