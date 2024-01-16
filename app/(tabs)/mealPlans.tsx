import { useEffect, useState } from "react";
import { Button, Label, ScrollView, XStack, YStack } from "tamagui";

import MealPlanFoodCategoryInput from "../../components/MealPlanFoodCategoryInput";
import MealPlanForm from "../../components/MealPlanForm";
import MealPlanSelect from "../../components/MealPlanSelect";
import { openDatabase } from "../../db/DatabaseUtils";
import { MealPlan } from "../../models/DatabaseModels";
import { getBooleanAsNumber } from "../../utils/NumberUtils";

const db = openDatabase();

export default function MealPlanScreen() {
  const [addNewPlan, setAddNewPlan] = useState(false);
  const [foodCategories, setFoodCategories] = useState<any[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  const mapMealPlanToModel = (mealPlansFromDB: any[]) => {
    const mealPlans: MealPlan[] = [];
    for (const rawMealPlan of mealPlansFromDB) {
      mealPlans.push({
        id: rawMealPlan.id,
        startDateTime: rawMealPlan.startDateTime,
        endDateTime: rawMealPlan.endDateTime,
        isActive: rawMealPlan.isActive,
      });
    }

    return mealPlans;
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT *
                 FROM FoodCategory;`,
        [],
        (_, { rows: { _array } }) => setFoodCategories(_array),
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        `SELECT *
                 FROM MealPlan;`,
        [],
        (_, { rows: { _array } }) => {
          const mealPlans = mapMealPlanToModel(_array);
          setMealPlans(mealPlans);
        },
      );
    });
  }, [forceUpdate]);

  const onSaveMealPlan = (
    startDate: Date,
    endDate: Date,
    isActive: boolean,
    id?: number,
  ) => {
    if (id) {
      console.log("Updating...");
    } else {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "INSERT INTO MealPlan (startDateTime, endDateTime, isActive) values (?, ?, ?)",
            [
              startDate.toISOString(),
              endDate.toISOString(),
              getBooleanAsNumber(isActive),
            ],
          );
        },
        undefined,
        () => {
          setAddNewPlan(false);
          setForceUpdate(forceUpdate + 1);
        },
      );
    }
  };

  const onSaveMealPlanFoodCategory = (quantity: string, id: number) => {
    console.log("Saving quantity");
  };

  const onSelectMealPlan = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT mpfc.id, mpfc.amount, fc.id" +
          "FROM MealPlanFoodCategories mpfc, " +
          "FoodCategory fc, " +
          "MealPlan mp " +
          "WHERE mpfc.foodCategoryId = fc.id " +
          "AND mpfc.mealPlanId = mp.id" +
          "AND mpfc.id = ?",
        [id],
        (_, { rows: { _array } }) => console.log({ _array }),
      );
    });
  };

  return (
    <ScrollView
      backgroundColor="#FFF0F5"
      contentContainerStyle={{ padding: 15 }}
    >
      <YStack space="$4">
        {addNewPlan && (
          <MealPlanForm
            onCancel={() => setAddNewPlan(false)}
            onSaveMealPlan={onSaveMealPlan}
          />
        )}
        {!addNewPlan && (
          <YStack space="$4">
            <Button
              size="$3"
              theme="active"
              alignSelf="flex-start"
              onPress={() => setAddNewPlan(true)}
            >
              Add
            </Button>
            <XStack ai="center" space>
              <Label f={1} fb={0}>
                Plan
              </Label>
              <MealPlanSelect
                mealPlans={mealPlans}
                onSelectMealPlan={onSelectMealPlan}
              />
            </XStack>
            <YStack space="$3">
              {foodCategories.map((foodCategory) => (
                <MealPlanFoodCategoryInput
                  key={foodCategory.id}
                  id={foodCategory.id}
                  allowedQuantity=""
                  name={foodCategory.name}
                  onSave={(name, id) => onSaveMealPlanFoodCategory(name, id)}
                />
              ))}
            </YStack>
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
