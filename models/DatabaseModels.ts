interface MealPlan {
  id: number;
  startDateTime: string;
  endDateTime: string;
  isActive: boolean;
}

interface MealPlanFoodCategory {
  foodCategoryId: number;
  mealPlanFoodCategoryId: number;
  amount: number;
}

interface DailyPlanHistory {
  id: number;
  datetime: string;
  mealPlanId: number;
}

export type { MealPlan, MealPlanFoodCategory, DailyPlanHistory };
