import { useEffect, useState } from "react";
import { ScrollView, YStack } from "tamagui";

import DateSwitcher from "../../components/DateSwitcher";
import FoodCategoryNumericInput from "../../components/FoodCategoryNumericInput";
import { initializeTables, openDatabase } from "../../db/DatabaseUtils";
import {
  DailyPlanHistory,
  DailyPlanHistoryFoodCategories,
  FoodCategory,
  MealPlan,
  MealPlanFoodCategory,
} from "../../models/DatabaseModels";
import { SyncedPlanFoodCategories } from "../../models/FoodTracking";
import {
  getDateInSqlLiteDateFormatAsUTC,
  getDateInSqlLiteDateFormatTimezoneSensitive,
} from "../../utils/DateUtils";
import {
  mapDailyPlanHistoryFoodCategoriesToModel,
  mapDailyPlanHistoryToModel,
  mapFoodCategoriesToModel,
  mapMealPlanFoodCategoriesToModel,
  mapMealPlanToModel,
  syncMealPlanFoodCategoriesWithDailyPlan,
} from "../../utils/MappingUtils";

const db = openDatabase();

// const foodCategories = [
//   { id: 1, category: "Azucares", number: 0 },
//   { id: 2, category: "Vegetales", number: 0 },
//   { id: 3, category: "Grasas", number: 0 },
//   { id: 4, category: "Alimentos Libres", number: 0 },
//   { id: 5, category: "Suplementos", number: 0 },
//   { id: 6, category: "Carbohidratos", number: 0 },
//   { id: 7, category: "Frutas", number: 0 },
//   { id: 8, category: "Lácteos", number: 0 },
//   { id: 9, category: "Agua", number: 0 },
//   { id: 10, category: "Carnes", number: 0 },
// ];

export default function FoodTrackingScreen() {
  const [forceUpdate, setForceUpdate] = useState(0);
  const [mealPlan, setMealPlan] = useState<MealPlan>();
  const [dailyPlanHistory, setDailyPlanHistory] = useState<DailyPlanHistory>();
  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>([]);
  const [dailyPlanFoodCategories, setDailyPlanFoodCategories] = useState<
    DailyPlanHistoryFoodCategories[]
  >([]);
  const [mealPlanFoodCategories, setMealPlanFoodCategories] = useState<
    MealPlanFoodCategory[]
  >([]);
  const [syncedFoodCategories, setSyncedFoodCategories] = useState<
    SyncedPlanFoodCategories[]
  >([]);

  useEffect(() => {
    initializeTables(db);
  }, []);

  const getFoodCategories = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT *
                 FROM FoodCategory;`,
        [],
        (_, { rows: { _array } }) => {
          console.log("Food Categories");
          console.log(_array);
          const mappedFoodCategories = mapFoodCategoriesToModel(_array);

          if (mappedFoodCategories.length > 0) {
            console.log("setting food categories");
            setFoodCategories(mappedFoodCategories);
          }
        },
      );
    });
  };

  const getCurrentMealPlan = (date: Date) => {
    const formattedDate = getDateInSqlLiteDateFormatTimezoneSensitive(date);

    db.transaction((tx) => {
      tx.executeSql(
        `SELECT *
                 FROM MealPlan
                 WHERE date(startDateTime) <= ?
                   AND date(endDateTime) >= ?
                   AND isActive = 1;`,
        [formattedDate, formattedDate],
        (_, { rows: { _array } }) => {
          console.log("Meal Plans");
          console.log(_array);
          const mealPlans = mapMealPlanToModel(_array);

          if (mealPlans.length > 0) {
            console.log("setting meal plan");
            setMealPlan(mealPlans[0]);
          }
        },
      );
    });
  };

  const mapMealPlanFoodCategoriesToFoodCategories = (mealPlanId: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT *
                 FROM MealPlanFoodCategories
                 WHERE mealPlanId = ?;`,
        [mealPlanId],
        (_, { rows: { _array } }) => {
          console.log("Meal Plan Food Categories");
          console.log(_array);
          const mappedMealPlanFoodCategories =
            mapMealPlanFoodCategoriesToModel(_array);

          if (mappedMealPlanFoodCategories.length > 0) {
            console.log("setting meal plan food categories and syncing");
            const processedSyncOfFoodCategories =
              syncMealPlanFoodCategoriesWithDailyPlan(
                mappedMealPlanFoodCategories,
                foodCategories,
                dailyPlanFoodCategories,
              );

            console.log("Synced food categories");
            console.log(processedSyncOfFoodCategories);

            if (processedSyncOfFoodCategories.length > 0) {
              setSyncedFoodCategories(processedSyncOfFoodCategories);
            }

            setMealPlanFoodCategories(mappedMealPlanFoodCategories);
          }
        },
      );
    });
  };

  const createNewDailyPlan = (datetime: Date, mealPlanId: number) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO DailyPlanHistory (datetime, mealPlanId) values (?, ?)",
          [datetime.toISOString(), mealPlanId],
        );
      },
      (err) => console.log({ err }),
      () => {
        console.log("Daily Plan inserted...");
        setForceUpdate(forceUpdate + 1);
      },
    );
  };

  const getDailyPlanFoodCategories = (dailyPlanHistoryId: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT *
                 FROM DailyPlanHistoryFoodCategories
                 WHERE dailyPlanHistoryId = ?;`,
        [dailyPlanHistoryId],
        (_, { rows: { _array } }) => {
          console.log("Daily Plan History Food Categories");
          console.log(_array);
          const dailyPlanFoodCategories =
            mapDailyPlanHistoryFoodCategoriesToModel(_array);

          if (dailyPlanFoodCategories.length > 0) {
            console.log("setting daily plan food categories");
            setDailyPlanFoodCategories(dailyPlanFoodCategories);
          }
        },
      );
    });
  };

  useEffect(() => {
    if (
      dailyPlanHistory !== undefined &&
      mealPlan &&
      foodCategories !== undefined &&
      foodCategories.length > 0
    ) {
      mapMealPlanFoodCategoriesToFoodCategories(mealPlan.id);
    }
  }, [dailyPlanHistory]);

  useEffect(() => {
    if (mealPlan && dailyPlanHistory === undefined) {
      const today = getDateInSqlLiteDateFormatAsUTC(new Date());
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT *
                     FROM DailyPlanHistory
                     WHERE date(datetime) = ?;`,
          [today],
          (_, { rows: { _array } }) => {
            console.log("DailyPlanHistory: ");
            console.log(_array);

            if (_array.length === 0) {
              createNewDailyPlan(new Date(), mealPlan.id);
            } else {
              const dailyPlanHistories = mapDailyPlanHistoryToModel(_array);

              if (dailyPlanHistories.length > 0) {
                getDailyPlanFoodCategories(dailyPlanHistories[0].id);
                setDailyPlanHistory(dailyPlanHistories[0]);
              }
            }
          },
        );
      });
    }
  }, [forceUpdate, mealPlan]);

  useEffect(() => {
    if (foodCategories !== undefined && foodCategories.length > 0) {
      getCurrentMealPlan(new Date());
    }
  }, [foodCategories]);

  useEffect(() => {
    getFoodCategories();
  }, []);
  return (
    <ScrollView
      backgroundColor="#FFF0F5"
      contentContainerStyle={{ padding: 15 }}
    >
      <YStack alignItems="center" space={10}>
        <DateSwitcher
          date="27/12/2023"
          disableLeftChevron={false}
          disableRightChevron={false}
          onClick={() => console.log("hello")}
        />
        {syncedFoodCategories.map((foodCategory, index) => (
          <FoodCategoryNumericInput
            key={foodCategory.foodCategoryId}
            category={foodCategory.name}
            number={foodCategory.currentAmount}
            isLast={syncedFoodCategories.length - 1 === index}
            mealPlanAmount={foodCategory.maxAmount}
          />
        ))}
      </YStack>
    </ScrollView>
  );
}
