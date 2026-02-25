  "use client";
  import { Box, Flex, Text, TextField } from "@radix-ui/themes";
import { ErrorText } from "./ErrorText";

  function FormInput({
    name,
    value,
    onChange,   
    placeholder,
    type,
    error
  }: {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    placeholder: string;  
    type: "text" | "number" | "tel";
    error: string;
  }) {
    return (
      <Box  mb="3" >
        <Text size="2" weight="medium" className="text-[#7A4A1F]">
          {name}
        </Text>

        <TextField.Root
          size="3"
          type={type}
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
        <ErrorText msg={error} />
      </Box>
    );
  }

  export default FormInput;
