import { useEffect, useState } from "react";
import { Button, Input, Stack, Text, XStack, YStack } from "tamagui";

interface FoodCategoryInputProps {
  id?: number;
  name: string;
  isEdit: boolean;
  onSave: (name: string, id: number | undefined) => void;
  onDelete: (id: number) => void;
  onCancel?: () => void;
}

const FoodCategoryInput = ({
  id,
  name,
  isEdit,
  onSave,
  onDelete,
  onCancel,
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
    if (inputName === "") {
      setInputName(name);
    }
  }, [name]);

  const onCancelInput = () => {
    if (onCancel !== undefined) {
      onCancel();
    } else {
      setEditMode(false);
    }
  };

  return (
    <Stack backgroundColor="lightgrey" borderRadius="$3" padding="$3">
      {isEditMode && (
        <YStack space="$2">
          <XStack space="$2" alignItems="center">
            <Input
              value={inputName}
              flex={1}
              size="$2"
              onChangeText={(text) => setInputName(text)}
              placeholder="Category name..."
            />
            <Button size="$2" onPress={doSave}>
              Save
            </Button>
            <Button size="$2" onPress={onCancelInput}>
              Cancel
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
