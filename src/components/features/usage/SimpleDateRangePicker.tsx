// src/components/features/usage/SimpleDateRangePicker.tsx
import React from 'react';
import { Box, Button, HStack, Input, Text } from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';

interface SimpleDateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

const SimpleDateRangePicker: React.FC<SimpleDateRangePickerProps> = ({
  startDate,
  endDate,
  onDateRangeChange
}) => {
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value);
    onDateRangeChange(newStartDate, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value);
    onDateRangeChange(startDate, newEndDate);
  };

  const setLastThirtyDays = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29); // Last 30 days including today
    onDateRangeChange(start, end);
  };

  return (
    <Box borderWidth={1} borderRadius="md" p={2} bg="transparent" color="#261641">
      <HStack spacing={3}>
        <Text>
          Range:
        </Text>
        <Input
          type="date"
          value={formatDate(startDate)}
          onChange={handleStartDateChange}
          size="sm"
          borderColor="#4e00a6"
          color="#261641"
          _hover="#261641"
          className="custom-date-input"
        />
        <Text>-</Text>
        <Input
          type="date"
          value={formatDate(endDate)}
          onChange={handleEndDateChange}
          size="sm"
          borderColor="#4e00a6"
          color="#261641"
          _hover="#261641"
          className="custom-date-input"
        />
      </HStack>
      <style jsx global>{`
        .custom-date-input::-webkit-calendar-picker-indicator {
        filter: invert(63%) sepia(15%) saturate(1822%) hue-rotate(211deg) brightness(94%) contrast(88%);        }
      `}</style>
    </Box>
  );
};

export default SimpleDateRangePicker;