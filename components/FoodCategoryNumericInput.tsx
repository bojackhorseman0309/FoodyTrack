import { Minus, Plus } from "@tamagui/lucide-icons";
import { Button, Separator, Text, XStack } from "tamagui";

interface FoodCategoryInputProps {
  category: string;
  number: number;
  isLast: boolean;
  mealPlanAmount: number;
  onQuantityChange: (
    quantity: number,
    id: number,
    foodCategoryId: number,
  ) => void;
  dailyPlanFoodCategoryId: number;
  foodCategoryId: number;
}

const FoodCategoryNumericInput = ({
  category,
  number,
  isLast,
  mealPlanAmount,
  onQuantityChange,
  dailyPlanFoodCategoryId,
  foodCategoryId,
}: FoodCategoryInputProps) => (
  <>
    <XStack space={5} alignItems="center">
      <Text fontSize={16}>
        {category} ({mealPlanAmount})
      </Text>
      <Button
        icon={Minus}
        onPress={(e) =>
          onQuantityChange(number - 1, dailyPlanFoodCategoryId, foodCategoryId)
        }
      />
      <Text>{number}</Text>
      <Button
        icon={Plus}
        onPress={(e) =>
          onQuantityChange(number + 1, dailyPlanFoodCategoryId, foodCategoryId)
        }
      />
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
