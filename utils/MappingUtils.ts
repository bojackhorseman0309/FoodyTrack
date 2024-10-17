import {
  DailyPlanHistory,
  DailyPlanHistoryFoodCategories,
  FoodCategory,
  MealPlan,
  MealPlanFoodCategory,
} from "../models/DatabaseModels";
import { SyncedPlanFoodCategories } from "../models/FoodTracking";

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

const mapDailyPlanHistoryToModel = (dailyPlanHistoryFromDB: any[]) => {
  const dailyPlanHistories: DailyPlanHistory[] = [];
  for (const rawDailyPlanHistory of dailyPlanHistoryFromDB) {
    dailyPlanHistories.push({
      id: rawDailyPlanHistory.id,
      datetime: rawDailyPlanHistory.datetime,
      mealPlanId: rawDailyPlanHistory.mealPlanId,
    });
  }

  return dailyPlanHistories;
};

const mapFoodCategoriesToModel = (rawFoodCategories: any[]) => {
  const foodCategories: FoodCategory[] = [];
  for (const rawFoodCategory of rawFoodCategories) {
    foodCategories.push({
      id: rawFoodCategory.id,
      name: rawFoodCategory.name,
    });
  }

  return foodCategories;
};

const mapMealPlanFoodCategoriesToModel = (
  mealPlanFoodCategoriesFromDB: any[],
) => {
  const mealPlanFoodCategories: MealPlanFoodCategory[] = [];
  for (const rawMealPlan of mealPlanFoodCategoriesFromDB) {
    mealPlanFoodCategories.push({
      id: rawMealPlan.id,
      amount: rawMealPlan.amount,
      foodCategoryId: rawMealPlan.foodCategoryId,
      mealPlanId: rawMealPlan.mealPlanId,
    });
  }

  return mealPlanFoodCategories;
};

const mapDailyPlanHistoryFoodCategoriesToModel = (
  rawDailyPlanFoodCategories: any[],
) => {
  const dailyPlanHistoryFoodCategories: DailyPlanHistoryFoodCategories[] = [];
  for (const rawDailyPlanFoodCategory of rawDailyPlanFoodCategories) {
    dailyPlanHistoryFoodCategories.push({
      id: rawDailyPlanFoodCategory.id,
      amount: rawDailyPlanFoodCategory.amount,
      foodCategoryId: rawDailyPlanFoodCategory.foodCategoryId,
      dailyPlanHistoryId: rawDailyPlanFoodCategory.dailyPlanHistoryId,
    });
  }

  return dailyPlanHistoryFoodCategories;
};

const syncMealPlanFoodCategoriesWithDailyPlan = (
  mealPlanFoodCategories: MealPlanFoodCategory[],
  foodCategories: FoodCategory[],
  dailyPlanFoodCategories: DailyPlanHistoryFoodCategories[],
) => {
  const syncedFoodCategories: SyncedPlanFoodCategories[] = [];

  for (const foodCategory of foodCategories) {
    syncedFoodCategories.push({
      dailyPlanHistoryFoodCategoryId: 0,
      mealPlanFoodCategoryId: 0,
      foodCategoryId: foodCategory.id,
      name: foodCategory.name,
      maxAmount: 0,
      currentAmount: 0,
    });
  }

  for (const mealPlanFoodCategory of mealPlanFoodCategories) {
    const foundIndex = syncedFoodCategories.findIndex(
      (elem) => elem.foodCategoryId === mealPlanFoodCategory.foodCategoryId,
    );

    if (foundIndex >= 0) {
      syncedFoodCategories[foundIndex].maxAmount = mealPlanFoodCategory.amount;
      syncedFoodCategories[foundIndex].mealPlanFoodCategoryId =
        mealPlanFoodCategory.id;
    }
  }

  for (const dailyPlanHistoryFoodCategory of dailyPlanFoodCategories) {
    const foundIndex = syncedFoodCategories.findIndex(
      (elem) =>
        elem.foodCategoryId === dailyPlanHistoryFoodCategory.foodCategoryId,
    );

    if (foundIndex >= 0) {
      syncedFoodCategories[foundIndex].currentAmount =
        dailyPlanHistoryFoodCategory.amount;
      syncedFoodCategories[foundIndex].dailyPlanHistoryFoodCategoryId =
        dailyPlanHistoryFoodCategory.id;
    }
  }

  return syncedFoodCategories;
};

export {
  mapMealPlanToModel,
  mapDailyPlanHistoryToModel,
  mapFoodCategoriesToModel,
  mapMealPlanFoodCategoriesToModel,
  mapDailyPlanHistoryFoodCategoriesToModel,
  syncMealPlanFoodCategoriesWithDailyPlan,
};
