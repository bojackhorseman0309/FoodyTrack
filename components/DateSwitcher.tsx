import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";
import { Button, Text, XStack } from "tamagui";

interface DateSwitcherProps {
  date: string;
  disableLeftChevron: boolean;
  disableRightChevron: boolean;
  onClick: () => void;
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
    />
    <Text>{date}</Text>
    <Button
      icon={ChevronRight}
      disabled={disableRightChevron}
      opacity={disableRightChevron ? 0.5 : 1}
    />
  </XStack>
);

export default DateSwitcher;
