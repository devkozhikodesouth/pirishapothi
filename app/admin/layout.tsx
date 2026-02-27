"use client";

import { Box, Button, Flex, IconButton, Text } from "@radix-ui/themes";
import { LayoutDashboard, LogOut, Menu, Settings, Users, X, PieChart, ListOrdered } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store/store";
import { logoutAdmin } from "@/app/redux/Slice/authSlice";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Sector Wise", icon: PieChart, href: "/admin/sectorwise" },
    { name: "Unit Wise", icon: ListOrdered, href: "/admin/unitwise" },
    // { name: "Bookings", icon: Users, href: "/admin/bookings" },
    // { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <Flex style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <Box
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 40,
            display: "block",
          }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden"
        />
      )}

      {/* Sidebar */}
      <Box
        style={{
          width: "250px",
          backgroundColor: "var(--color-panel-solid)",
          borderRight: "1px solid var(--gray-5)",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: isMobileMenuOpen ? 0 : "-250px",
          transition: "left 0.3s ease-in-out",
          zIndex: 50,
        }}
        className="md:left-0!" // Always show on desktop (assuming Tailwind is available for media queries)
      >
        <Flex direction="column" style={{ height: "100%" }}>
          <Flex align="center" justify="between" p="4" style={{ borderBottom: "1px solid var(--gray-5)" }}>
            <Text weight="bold" size="5" style={{ color: "var(--accent-11)" }}>Admin Panel</Text>
            <IconButton
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </IconButton>
          </Flex>

          <Flex direction="column" flexGrow="1" p="3" gap="2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link href={item.href} key={item.name} style={{ textDecoration: 'none' }}>
                  <Button
                    variant={isActive ? "soft" : "ghost"}
                    color={isActive ? "blue" : "gray"}
                    style={{ width: "100%", justifyContent: "flex-start" }}
                    size="3"
                  >
                    <item.icon size={18} style={{ marginRight: "8px" }} />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </Flex>

          <Box p="4" style={{ borderTop: "1px solid var(--gray-5)" }}>
            <Button
              variant="soft"
              color="red"
              style={{ width: "100%", justifyContent: "flex-start" }}
              size="3"
              onClick={async () => {
                await dispatch(logoutAdmin()).unwrap();
                router.push("/admin/login");
              }}
            >
              <LogOut size={18} style={{ marginRight: "8px" }} />
              Log Out
            </Button>
          </Box>
        </Flex>
      </Box>

      {/* Main Content Area */}
      <Box
        style={{
          flex: 1,
          transition: "margin-left 0.3s ease-in-out",
          marginLeft: "0px", // Default for mobile
          minWidth: 0, // Prevent flex bugs
        }}
        className="md:ml-[250px]!" // Margin on desktop
      >
        {/* Header (Mobile Only for Hamburger) */}
        <Flex
          align="center"
          p="4"
          className="md:hidden"
          style={{
            backgroundColor: "var(--color-panel-solid)",
            borderBottom: "1px solid var(--gray-5)",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <IconButton
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(true)}
            mr="3"
          >
            <Menu size={24} />
          </IconButton>
          <Text weight="bold" size="4">Admin Panel</Text>
        </Flex>

        {/* Page Content */}
        <Box p="4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
