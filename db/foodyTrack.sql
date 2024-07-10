CREATE TABLE IF NOT EXISTS FoodCategory
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT                              NOT NULL,
    UNIQUE (id, name)
);

CREATE TABLE IF NOT EXISTS MealPlan
(
    id            INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    startDateTime TEXT                              NOT NULL,
    endDateTime   TEXT                              NOT NULL,
    isActive      INTEGER                           NOT NULL,
    UNIQUE (startDateTime, endDateTime, isActive)
);

CREATE TABLE IF NOT EXISTS MealPlanFoodCategories
(
    id             INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    amount         INTEGER                           NOT NULL,
    foodCategoryId INTEGER                           NOT NULL,
    mealPlanId     INTEGER                           NOT NULL,
    CONSTRAINT FK_FOOD_CATEGORY FOREIGN KEY (foodCategoryId) REFERENCES FoodCategory (id),
    CONSTRAINT FK_MEAL_PLAN FOREIGN KEY (mealPlanId) REFERENCES MealPlan (id),
    UNIQUE (foodCategoryId, mealPlanId)
);

CREATE TABLE IF NOT EXISTS DailyPlanHistory
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    datetime   TEXT                              NOT NULL UNIQUE,
    mealPlanId INTEGER                           NOT NULL,
    CONSTRAINT FK_MEAL_PLAN FOREIGN KEY (mealPlanId) REFERENCES MealPlan (id)
);

CREATE TABLE IF NOT EXISTS DailyPlanHistoryFoodCategories
(
    id                 INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    amount             INTEGER                           NOT NULL,
    foodCategoryId     INTEGER                           NOT NULL,
    dailyPlanHistoryId INTEGER                           NOT NULL,
    CONSTRAINT FK_FOOD_CATEGORY FOREIGN KEY (foodCategoryId) REFERENCES FoodCategory (id),
    CONSTRAINT FK_DAILY_PLAN_HISTORY FOREIGN KEY (dailyPlanHistoryId) REFERENCES DailyPlanHistory (id),
    UNIQUE (foodCategoryId, dailyPlanHistoryId)
);

INSERT INTO FoodCategory(name)
VALUES ('Azúcares 🍪');
INSERT INTO FoodCategory(name)
VALUES ('Vegetales 🥦');
INSERT INTO FoodCategory(name)
VALUES ('Grasas 🥑');
INSERT INTO FoodCategory(name)
VALUES ('Alimentos Libres 🆓');
INSERT INTO FoodCategory(name)
VALUES ('Suplementos 💊');
INSERT INTO FoodCategory(name)
VALUES ('Carbohidratos 🍚');
INSERT INTO FoodCategory(name)
VALUES ('Frutas 🍌');
INSERT INTO FoodCategory(name)
VALUES ('Lácteos 🥛');
INSERT INTO FoodCategory(name)
VALUES ('Agua 💧');
INSERT INTO FoodCategory(name)
VALUES ('Carnes 🥩');

INSERT INTO MealPlan (startDateTime, endDateTime, isActive)
VALUES ('2023-12-01T00:00:00.000Z',
        '2024-02-01T00:00:00.000Z',
        '1');
SELECT *
FROM MealPlan;

INSERT INTO MealPlanFoodCategories (amount, foodCategoryId, mealPlanId)
VALUES ('1',
        '1',
        '1');

INSERT INTO MealPlanFoodCategories (amount, foodCategoryId, mealPlanId)
VALUES ('2',
        '2',
        '1');

INSERT INTO MealPlanFoodCategories (amount, foodCategoryId, mealPlanId)
VALUES ('3',
        '3',
        '1');

INSERT INTO MealPlanFoodCategories (amount, foodCategoryId, mealPlanId)
VALUES ('4',
        '4',
        '1');

INSERT INTO MealPlanFoodCategories (amount, foodCategoryId, mealPlanId)
VALUES ('5',
        '5',
        '1');

INSERT INTO MealPlanFoodCategories (amount, foodCategoryId, mealPlanId)
VALUES ('6',
        '6',
        '1');

INSERT INTO MealPlanFoodCategories (amount, foodCategoryId, mealPlanId)
VALUES ('7',
        '7',
        '1');

INSERT INTO MealPlanFoodCategories (amount, foodCategoryId, mealPlanId)
VALUES ('8',
        '8',
        '1');

INSERT INTO MealPlanFoodCategories (amount, foodCategoryId, mealPlanId)
VALUES ('9',
        '9',
        '1');

INSERT INTO MealPlanFoodCategories (amount, foodCategoryId, mealPlanId)
VALUES ('10',
        '10',
        '1');
