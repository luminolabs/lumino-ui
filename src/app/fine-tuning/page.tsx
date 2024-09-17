'use client'

import { Box, Heading, Button, Flex, Text } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import JobList from '@/components/features/fine-tuning/JobList';
import JobDetails from '@/components/features/fine-tuning/JobDetails';
import { useParams } from 'next/navigation';

export default function FineTuningPage() {
  const params = useParams();
  const jobName = params?.jobName as string;

  return (
    <Box maxWidth="1200px" margin="0 auto">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl" color="#261641">Fine-tuning Jobs</Heading>
        <Button 
          leftIcon={<FiPlus />}
          bg="#E7E0FD" 
          color="#6B46C1" 
          _hover={{ bg: '#D3C7F2' }}
        >
          Create Job
        </Button>
      </Flex>
      <Flex>
        <Box width="300px" mr={8}>
          <JobList />
        </Box>
        <Box flex={1}>
          {jobName ? (
            <JobDetails jobName={jobName} />
          ) : (
            <Text>Select a job to view details</Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}