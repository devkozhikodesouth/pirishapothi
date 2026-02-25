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
        <img
          src="/images/title.png"
          alt="TITLE"
          className=" w-full  drop-shadow-2xl p-10 -mt-30"
        />
        <img className="absolute bottom-10 md:left-50  md:w-[300px] w-[200px] h-auto" 
          src="/images/box.png"
          alt="box"
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