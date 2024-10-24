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
  isBefore,
  sameDay,
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
  const [planDate, setPlanDate] = useState(new Date());

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
          const mappedFoodCategories = mapFoodCategoriesToModel(_array);

          if (mappedFoodCategories.length > 0) {
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
          const mealPlans = mapMealPlanToModel(_array);

          if (mealPlans.length > 0) {
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
          const mappedMealPlanFoodCategories =
            mapMealPlanFoodCategoriesToModel(_array);

          if (mappedMealPlanFoodCategories.length > 0) {
            const processedSyncOfFoodCategories =
              syncMealPlanFoodCategoriesWithDailyPlan(
                mappedMealPlanFoodCategories,
                foodCategories,
                dailyPlanFoodCategories,
              );

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
          const dailyPlanFoodCategories =
            mapDailyPlanHistoryFoodCategoriesToModel(_array);

          if (dailyPlanFoodCategories.length > 0) {
            setDailyPlanFoodCategories(dailyPlanFoodCategories);
          } else {
            setDailyPlanFoodCategories([]);
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
  }, [dailyPlanHistory, dailyPlanFoodCategories]);

  useEffect(() => {
    if (mealPlan) {
      const pDate = getDateInSqlLiteDateFormatAsUTC(planDate);
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT *
                     FROM DailyPlanHistory
                     WHERE date(datetime) = ?;`,
          [pDate],
          (_, { rows: { _array } }) => {
            if (_array.length === 0) {
              createNewDailyPlan(planDate, mealPlan.id);
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
      getCurrentMealPlan(planDate);
    }
  }, [foodCategories, planDate]);

  useEffect(() => {
    getFoodCategories();
  }, []);

  const createDailyPlanFoodCategoryAmount = (
    amount: number,
    foodCategoryId: number,
    dailyPlanHistoryId: number,
  ) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO DailyPlanHistoryFoodCategories (amount, foodCategoryId, dailyPlanHistoryId)
                     values (?, ?, ?)`,
          [amount, foodCategoryId, dailyPlanHistoryId],
        );
      },
      (err) => console.log({ err }),
      () => {
        if (dailyPlanHistory != null) {
          getDailyPlanFoodCategories(dailyPlanHistory?.id);
        }
      },
    );
  };

  const modifyDailyPlanFoodCategoryAmount = (amount: number, id: number) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `UPDATE DailyPlanHistoryFoodCategories
                     SET amount= ?
                     WHERE id = ?;
                    values (?, ?)`,
          [amount, id],
        );
      },
      (err) => console.log({ err }),
      () => {
        if (dailyPlanHistory != null) {
          getDailyPlanFoodCategories(dailyPlanHistory?.id);
        }
      },
    );
  };

  const onQuantityChange = (
    quantity: number,
    dailyPlanHistoryFoodCategoryId: number,
    foodCategoryId: number,
  ) => {
    if (quantity < 0) {
      return;
    }

    if (dailyPlanHistoryFoodCategoryId === 0 && dailyPlanHistory != null) {
      createDailyPlanFoodCategoryAmount(
        quantity,
        foodCategoryId,
        dailyPlanHistory?.id,
      );
    } else if (dailyPlanHistoryFoodCategoryId !== 0) {
      modifyDailyPlanFoodCategoryAmount(
        quantity,
        dailyPlanHistoryFoodCategoryId,
      );
    }
  };

  const getPlanDate = () => {
    if (dailyPlanHistory != null) {
      const planDate = new Date(dailyPlanHistory.datetime);
      return planDate.toLocaleDateString("es-CR");
    }

    return "";
  };

  const disableNextDay = () => {
    if (dailyPlanHistory != null) {
      const dailyPlanHistoryDate = new Date(dailyPlanHistory.datetime);
      return (
        sameDay(dailyPlanHistoryDate, new Date()) ||
        !isBefore(dailyPlanHistoryDate, new Date())
      );
    }

    return true;
  };

  const moveDate = (goBack: boolean) => {
    if (dailyPlanHistory != null) {
      const dailyPlanHistoryDate = new Date(dailyPlanHistory.datetime);

      if (goBack) {
        dailyPlanHistoryDate.setDate(dailyPlanHistoryDate.getDate() - 1);
      } else {
        dailyPlanHistoryDate.setDate(dailyPlanHistoryDate.getDate() + 1);
      }

      setPlanDate(dailyPlanHistoryDate);
    }
  };

  return (
    <ScrollView
      backgroundColor="#FFF0F5"
      contentContainerStyle={{ padding: 15 }}
    >
      <YStack alignItems="center" space={10}>
        <DateSwitcher
          date={getPlanDate()}
          disableLeftChevron={false}
          disableRightChevron={disableNextDay()}
          onClick={moveDate}
        />
        {syncedFoodCategories.map((foodCategory, index) => (
          <FoodCategoryNumericInput
            key={foodCategory.foodCategoryId}
            dailyPlanFoodCategoryId={
              foodCategory.dailyPlanHistoryFoodCategoryId
            }
            foodCategoryId={foodCategory.foodCategoryId}
            category={foodCategory.name}
            number={foodCategory.currentAmount}
            isLast={syncedFoodCategories.length - 1 === index}
            mealPlanAmount={foodCategory.maxAmount}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </YStack>
    </ScrollView>
  );
}
