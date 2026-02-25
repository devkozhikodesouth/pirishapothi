"use client";
import { Flex, Text, TextField } from "@radix-ui/themes";

function FormInput({
  name,
  value,
  onChange,   
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder: string;
}) {
  return (
    <Flex direction="column" gap="1">
      <Text size="3" weight="medium" className="text-[#7A4A1F]">
        {name}
      </Text>

      <TextField.Root
        size="3"
        value={value}
        onChange={onChange}
        radius="large"
        placeholder={placeholder}
        className="w-full"
        style={{
          backgroundColor: "#FFFDF8",
          border: "1px solid #E6C7A8",
        }}
      />
    </Flex>
  );
}

export default FormInput;
