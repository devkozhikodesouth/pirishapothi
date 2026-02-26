"use client";

import { Box, Flex, Text } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import FirstPart from "./FirstPart";
import SectorList from "./SectorList";
import UnitList from "./UnitList";
import { RadixButton } from "../components/RadixButton";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const errorVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};
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
    if (!validateSecondPart(formData, setErrors)) return;
    if (!validateFirstPart(formData, setErrors)) {
      setFirstOk(true);
      return;
    }

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
      gap="6"
      className="w-full max-w-105 rounded-2xl px-10 py-12"
      style={{
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(14px)",
        boxShadow:
          "0 30px 60px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.4)",
      }}
    >
      <Text size="8" weight="bold" className="  text-[#5A3718]">
        Book Your Pirisha Pothi
      </Text>

      <AnimatePresence>
        {showError && (
          <motion.div
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25 }}
          >
            <RadixCallout error={error} />
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {firstPart ? (
            <motion.div
              key="first"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <FirstPart
                formData={formData}
                setFormData={setFormData}
                setFirstOk={setFirstOk}
                setErrors={setErrors}
                errors={errors}
              />
            </motion.div>
          ) : (
            <motion.div
              key="second"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <Flex direction="column" gap="1" mb={"2"}>
                {/* Back */}
                <motion.div
                  whileHover={{ x: -4 }}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={() => setFirstOk(true)}
                >
                  <ArrowLeft color="brown" size={25} />
                  <Text color="brown">Back</Text>
                </motion.div>

                <SectorList
                  formData={formData}
                  setFormData={setFormData}
                  errorMsg={errors.sector}
                />

                {formData.sector !== "others" && (
                  <motion.div
                    className=""
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25 }}
                  >
                    <Flex direction={"column"} mt={"4"}>
                      <UnitList
                        formData={formData}
                        setFormData={setFormData}
                        errorMsg={errors.unit}
                      />
                    </Flex>
                  </motion.div>
                )}

                <motion.div whileTap={{ scale: 0.97 }} className="w-full">
                  <Flex justify="center" mt="5" direction={'column'}>
                    <RadixButton type="submit" disabled={loading}>
                      {loading ? "Submitting..." : "Submit"}
                    </RadixButton>
                  </Flex>
                </motion.div>
              </Flex>
            </motion.div>
          )}
        </AnimatePresence>  
      </form>
    </Flex>
  );
}

export default BookingPage;
