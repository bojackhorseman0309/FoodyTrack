import { useEffect, useState } from "react";
import { Button, Input, Stack, Text, XStack, YStack } from "tamagui";

import { isNumeric } from "../utils/NumberUtils";

interface MealPlanFoodCategoryInputProps {
  id: number;
  name: string;
  allowedAmount: string;
  onSave: (quantity: string, id: number) => void;
}

const MealPlanFoodCategoryInput = ({
  id,
  name,
  allowedAmount,
  onSave,
}: MealPlanFoodCategoryInputProps) => {
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditMode, setEditMode] = useState(false);

  const doSave = () => {
    if (amount) {
      if (isNumeric(amount)) {
        setErrorMessage("");
        setEditMode(false);
        onSave(amount, id);
      } else {
        setErrorMessage("Input cannot be a string");
      }
    } else {
      setErrorMessage("Input cannot be empty");
    }
  };

  useEffect(() => {
    if (amount && isNumeric(amount)) {
      setErrorMessage("");
    }
  }, [amount]);

  useEffect(() => {
    if (amount === "") {
      setAmount(allowedAmount);
    }
  }, [allowedAmount]);

  return (
    <Stack backgroundColor="lightgrey" borderRadius="$3" padding="$3">
      <YStack space="$2">
        <XStack space="$2" alignItems="center">
          <Text fontSize="$2">{name}</Text>
          <Input
            keyboardType="numeric"
            disabled={!isEditMode}
            value={amount}
            flex={1}
            size="$2"
            onChangeText={(text) => setAmount(text)}
            placeholder="Allowed quantity..."
          />
          {isEditMode && (
            <XStack space="$2">
              <Button size="$2" onPress={doSave}>
                Save
              </Button>
              <Button size="$2" onPress={() => setEditMode(false)}>
                Cancel
              </Button>
            </XStack>
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
