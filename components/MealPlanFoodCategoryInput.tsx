import { useEffect, useState } from "react";
import { Button, Input, Stack, Text, XStack, YStack } from "tamagui";

import { isNumeric } from "../utils/NumberUtils";

interface MealPlanFoodCategoryInputProps {
  id: number;
  name: string;
  allowedQuantity: string;
  onSave: (quantity: string, id: number) => void;
}

const MealPlanFoodCategoryInput = ({
  id,
  name,
  allowedQuantity,
  onSave,
}: MealPlanFoodCategoryInputProps) => {
  const [inputName, setInputName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditMode, setEditMode] = useState(false);

  const doSave = () => {
    if (inputName) {
      if (isNumeric(inputName)) {
        setErrorMessage("");
        setEditMode(false);
        onSave(inputName, id);
      } else {
        setErrorMessage("Input cannot be a string");
      }
    } else {
      setErrorMessage("Input cannot be empty");
    }
  };

  useEffect(() => {
    if (inputName && isNumeric(inputName)) {
      setErrorMessage("");
    }
  }, [inputName]);

  useEffect(() => {
    setInputName(name);
  }, [name]);

  return (
    <Stack backgroundColor="lightgrey" borderRadius="$3" padding="$3">
      <YStack space="$2">
        <XStack space="$2" alignItems="center">
          <Text fontSize="$2">{name}</Text>
          <Input
            keyboardType="numeric"
            value={allowedQuantity}
            flex={1}
            size="$2"
            onChangeText={(text) => setInputName(text)}
            placeholder="Allowed quantity..."
          />
          {isEditMode && (
            <Button size="$2" onPress={doSave}>
              Save
            </Button>
          )}
          {!isEditMode && (
            <Button size="$2" onPress={() => setEditMode(true)}>
              Edit
            </Button>
          )}
        </XStack>
        {errorMessage && (
          <Text fontSize="$2" color="red">
            {errorMessage}
          </Text>
        )}
      </YStack>
    </Stack>
  );
};

export default MealPlanFoodCategoryInput;
