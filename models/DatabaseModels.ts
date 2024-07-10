interface MealPlan {
  id: number;
  startDateTime: string;
  endDateTime: string;
  isActive: boolean;
}

interface MealPlanFoodCategory {
  id: number;
  amount: number;
  foodCategoryId: number;
  mealPlanId: number;
}

interface DailyPlanHistory {
  id: number;
  datetime: string;
  mealPlanId: number;
}

interface DailyPlanHistoryFoodCategories {
  id: number;
  amount: number;
  foodCategoryId: number;
  dailyPlanHistoryId: number;
}

interface FoodCategory {
  id: number;
  name: string;
}

export type {
  MealPlan,
  MealPlanFoodCategory,
  DailyPlanHistory,
  FoodCategory,
  DailyPlanHistoryFoodCategories,
};
