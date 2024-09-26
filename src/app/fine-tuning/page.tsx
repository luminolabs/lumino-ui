'use client'

import React, { useState } from 'react';
import { Box, Flex, Heading, Button, Text, Spinner, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import CreateFineTunedModelModal from '@/components/features/fine-tuning/CreateFineTunedModelModal';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const JobList = dynamic(() => import('@/components/features/fine-tuning/JobList'), {
  loading: () => <Spinner />,
  ssr: false
});

const JobDetails = dynamic(() => import('@/components/features/fine-tuning/JobDetails'), {
  loading: () => <Spinner />,
  ssr: false
});

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Box width="24px" height="24px">
    {children}
  </Box>
);

export default function FineTuningPage() {
  const params = useParams();
  const jobName = params?.jobName as string;
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [firstJob, setFirstJob] = useState<string | null>(null);

  const handleJobCreationSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    console.log('Job created successfully. Refreshing list...');
  };

  const handleFirstJobLoad = (jobName: string | null) => {
    setFirstJob(jobName);
  };

  return (
    <Box p={4} bg="gray.50" minH="calc(100vh - 64px)">
      <Flex mb={6} direction={isMobile ? "column" : "row"} justify="space-between" align={isMobile ? "stretch" : "center"}>
        <Heading size="lg" color="#261641" mb={isMobile ? 4 : 0}>Fine-tuning</Heading>
        <Button 
          leftIcon={<IconWrapper> <PlusCircleIcon /></IconWrapper>}
          color="white"
          bg="#4e00a6"
          _hover={{ bg: "#0005A6" }}
          width={isMobile ? "100%" : "auto"}
          onClick={onOpen}
        >
          Create Job
        </Button>
      </Flex>
      <Flex direction={isMobile ? "column" : "row"}>
        <Box width={isMobile ? "100%" : "35%"} bg="white" borderRadius="md" boxShadow="sm" mb={isMobile ? 4 : 0} mr={isMobile ? 0 : 6}>
          <Suspense fallback={<Spinner />}>
            <JobList refreshTrigger={refreshTrigger} onFirstJobLoad={handleFirstJobLoad} />
          </Suspense>
        </Box>
        {(jobName || firstJob) && (
          <Box flex={1} bg="white" borderRadius="md" boxShadow="sm" p={6} width={isMobile ? "100%" : "35%"}>
            <Suspense fallback={<Spinner />}>
              <JobDetails jobName={jobName || firstJob || ''} />
            </Suspense>
          </Box>
        )}
      </Flex>
      <CreateFineTunedModelModal isOpen={isOpen} onClose={onClose} onCreationSuccess={handleJobCreationSuccess} />
    </Box>
  );
}
