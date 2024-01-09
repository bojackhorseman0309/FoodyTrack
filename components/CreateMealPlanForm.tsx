import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Button, Form, Switch, Text, XStack } from "tamagui";

const CreateMealPlanForm = () => {
  const [startDate, setStartDate] = useState(new Date(1598051730000));
  const [endDate, setEndDate] = useState(new Date(1598051730000));

  const onChangeStartDate = (
    _event: DateTimePickerEvent,
    type: "start" | "end",
    date?: Date | undefined,
  ) => {
    if (date) {
      if (type === "start") {
        setStartDate(date);
      } else if (type === "end") {
        setEndDate(date);
      }
    }
  };

  const showDateTimePicker = (type: "start" | "end") => {
    DateTimePickerAndroid.open({
      value: type === "start" ? startDate : endDate,
      onChange: (event, date) => onChangeStartDate(event, type, date),
      mode: "date",
      is24Hour: true,
    });
  };

  return (
    <Form onSubmit={() => console.log("Submitting...")} space="$4">
      <XStack ai="center" justifyContent="space-between">
        <Text>Start</Text>
        <Button onPress={() => showDateTimePicker("start")}>Select date</Button>
      </XStack>
      <XStack ai="center" justifyContent="space-between">
        <Text>End</Text>
        <Button onPress={() => showDateTimePicker("end")}>Select date</Button>
      </XStack>
      <XStack ai="center" justifyContent="space-between">
        <Text>Active</Text>
        <Switch size="$3">
          <Switch.Thumb animation="bouncy" />
        </Switch>
      </XStack>

      <Form.Trigger asChild>
        <Button>Submit</Button>
      </Form.Trigger>
    </Form>
  );
};

export default CreateMealPlanForm;
