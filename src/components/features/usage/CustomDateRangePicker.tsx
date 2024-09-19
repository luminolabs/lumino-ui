import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CustomDateRangePickerProps {
  dateRange: { startDate: Date; endDate: Date };
  setDateRange: (dateRange: { startDate: Date; endDate: Date }) => void;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({ dateRange, setDateRange }) => {
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setDateRange({ ...dateRange, startDate: date });
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setDateRange({ ...dateRange, endDate: date });
    }
  };

  return (
    <Flex bg="gray.900" p={1} borderRadius="md" align="center">
      <Box mr={2}>
        <DatePicker
          selected={dateRange.startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          customInput={<Text color="white" cursor="pointer">{dateRange.startDate.toLocaleDateString()}</Text>}
        />
      </Box>
      <Text color="white">-</Text>
      <Box ml={2}>
        <DatePicker
          selected={dateRange.endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          minDate={dateRange.startDate}
          customInput={<Text color="white" cursor="pointer">{dateRange.endDate.toLocaleDateString()}</Text>}
        />
      </Box>
    </Flex>
  );
};

export default CustomDateRangePicker;