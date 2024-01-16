import { LinearGradient } from "@tamagui/linear-gradient";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import {
  Adapt,
  FontSizeTokens,
  getFontSize,
  Select,
  SelectProps,
  Sheet,
  YStack,
} from "tamagui";

import { MealPlan } from "../models/DatabaseModels";
import { formatDate } from "../utils/DateUtils";

interface MealPlanSelectProps {
  mealPlans: MealPlan[];
  onSelectMealPlan: (id: number) => void;
}

const MealPlanSelect = (props: SelectProps & MealPlanSelectProps) => {
  const [val, setVal] = useState("0");

  useEffect(() => {
    if (props.mealPlans.length > 0 && val === "0") {
      setMealPlan(props.mealPlans[0].id.toString());
    }
  }, [props.mealPlans]);

  const setMealPlan = (id: string) => {
    setVal(id);
    props.onSelectMealPlan(Number(id));
  };

  if (val !== "0") {
    return (
      <Select
        id="mealPlan"
        value={val}
        onValueChange={setMealPlan}
        disablePreventBodyScroll
        {...props}
      >
        <Select.Trigger width={220} iconAfter={ChevronDown}>
          <Select.Value placeholder="Something" />
        </Select.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet
            native={!!props.native}
            modal
            dismissOnSnapToBottom
            animationConfig={{
              type: "spring",
              damping: 20,
              mass: 1.2,
              stiffness: 250,
            }}
          >
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronUp size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={["$background", "transparent"]}
              borderRadius="$4"
            />
          </Select.ScrollUpButton>

          <Select.Viewport
            animation="quick"
            animateOnly={["transform", "opacity"]}
            enterStyle={{ o: 0, y: -10 }}
            exitStyle={{ o: 0, y: 10 }}
            minWidth={200}
          >
            <Select.Group>
              <Select.Label>Meal Plans</Select.Label>

              {props.mealPlans.map((mealPlan, i) => {
                return (
                  <Select.Item
                    index={i}
                    key={mealPlan.id}
                    value={mealPlan.id.toString()}
                  >
                    <Select.ItemText>
                      {`${formatDate(
                        new Date(mealPlan.startDateTime),
                      )} - ${formatDate(new Date(mealPlan.endDateTime))}`}
                    </Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.Group>
            {props.native && (
              <YStack
                position="absolute"
                right={0}
                top={0}
                bottom={0}
                alignItems="center"
                justifyContent="center"
                width="$4"
                pointerEvents="none"
              >
                <ChevronDown
                  size={getFontSize((props.size as FontSizeTokens) ?? "$true")}
                />
              </YStack>
            )}
          </Select.Viewport>

          <Select.ScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronDown size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={["transparent", "$background"]}
              borderRadius="$4"
            />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    );
  }
};

export default MealPlanSelect;
