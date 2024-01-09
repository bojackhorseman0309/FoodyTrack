import * as SQLite from "expo-sqlite";
import { SQLiteDatabase } from "expo-sqlite";

function openDatabase() {
  return SQLite.openDatabase("foodyTrack.db");
}

function initializeTables(db: SQLiteDatabase) {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS FoodCategory (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, UNIQUE(id, name));",
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS MealPlan (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, startDateTime TEXT NOT NULL, endDateTime TEXT NOT NULL, isActive INTEGER NOT NULL, UNIQUE(startDateTime, endDateTime, isActive));",
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS MealPlanFoodCategories " +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, amount INTEGER NOT NULL, foodCategoryId INTEGER NOT NULL, mealPlanId INTEGER NOT NULL, " +
        "CONSTRAINT FK_FOOD_CATEGORY FOREIGN KEY (foodCategoryId) REFERENCES FoodCategory(id), " +
        "CONSTRAINT FK_MEAL_PLAN FOREIGN KEY (mealPlanId) REFERENCES MealPlan(id), " +
        "UNIQUE(foodCategoryId, mealPlanId) " +
        ");",
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS DailyPlanHistory (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, datetime TEXT NOT NULL UNIQUE, mealPlanId INTEGER NOT NULL, CONSTRAINT FK_MEAL_PLAN FOREIGN KEY (mealPlanId) REFERENCES MealPlan(id));",
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS DailyPlanHistoryFoodCategories " +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, amount INTEGER NOT NULL, foodCategoryId INTEGER NOT NULL, dailyPlanHistoryId INTEGER NOT NULL, " +
        "CONSTRAINT FK_FOOD_CATEGORY FOREIGN KEY (foodCategoryId) REFERENCES FoodCategory(id), " +
        "CONSTRAINT FK_DAILY_PLAN_HISTORY FOREIGN KEY (dailyPlanHistoryId) REFERENCES DailyPlanHistory(id), " +
        "UNIQUE(foodCategoryId, dailyPlanHistoryId) " +
        ");",
    );
  });
}

export { openDatabase, initializeTables };
