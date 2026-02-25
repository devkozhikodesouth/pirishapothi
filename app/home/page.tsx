'use client';
import { Flex } from "@radix-ui/themes";
import BookingPage from "./BookingPage";

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
          radial-gradient(circle at bottom right, #C9482B 0%, transparent 40%),
          linear-gradient(135deg, #EFE6C8 0%, #E6C7A8 50%, #8A5A2B 100%)
        `,
      }}
    >
      {/* Poster */}
      <Flex
        width={{ initial: "100%", md: "50%" }}
        align="center"
        justify="center"
        mb={{ initial: "7", md: "0" }}
      >
        <img
          src="/images/title.png"
          alt="TITLE"
          className=" w-full  drop-shadow-2xl p-10"
        />
      </Flex>

      {/* Form */}
      <Flex
        width={{ initial: "100%", md: "50%" }}  
        align="center"
        justify="center"
      >
        <BookingPage />
      </Flex>
    </Flex>
  );
};

export default page;