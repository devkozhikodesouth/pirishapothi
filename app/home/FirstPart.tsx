import React from "react";
import FormInput from "../components/FormInput";
import { RadixButton } from "../components/RadixButton";
import { Flex } from "@radix-ui/themes";

function FirstPart({
  formData,
  setFormData,
  setFirstOk,
}: {
  formData: any;
  setFormData: any;
  setFirstOk: any;
}) {
  return (
    <>
      <FormInput
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        name="Full Name"
        placeholder="Enter your full name"
      />
      <FormInput
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        name="Phone Number"
        placeholder="Enter your phone number"
      />
      <FormInput
        value={formData.place}
        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
        name="Place"
        placeholder="Enter your place"
      />
      
      <FormInput
        value={formData.orderCount.toString()}
        onChange={(e) =>
          setFormData({
            ...formData,
            orderCount: parseInt(e.target.value) || 0,
          })
        }
        name="Order Count"
        placeholder="Enter order count"
      />

      <Flex justify="center" mt="4" className="w-full">
        <RadixButton type={"button"} onClick={() => setFirstOk(false)}>Continue</RadixButton>
      </Flex>
    </>
  );
}

export default FirstPart;
