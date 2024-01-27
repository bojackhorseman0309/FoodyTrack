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

export type { MealPlan, MealPlanFoodCategory };
