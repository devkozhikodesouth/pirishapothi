"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { fetchBookingsThunk } from "@/app/redux/Slice/bookingSlice";
import { Table, Spinner, Flex, Text, Button, Card, Badge } from "@radix-ui/themes";
import { RefreshCw } from "lucide-react";

export default function BookingsTable({setTotalCount}: {setTotalCount: (count: number) => void}) {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, fetchLoading, fetchError } = useSelector(
    (state: RootState) => state.booking
  );

  useEffect(() => {
    dispatch(fetchBookingsThunk());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchBookingsThunk());
    setTotalCount(bookings.length);
  };

  if (fetchLoading && bookings.length === 0) {
    return (
      <Card size="4">
        <Flex align="center" justify="center" p="5">
          <Spinner size="3" />
          <Text ml="3">Loading bookings...</Text>
        </Flex>
      </Card>
    );
  }

  if (fetchError) {
    return (
      <Card size="4">
        <Flex direction="column" align="center" justify="center" p="5" gap="3">
          <Text color="red" weight="bold">Failed to load bookings</Text>
          <Text color="gray">{fetchError}</Text>
          <Button onClick={handleRefresh} variant="soft" color="red">
            <RefreshCw size={16} /> Try Again
          </Button>
        </Flex>
      </Card>
    );
  }

  return (
    <Card size="4">
      <Flex justify="between" align="center" mb="4">
        <Text weight="bold" size="4">Recent Bookings</Text>
        <Button onClick={handleRefresh} variant="ghost" disabled={fetchLoading}>
          <RefreshCw size={16} className={fetchLoading ? "animate-spin" : ""} />
        </Button>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Place</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Sector</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell justify="center">Orders</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {bookings.map((booking) => (
            <Table.Row key={booking._id}>
              <Table.RowHeaderCell>{booking.name}</Table.RowHeaderCell>
              <Table.Cell>{booking.phone}</Table.Cell>
              <Table.Cell>{booking.place}</Table.Cell>
              <Table.Cell>{booking.sector}</Table.Cell>
              <Table.Cell>{booking.unit}</Table.Cell>
              <Table.Cell justify="center">
                <Badge color="blue" variant="soft">
                  {booking.orderCount}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                {new Date(booking.createdAt).toLocaleDateString()}
              </Table.Cell>
            </Table.Row>
          ))}

          {bookings.length === 0 && !fetchLoading && (
            <Table.Row>
              <Table.Cell colSpan={6}>
                <Flex justify="center" p="4">
                  <Text color="gray">No bookings found.</Text>
                </Flex>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
