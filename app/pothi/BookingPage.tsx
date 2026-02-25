"use client";

import { Box, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import FirstPart from "./FirstPart";
import SectorList from "./SectorList";
import UnitList from "./UnitList";
import { RadixButton } from "../components/RadixButton";

import {
  bookingThunk,
  resetBookingState,
} from "@/app/redux/Slice/bookingSlice";
import type { RootState, AppDispatch } from "@/app/redux/store/store";
import { ArrowLeft } from "lucide-react";
import { validateSecondPart } from "../utils/secondValidation";
import RadixCallout from "../components/RadixCallout";
import { validateFirstPart } from "../utils/FirstValidation";

function BookingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, error } = useSelector(
    (state: RootState) => state.booking,
  );


  const [firstPart, setFirstOk] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    place: "",
    orderCount: 1,
    sector: "",
    unit: "",
  });
const [errors, setErrors] = useState<Record<string, string>>({});
const [showError, setShowError] = useState(false);
useEffect(() => {
  if (error) {
    setShowError(true);

    const timer = setTimeout(() => {
      setShowError(false);
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [error]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateSecondPart(formData,setErrors)) return;
    if (!validateFirstPart(formData,setErrors)) {setFirstOk(true); return};

    

    dispatch(bookingThunk(formData));


  };
useEffect(() => {
  if (success) {
    Swal.fire({
      icon: "success",
      title: "Booking Successful 🎉",
      text: "Your Pothi booking has been submitted successfully.",
      confirmButtonText: "OK",
      confirmButtonColor: "#5A3718",
      timer: 2500,
      timerProgressBar: true,
    });

    // Reset form
    setFirstOk(true);
    setFormData({
      name: "",
      phone: "",
      place: "",
      orderCount: 1,
      sector: "",
      unit: "",
    });

    // Reset redux after alert
    dispatch(resetBookingState());
  }
}, [success, dispatch]);

  return (
    <Flex
      direction="column"
      gap={"5"}
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



      
{showError && <RadixCallout error={error} />}

      <form onSubmit={handleSubmit}>
        {firstPart ? (
          <FirstPart
            formData={formData}
            setFormData={setFormData}
            setFirstOk={setFirstOk}
            setErrors={setErrors}
            errors={errors}
          />
        ) : (
          <Flex direction="column" gap="3" mt={"4"}>
            <Flex
              direction="row"
              gap="3"
              onClick={() => setFirstOk(true)}
              style={{ cursor: "pointer" }}
            >
              <ArrowLeft color="brown" size={25} />
              <Text color="brown">Back</Text>
            </Flex>
            <Flex direction="column" >
              <SectorList formData={formData} setFormData={setFormData}   errorMsg={errors.sector} />
            </Flex>
           {formData.sector!=="others" &&  <Flex direction="column" mt={"3"}>
              <UnitList formData={formData} setFormData={setFormData} errorMsg={errors.unit} />
            </Flex>}

            <Flex justify="center" mt="5" direction={"column"}>
              <RadixButton type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </RadixButton>
            </Flex>
          </Flex>
        )}
      </form>
    </Flex>
  );
}

export default BookingPage;
