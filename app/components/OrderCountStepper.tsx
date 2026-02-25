"use client";

import { Flex, Text } from "@radix-ui/themes";
import { Minus, Plus } from "lucide-react";
import { RadixButton } from "./RadixButton";

interface Props {
  value: number;
  onChange: (val: number) => void;
  error?: string;
  min?: number;
}

export default function OrderCountStepper({
  value,
  onChange,
  error,
  min = 1,
}: Props) {
  return (
    <Flex direction="column" px={'7'}>
      <Text weight="medium">Order Count</Text>

      <Flex
        align="center"
        justify="between"
        className="w-full rounded-lg border px-4 py-3"
        style={{
          backgroundColor: "#FFFDF8",
          borderColor: error ? "#E5484D" : "#E6C7A8",
        }}
      >
        {/* Minus */}
        <RadixButton
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          <Minus size={18} />
        </RadixButton>

        {/* Count */}
        <Text size="5" weight="bold">
          {value}
        </Text>

        {/* Plus */}
        <RadixButton
          type="button"
          onClick={() => onChange(value + 1)}
        >
          <Plus size={18} />
        </RadixButton>
      </Flex>

      {error && (
        <Text color="red" size="2">
          {error}
        </Text>
      )}
    </Flex>
  );
}