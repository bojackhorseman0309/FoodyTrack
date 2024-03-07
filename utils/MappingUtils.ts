import { DailyPlanHistory, MealPlan } from "../models/DatabaseModels";

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

export { mapMealPlanToModel, mapDailyPlanHistoryToModel };
