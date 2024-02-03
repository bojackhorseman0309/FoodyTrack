import { useEffect, useState } from "react";
import {
  Button,
  Label,
  ScrollView,
  Spinner,
  Stack,
  XStack,
  YStack,
} from "tamagui";

import MealPlanFoodCategoryInput from "../../components/MealPlanFoodCategoryInput";
import MealPlanForm from "../../components/MealPlanForm";
import MealPlanSelect from "../../components/MealPlanSelect";
import { openDatabase } from "../../db/DatabaseUtils";
import { MealPlan, MealPlanFoodCategory } from "../../models/DatabaseModels";
import { getBooleanAsNumber } from "../../utils/NumberUtils";

const db = openDatabase();

export default function MealPlanScreen() {
  const [addNewPlan, setAddNewPlan] = useState(false);
  const [foodCategories, setFoodCategories] = useState<any[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [mealPlanFoodCategories, setMealPlanFoodCategories] = useState<
    MealPlanFoodCategory[]
  >([]);
  const [currentMealPlanId, setCurrentMealPlanId] = useState<
    number | undefined
  >();
  const [loading, setLoading] = useState(false);

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

  const mapMealPlanFoodCategoriesToModel = (
    mealPlanFoodCategoriesFromDB: any[],
  ) => {
    const mealPlanFoodCategories: MealPlanFoodCategory[] = [];
    for (const rawMealPlan of mealPlanFoodCategoriesFromDB) {
      mealPlanFoodCategories.push({
        foodCategoryId: rawMealPlan.foodCategoryId,
        mealPlanFoodCategoryId: rawMealPlan.mealPlanFoodCategoryId,
        amount: rawMealPlan.amount,
      });
    }

    return mealPlanFoodCategories;
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

          if (mealPlans.length > 0) {
            onSelectMealPlan(mealPlans[0].id);
          }
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

  const onSaveMealPlanFoodCategory = (
    amount: string,
    foodCategoryId: number,
    mealPlanFoodCategoryId?: number,
  ) => {
    if (currentMealPlanId) {
      if (mealPlanFoodCategoryId) {
        db.transaction(
          (tx) => {
            tx.executeSql(
              "UPDATE MealPlanFoodCategories " +
                "SET amount = ? " +
                "WHERE id = ? ",
              [amount, mealPlanFoodCategoryId],
            );
          },
          undefined,
          undefined,
        );
      } else {
        db.transaction(
          (tx) => {
            tx.executeSql(
              "INSERT INTO MealPlanFoodCategories (amount, foodCategoryId, mealPlanId) values (?, ?, ?)",
              [amount, foodCategoryId, currentMealPlanId],
            );
          },
          (error) => console.error(error),
          undefined,
        );
      }
    }
  };

  const onSelectMealPlan = (id: number) => {
    setLoading(true);
    setCurrentMealPlanId(id);
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT mpfc.id AS mealPlanFoodCategoryId, mpfc.amount, fc.id AS foodCategoryId " +
          "FROM MealPlanFoodCategories mpfc, " +
          "FoodCategory fc, " +
          "MealPlan mp " +
          "WHERE mpfc.foodCategoryId = fc.id " +
          "AND mpfc.mealPlanId = mp.id " +
          "AND mp.id = ?",
        [id],
        (_, { rows: { _array } }) => {
          const mealPlanFoodCategories =
            mapMealPlanFoodCategoriesToModel(_array);
          setMealPlanFoodCategories(mealPlanFoodCategories);
          setLoading(false);
        },
        undefined,
      );
    });
  };

  const getMealPlanFoodCategoryAmount = (foodCategoryId: number) => {
    const mealPlanFoodCategory = mealPlanFoodCategories.find(
      (mealPlanFoodCategory) =>
        mealPlanFoodCategory.foodCategoryId === foodCategoryId,
    );

    return mealPlanFoodCategory ? mealPlanFoodCategory.amount.toString() : "";
  };

  const getMealPlanFoodCategoryId = (foodCategoryId: number) => {
    const mealPlanFoodCategory = mealPlanFoodCategories.find(
      (mealPlanFoodCategory) =>
        mealPlanFoodCategory.foodCategoryId === foodCategoryId,
    );

    return mealPlanFoodCategory
      ? mealPlanFoodCategory.mealPlanFoodCategoryId
      : undefined;
  };

  const onDeleteMealPlan = () => {
    if (currentMealPlanId) {
      db.transaction(
        (tx) => {
          tx.executeSql("DELETE FROM MealPlan WHERE id = ?;", [
            currentMealPlanId,
          ]);
        },
        (error) => console.error(error),
        () => setForceUpdate(forceUpdate + 1),
      );
    }
  };

  if (loading) {
    return (
      <Stack
        backgroundColor="#FFF0F5"
        alignItems="center"
        justifyContent="center"
        flex={1}
      >
        <Spinner size="large" />
      </Stack>
    );
  }

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
                currentMealPlanId={currentMealPlanId}
                mealPlans={mealPlans}
                onSelectMealPlan={onSelectMealPlan}
              />
            </XStack>
            <XStack ai="center" space>
              <Button>Edit</Button>
              <Button onPress={onDeleteMealPlan}>Delete</Button>
            </XStack>
            <YStack space="$3">
              {foodCategories.map((foodCategory) => (
                <MealPlanFoodCategoryInput
                  key={foodCategory.id}
                  id={foodCategory.id}
                  allowedAmount={getMealPlanFoodCategoryAmount(foodCategory.id)}
                  name={foodCategory.name}
                  onSave={(name, id) =>
                    onSaveMealPlanFoodCategory(
                      name,
                      id,
                      getMealPlanFoodCategoryId(foodCategory.id),
                    )
                  }
                />
              ))}
            </YStack>
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
