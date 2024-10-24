import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";
import { Button, Text, XStack } from "tamagui";

interface DateSwitcherProps {
  date: string;
  disableLeftChevron: boolean;
  disableRightChevron: boolean;
  onClick: (goBack: boolean) => void;
}

const DateSwitcher = ({
  date,
  disableLeftChevron,
  disableRightChevron,
  onClick,
}: DateSwitcherProps) => (
  <XStack alignItems="center" space={5}>
    <Button
      icon={ChevronLeft}
      disabled={disableLeftChevron}
      opacity={disableLeftChevron ? 0.5 : 1}
      onPress={() => onClick(true)}
    />
    <Text>{date}</Text>
    <Button
      icon={ChevronRight}
      disabled={disableRightChevron}
      opacity={disableRightChevron ? 0.5 : 1}
      onPress={() => onClick(false)}
    />
  </XStack>
);

export default DateSwitcher;
