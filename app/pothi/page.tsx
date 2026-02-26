"use client";
import { motion, Variants } from "framer-motion";
import { Flex } from "@radix-ui/themes";
import BookingPage from "./BookingPage";

const posterVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const boxVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 0.3, ease: "easeOut" },
  },
};

const formVariant: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: 0.2, ease: "easeOut" },
  },
};
const page = () => {
  return (
    <Flex
      minHeight="100vh"
      px={{ initial: "4", md: "9" }}
      py="9"
      direction={{ initial: "column", md: "row" }}
      style={{
        background: `
          radial-gradient(circle at top left, #F6EED6 0%, transparent 45%),
          radial-gradient(circle at bottom right, #F6EED6 0%, transparent 40%),
          linear-gradient(135deg, #EFE6C8 0%, #F6EED6 50%, #F6EED6 100%)
        `,
      }}
    >
      {/* Poster */}
      <Flex
        className="relative"
        width={{ initial: "100%", md: "50%" }}
        align="center"
        justify="center"
      >
        <motion.div
          variants={posterVariant}
          initial="hidden"
          animate="visible"
          className="w-full flex items-center justify-center relative"
        >
          <img
            src="/images/title.png"
            alt="TITLE"
            className="w-full absolute drop-shadow-2xl  p-10 md:p-2 mt-30 md:-mt-30"
          />

          <motion.img
            variants={boxVariant}
            initial="hidden"
            animate="visible"
            className="absolute -bottom-60 md:-bottom-70 md:left-50 md:w-[350px] w-[200px] h-auto"
            src="/images/box.png"
            alt="box"
          />
        </motion.div>
      </Flex>
<Flex direction={'column'} justify={'center'} align={'center'} width={{initial:'100%',md:'50%'}}>

      {/* Form */}
      <motion.div
        variants={formVariant}
        initial="hidden"
        animate="visible"
        className="w-full flex items-center  justify-center mt-[50%] md:mt-0"
      >
        <BookingPage />
      </motion.div>
    </Flex>
        </Flex>
  );
};

export default page;
