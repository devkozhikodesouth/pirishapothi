"use client";

import { Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import FirstPart from "./FirstPart";
import SectorList from "./SectorList";
import UnitList from "./UnitList";
import { RadixButton } from "../components/RadixButton";

import { bookingThunk, resetBookingState } from "@/app/redux/Slice/bookingSlice";
import type { RootState, AppDispatch } from "@/app/redux/store/store";

function BookingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error } = useSelector(
    (state: RootState) => state.booking
  );

  const [firstPart, setFirstOk] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    place: "",
    orderCount: 0,
    sector: "",
    unit: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
console.log(formData)


    dispatch(bookingThunk(formData));
  };

  return (
    <Flex
      direction="column"
      className="w-full max-w-105 rounded-2xl px-8 py-10"
      style={{
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(14px)",
        boxShadow:
          "0 30px 60px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.4)",
      }}
    >
      <Text size="8" weight="bold" className="mb-4 text-[#5A3718]">
        Book Your Pothi
      </Text>

      {/* ✅ SUCCESS MESSAGE */}
      {success && (
        <Text color="green" mb="3">
          ✅ Booking submitted successfully!
        </Text>
      )}

      {/* ❌ ERROR MESSAGE */}
      {error && (
        <Text color="red" mb="3">
          ❌ {error}
        </Text>
      )}

      <form onSubmit={handleSubmit}>
        {firstPart ? (
          <FirstPart
            formData={formData}
            setFormData={setFormData}
            setFirstOk={setFirstOk}
          />
        ) : (
          <Flex direction="column" gap="3">
            <SectorList formData={formData} setFormData={setFormData} />
            <UnitList formData={formData} setFormData={setFormData} />

            <RadixButton type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </RadixButton>
          </Flex>
        )}
      </form>
    </Flex>
  );
}

export default BookingPage;