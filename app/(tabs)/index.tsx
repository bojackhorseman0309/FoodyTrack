import { useEffect, useState } from "react";
import { ScrollView, YStack } from "tamagui";

import DateSwitcher from "../../components/DateSwitcher";
import FoodCategoryNumericInput from "../../components/FoodCategoryNumericInput";
import { initializeTables, openDatabase } from "../../db/DatabaseUtils";
import { DailyPlanHistory, MealPlan } from "../../models/DatabaseModels";
import {
  getDateInSqlLiteDateFormatAsUTC,
  getDateInSqlLiteDateFormatTimezoneSensitive,
} from "../../utils/DateUtils";
import {
  mapDailyPlanHistoryToModel,
  mapMealPlanToModel,
} from "../../utils/MappingUtils";

const db = openDatabase();

const foodCategories = [
  { id: 1, category: "Azucares", number: 0 },
  { id: 2, category: "Vegetales", number: 0 },
  { id: 3, category: "Grasas", number: 0 },
  { id: 4, category: "Alimentos Libres", number: 0 },
  { id: 5, category: "Suplementos", number: 0 },
  { id: 6, category: "Carbohidratos", number: 0 },
  { id: 7, category: "Frutas", number: 0 },
  { id: 8, category: "Lácteos", number: 0 },
  { id: 9, category: "Agua", number: 0 },
  { id: 10, category: "Carnes", number: 0 },
];

export default function FoodTrackingScreen() {
  const [forceUpdate, setForceUpdate] = useState(0);
  const [mealPlan, setMealPlan] = useState<MealPlan>();
  const [dailyPlanHistory, setDailyPlanHistory] = useState<DailyPlanHistory>();
  useEffect(() => {
    initializeTables(db);
  }, []);

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
            console.log("assigning meal plan");
            setMealPlan(mealPlans[0]);
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
              // createNewDailyPlan(new Date(), mealPlan.id);
            } else {
              const dailyPlanHistories = mapDailyPlanHistoryToModel(_array);

              if (dailyPlanHistories.length > 0) {
                setDailyPlanHistory(dailyPlanHistory);
              }
            }
          },
        );
      });
    }
  }, [forceUpdate, mealPlan]);

  useEffect(() => {
    getCurrentMealPlan(new Date());
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
        {foodCategories.map((foodCategory, index) => (
          <FoodCategoryNumericInput
            key={foodCategory.id}
            category={foodCategory.category}
            number={foodCategory.number}
            isLast={foodCategories.length - 1 === index}
            mealPlanAmount={42}
          />
        ))}
      </YStack>
    </ScrollView>
  );
}
