"use client";

import { Box, Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { Mail, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, resetAuthError } from "@/app/redux/Slice/authSlice";
import { AppDispatch, RootState } from "@/app/redux/store/store";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(resetAuthError());
    }
  }, [error, dispatch]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginAdmin({ email, password }));
  };
  return (
    <Flex align="center" justify="center" style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
      <Box style={{ width: "100%", maxWidth: "400px", padding: "var(--space-4)" }}>
        <Card size="4">
          <form onSubmit={handleLogin}>
            <Flex direction="column" gap="4">
              <Box mb="2" style={{ textAlign: "center" }}>
                <Heading size="6" mb="1">Admin Login</Heading>
                <Text color="gray" size="2">Sign in to manage Pothi bookings</Text>
              </Box>

              <Box>
                <Text as="label" size="2" weight="bold" mb="1" style={{ display: "block" }}>
                  Email
                </Text>
                <TextField.Root
                  placeholder="Enter admin email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                >
                  <TextField.Slot>
                    <Mail size={16} />
                  </TextField.Slot>
                </TextField.Root>
              </Box>

              <Box>
                <Text as="label" size="2" weight="bold" mb="1" style={{ display: "block" }}>
                  Password
                </Text>
                <TextField.Root
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                >
                  <TextField.Slot>
                    <Lock size={16} />
                  </TextField.Slot>
                </TextField.Root>
              </Box>

              <Button type="submit" size="3" mt="2" loading={loading}>
                Sign In
              </Button>
            </Flex>
          </form>
        </Card>
      </Box>
    </Flex>
  );
}
