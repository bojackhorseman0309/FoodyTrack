import { useEffect } from "react";
import { ScrollView, YStack } from "tamagui";

import DateSwitcher from "../../components/DateSwitcher";
import FoodCategoryNumericInput from "../../components/FoodCategoryNumericInput";
import { initializeTables, openDatabase } from "../../db/DatabaseUtils";

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
  useEffect(() => {
    initializeTables(db);
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
          />
        ))}
      </YStack>
    </ScrollView>
  );
}
