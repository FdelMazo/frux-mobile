import DateTimePicker from "@react-native-community/datetimepicker";
import * as React from "react";
import { Button, Div, Icon, Input, Text } from "react-native-magnus";
import { formatDateInput } from "../services/helpers";
import FruxOverlay from "./FruxOverlay";

export default function Component({ mutations, navigation }) {
  const [projectId, setProjectId] = React.useState(null);

  const [createProjectOverlay, setCreateProjectOverlay] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState("");
  const [newProjectDescription, setNewProjectDescription] = React.useState("");
  const [projectError, setProjectError] = React.useState("");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [newFinalizationDate, setNewFinalizationDate] = React.useState(null);
  const [selectDate, setSelectDate] = React.useState(false);

  React.useEffect(() => {
    if (!projectId) return;
    navigation.navigate("ProjectScreen", {
      dbId: projectId,
    });
  }, [projectId]);

  return (
    <>
      <Button
        bg="fruxgreen"
        borderColor="black"
        borderWidth={1}
        p="xs"
        mb="md"
        onPress={() => {
          setCreateProjectOverlay(true);
        }}
      >
        <Icon name="add" color="white" fontFamily="Ionicons" fontSize="3xl" />
      </Button>

      <FruxOverlay
        visible={createProjectOverlay}
        title="Create New Project"
        body={
          <>
            <Input
              mt="md"
              maxLength={35}
              value={newProjectName}
              onChangeText={setNewProjectName}
              placeholder="Name"
            />
            <Input
              mt="md"
              multiline
              maxLength={124}
              numberOfLines={3}
              textAlignVertical="top"
              value={newProjectDescription}
              onChangeText={setNewProjectDescription}
              placeholder="Description"
            />
            <Button
              block
              mt="md"
              borderColor="gray400"
              underlayColor="gray200"
              borderWidth={1}
              py="md"
              bg={undefined}
              onPress={() => setSelectDate(true)}
              suffix={
                <Icon
                  name="calendar-outline"
                  position="absolute"
                  right={0}
                  color="gray700"
                  fontFamily="Ionicons"
                  fontSize="lg"
                />
              }
            >
              <Div flex={1}>
                <Text color={newFinalizationDate ? "black" : "gray500"}>
                  {newFinalizationDate
                    ? formatDateInput(newFinalizationDate)
                    : "Delivered By..."}
                </Text>
              </Div>
            </Button>
            {projectError !== "" && (
              <Text color="fruxred" textAlign="right" m="md">
                {projectError}
              </Text>
            )}

            {selectDate && (
              <DateTimePicker
                value={newFinalizationDate || tomorrow}
                onChange={(e, selectedDate) => {
                  setSelectDate(false);
                  setNewFinalizationDate(selectedDate);
                }}
                minimumDate={tomorrow}
                display="default"
              />
            )}
          </>
        }
        fail={{
          title: "Cancel",
          action: () => {
            setCreateProjectOverlay(false);
          },
        }}
        success={{
          title: "Create",
          action: async () => {
            if (
              !newProjectName ||
              !newProjectDescription ||
              !newFinalizationDate
            ) {
              return setProjectError("You must specify all fields!");
            }

            setCreateProjectOverlay(false);
            const finalizationDate = formatDateInput(newFinalizationDate);
            const newProject = await mutations.mutateProject({
              variables: {
                name: newProjectName,
                description: newProjectDescription,
                deadline: finalizationDate,
              },
            });
            setProjectId(newProject.data.mutateProject.dbId);
          },
        }}
      />
    </>
  );
}
