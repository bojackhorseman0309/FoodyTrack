import { useEffect, useState } from "react";
import { Button, ScrollView, YStack } from "tamagui";

import FoodCategoryInput from "../../components/FoodCategoryInput";
import { openDatabase } from "../../db/DatabaseUtils";

const db = openDatabase();

export default function ManageFoodCategoriesScreen() {
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [foodCategories, setFoodCategories] = useState<any[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    setAddNewCategory(false);
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT *
                 FROM FoodCategory;`,
        [],
        (_, { rows: { _array } }) => setFoodCategories(_array),
      );
    });
  }, [forceUpdate]);

  const onSave = (name: string, id: number | undefined) => {
    if (id) {
      db.transaction(
        (tx) => {
          tx.executeSql("UPDATE FoodCategory SET name = ? WHERE id = ?", [
            name,
            id,
          ]);
        },
        undefined,
        () => setForceUpdate(forceUpdate + 1),
      );
    } else {
      db.transaction(
        (tx) => {
          tx.executeSql("INSERT INTO FoodCategory (name) values (?)", [name]);
        },
        undefined,
        () => setForceUpdate(forceUpdate + 1),
      );
    }
  };

  const onDelete = (id: number) => {
    db.transaction(
      (tx) => {
        tx.executeSql("DELETE FROM FoodCategory WHERE id = ?", [id]);
      },
      undefined,
      () => setForceUpdate(forceUpdate + 1),
    );
  };

  return (
    <ScrollView
      backgroundColor="#FFF0F5"
      contentContainerStyle={{ padding: 15 }}
    >
      <YStack space="$5">
        <Button
          size="$3"
          theme="active"
          alignSelf="flex-start"
          onPress={() => setAddNewCategory(true)}
        >
          Add
        </Button>
        <YStack space="$3">
          {addNewCategory && (
            <FoodCategoryInput
              name=""
              isEdit
              onSave={(name, id) => onSave(name, id)}
              onDelete={onDelete}
            />
          )}
          {foodCategories.map((foodCategory) => (
            <FoodCategoryInput
              key={foodCategory.id}
              id={foodCategory.id}
              name={foodCategory.name}
              isEdit={false}
              onSave={(name, id) => onSave(name, id)}
              onDelete={onDelete}
            />
          ))}
        </YStack>
      </YStack>
    </ScrollView>
  );
}
