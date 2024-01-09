import { useEffect, useState } from "react";
import { Button, Label, ScrollView, XStack, YStack } from "tamagui";

import CreateMealPlanForm from "../../components/CreateMealPlanForm";
import CustomSelect from "../../components/CustomSelect";
import MealPlanFoodCategoryInput from "../../components/MealPlanFoodCategoryInput";
import { openDatabase } from "../../db/DatabaseUtils";

const db = openDatabase();

export default function MealPlanScreen() {
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [foodCategories, setFoodCategories] = useState<any[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT *
                 FROM FoodCategory;`,
        [],
        (_, { rows: { _array } }) => setFoodCategories(_array),
      );
    });
  }, [forceUpdate]);

  const onSave = (quantity: string, id: number) => {
    console.log("saving....");
  };

  return (
    <ScrollView
      backgroundColor="#FFF0F5"
      contentContainerStyle={{ padding: 15 }}
    >
      <YStack space="$4">
        {addNewCategory && <CreateMealPlanForm />}
        {!addNewCategory && (
          <YStack space="$4">
            <Button
              size="$3"
              theme="active"
              alignSelf="flex-start"
              onPress={() => setAddNewCategory(true)}
            >
              Add
            </Button>
            <XStack ai="center" space>
              <Label f={1} fb={0}>
                Plan
              </Label>
              <CustomSelect />
            </XStack>
            <YStack space="$3">
              {foodCategories.map((foodCategory) => (
                <MealPlanFoodCategoryInput
                  key={foodCategory.id}
                  id={foodCategory.id}
                  allowedQuantity=""
                  name={foodCategory.name}
                  onSave={(name, id) => onSave(name, id)}
                />
              ))}
            </YStack>
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
