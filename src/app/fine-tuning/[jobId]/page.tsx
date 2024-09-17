import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '@/components/layout/Sidebar';
import JobList from '@/components/features/fine-tuning/JobList';
import JobDetails from '@/components/features/fine-tuning/JobDetails';

export default function JobPage({ params }: { params: { jobId: string } }) {
  return (
    <Flex>
      <Sidebar />
      <Box flex={1} p={8}>
        <Flex>
          <JobList />
          <JobDetails jobId={params.jobId} />
        </Flex>
      </Box>
    </Flex>
  );
}