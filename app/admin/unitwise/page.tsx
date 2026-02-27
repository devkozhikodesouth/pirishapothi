"use client";

import { Box, Card, Flex, Heading, Table, Text, Button } from "@radix-ui/themes";
import { Share2, Check } from "lucide-react";
import { useEffect, useState } from "react";

interface UnitData {
  unit: string;
  totalBookings: number;
}

export default function UnitWisePage() {
  const [data, setData] = useState<UnitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/unitwise");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result.data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate totals for footer
  const overallBookings = data.reduce((acc, curr) => acc + curr.totalBookings, 0);

  const handleShare = async () => {
    let shareText = "*Unit-Wise Summary*\n";
    shareText += "--------------------\n";
    
    if (data.length === 0) {
      shareText += "No units found.\n";
    } else {
      data.forEach(item => {
        shareText += `${item.unit || 'Unspecified'}: ${item.totalBookings}\n`;
      });
    }
    
    shareText += "--------------------\n";
    shareText += `*Total Bookings: ${overallBookings}*`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Prisha Pothi - Unit Wise",
          text: shareText,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(shareText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ height: "400px" }}>
        <Text size="4" color="gray">Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex align="center" justify="center" style={{ height: "400px" }}>
        <Text size="4" color="red">{error}</Text>
      </Flex>
    );
  }

  return (
    <Box>
      <Flex align="center" justify="between" mb="4">
        <Heading size="6">
          Unit-Wise Summary
        </Heading>
        <Button variant="soft" onClick={handleShare} disabled={data.length === 0}>
          {isCopied ? (
            <>
              <Check size={16} /> Copied!
            </>
          ) : (
            <>
              <Share2 size={16} /> Share List
            </>
          )}
        </Button>
      </Flex>

      <Card size="2" variant="surface">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Unit Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell align="right">Total Bookings</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={2} style={{ textAlign: "center", padding: "2rem" }}>
                  <Text color="gray">No units found</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              data.map((item, index) => (
                <Table.Row key={index}>
                  <Table.RowHeaderCell>{item.unit || 'Unspecified'}</Table.RowHeaderCell>
                  <Table.Cell align="right">{item.totalBookings}</Table.Cell>
                </Table.Row>
              ))
            )}
            
            {data.length > 0 && (
              <Table.Row style={{ backgroundColor: "var(--gray-3)" }}>
                <Table.RowHeaderCell><Text weight="bold">Total</Text></Table.RowHeaderCell>
                <Table.Cell align="right"><Text weight="bold">{overallBookings}</Text></Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
}
