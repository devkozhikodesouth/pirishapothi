import { Callout, Flex } from "@radix-ui/themes";

export default function RadixCallout({error}: {error: string|null}) {
    return (
    <Flex direction="column" gap="3">
<Callout.Root color="red">
		<Callout.Icon>
			{/* <InfoCircledIcon /> */}
		</Callout.Icon>
		<Callout.Text>
			{error}
		</Callout.Text>
	</Callout.Root>
</Flex>

    );
}