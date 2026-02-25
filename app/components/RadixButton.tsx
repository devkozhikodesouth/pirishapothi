"use client";
import { Button } from "@radix-ui/themes";

export const RadixButton = ({ children, disabled, type,onClick }: { children: React.ReactNode; disabled?: boolean; type?: "button" | "submit" | "reset" ,onClick?: () => void}) => {
  return (
    <Button type={type} 
    disabled={disabled}
    onClick={onClick} 
      size="3"
      className="mt-8 w-full"
      style={{
        background: "linear-gradient(135deg, #C9482B, #8A3A1F)",
        color: "#FFF",
        boxShadow: "0 10px 24px rgba(201,72,43,0.45)",
      }}
    >
      {children}
    </Button>
  );
};