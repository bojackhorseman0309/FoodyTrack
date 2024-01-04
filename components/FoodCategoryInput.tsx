import { useEffect, useState } from "react";
import { Button, Input, Stack, Text, XStack, YStack } from "tamagui";

interface FoodCategoryInputProps {
  id?: number;
  name: string;
  isEdit: boolean;
  onSave: (name: string, id: number | undefined) => void;
  onDelete: (id: number) => void;
}

const FoodCategoryInput = ({
  id,
  name,
  isEdit,
  onSave,
  onDelete,
}: FoodCategoryInputProps) => {
  const [inputName, setInputName] = useState("");
  const [showError, setShowError] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  const doSave = () => {
    if (inputName) {
      setShowError(false);
      setEditMode(false);
      onSave(inputName, id);
    } else {
      setShowError(true);
    }
  };

  useEffect(() => {
    if (inputName) {
      setShowError(false);
    }
  }, [inputName]);

  useEffect(() => {
    setEditMode(isEdit);
  }, [isEdit]);

  useEffect(() => {
    setInputName(name);
  }, [name]);

  return (
    <Stack backgroundColor="lightgrey" borderRadius="$3" padding="$3">
      {isEditMode && (
        <YStack space="$2">
          <XStack space="$2" alignItems="center">
            <Input
              value={name}
              flex={1}
              size="$2"
              onChangeText={(text) => setInputName(text)}
              placeholder="Category name..."
            />
            <Button size="$2" onPress={doSave}>
              Save
            </Button>
          </XStack>
          {showError && (
            <Text fontSize="$2" color="red">
              Input cannot be empty
            </Text>
          )}
        </YStack>
      )}
      {!isEditMode && (
        <XStack space="$2" alignItems="center">
          <Text fontSize="$2">{name}</Text>
          <Button size="$2" onPress={() => setEditMode(true)}>
            Edit
          </Button>
          {id && (
            <Button size="$2" onPress={() => onDelete(id)}>
              Delete
            </Button>
          )}
        </XStack>
      )}
    </Stack>
  );
};

export default FoodCategoryInput;
