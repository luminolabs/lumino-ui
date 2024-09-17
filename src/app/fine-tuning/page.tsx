import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '@/components/layout/Sidebar';
import JobList from '@/components/features/fine-tuning/JobList';

export default function FineTuningPage() {
  return (
    <Flex>
      <Sidebar />
      <Box flex={1} p={8}>
        <JobList />
      </Box>
    </Flex>
  );
}