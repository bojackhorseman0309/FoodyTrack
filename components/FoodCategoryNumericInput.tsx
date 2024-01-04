import { Minus, Plus } from "@tamagui/lucide-icons";
import { Button, Separator, Text, XStack } from "tamagui";

interface FoodCategoryInputProps {
  category: string;
  number: number;
  isLast: boolean;
}

const FoodCategoryNumericInput = ({
  category,
  number,
  isLast,
}: FoodCategoryInputProps) => (
  <>
    <XStack space={5} alignItems="center">
      <Text fontSize={16}>{category}</Text>
      <Button icon={Minus} />
      <Text>{number}</Text>
      <Button icon={Plus} />
    </XStack>
    {!isLast && (
      <Separator
        borderColor="black"
        borderWidth={1}
        alignSelf="stretch"
        marginVertical={10}
      />
    )}
  </>
);

export default FoodCategoryNumericInput;
