import { Text } from "@radix-ui/themes";

export const ErrorText = ({ msg }: { msg?: string }) =>
  msg ? (
    <Text color="red" size="2">
      {msg}
    </Text>
  ) : null;