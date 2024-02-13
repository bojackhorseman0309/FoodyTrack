import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Button, Form, Input, Switch, Text, XStack } from "tamagui";

import { MealPlan } from "../models/DatabaseModels";
import { formatDate, isAfter, isBefore } from "../utils/DateUtils";

interface MealPlanFormProps {
  mealPlan?: MealPlan;
  onCancel: () => void;
  onSaveMealPlan: (
    startDate: Date,
    endDate: Date,
    isActive: boolean,
    id: number | undefined,
  ) => void;
}

const MealPlanForm = ({
  mealPlan,
  onCancel,
  onSaveMealPlan,
}: MealPlanFormProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mealPlan) {
      setStartDate(new Date(mealPlan.startDateTime));
      setEndDate(new Date(mealPlan.endDateTime));
      setIsActive(mealPlan.isActive);
    }
  }, [mealPlan]);

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

  const onSubmit = () => {
    if (isBefore(startDate, endDate)) {
      setError("");
      onSaveMealPlan(startDate, endDate, isActive, mealPlan?.id);
    } else if (isAfter(startDate, endDate)) {
      setError("Start date cannot be after end date.");
    }
  };

  return (
    <Form onSubmit={() => onSubmit()} space="$4">
      <XStack ai="center" justifyContent="space-between">
        <Text>Start</Text>
        <Input value={formatDate(startDate)} disabled />
        <Button onPress={() => showDateTimePicker("start")}>Select date</Button>
      </XStack>
      <XStack ai="center" justifyContent="space-between">
        <Text>End</Text>
        <Input value={formatDate(endDate)} disabled />
        <Button onPress={() => showDateTimePicker("end")}>Select date</Button>
      </XStack>
      <XStack ai="center" justifyContent="space-between">
        <Text>Active</Text>
        <Switch size="$3" checked={isActive} onCheckedChange={setIsActive}>
          <Switch.Thumb animation="bouncy" />
        </Switch>
      </XStack>

      {error !== "" && (
        <Text fontSize="$2" color="red">
          {error}
        </Text>
      )}

      <XStack space="$2" justifyContent="center">
        <Form.Trigger asChild>
          <Button>Submit</Button>
        </Form.Trigger>
        <Button onPress={onCancel}>Cancel</Button>
      </XStack>
    </Form>
  );
};

export default MealPlanForm;
