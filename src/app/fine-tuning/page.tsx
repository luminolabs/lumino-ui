'use client'

import { Box, Flex, Heading, Button, Text, Spinner, useBreakpointValue } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

const JobList = dynamic(() => import('@/components/features/fine-tuning/JobList'), {
  loading: () => <Spinner />,
  ssr: false
});

const JobDetails = dynamic(() => import('@/components/features/fine-tuning/JobDetails'), {
  loading: () => <Spinner />,
  ssr: false
});

export default function FineTuningPage() {
  const params = useParams();
  const jobName = params?.jobName as string;
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p={4} bg="gray.50" minH="calc(100vh - 64px)"> {/* Adjust 64px if your header height is different */}
      <Flex mb={6} direction={isMobile ? "column" : "row"} justify="space-between" align={isMobile ? "stretch" : "center"}>
        <Heading size="lg" color="#261641" mb={isMobile ? 4 : 0}>Fine-tuning</Heading>
        <Button 
          leftIcon={<FiPlus />}
          bg="#7C3AED" 
          color="white" 
          _hover={{ bg: '#6D28D9' }}
          width={isMobile ? "100%" : "auto"}
        >
          Create Job
        </Button>
      </Flex>
      <Flex direction={isMobile ? "column" : "row"}>
        <Box width={isMobile ? "100%" : "300px"} bg="white" borderRadius="md" boxShadow="sm" mb={isMobile ? 4 : 0} mr={isMobile ? 0 : 6}>
          <Suspense fallback={<Spinner />}>
            <JobList />
          </Suspense>
        </Box>
      </Flex>
    </Box>
  );
}