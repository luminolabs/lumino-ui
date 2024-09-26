'use client'

import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Button, Text, Spinner, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const jobName = params?.jobName as string;
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasJobs, setHasJobs] = useState(false);

  useEffect(() => {
    // Check if there are any jobs
    const checkJobs = async () => {
      try {
        const response = await fetch('/api/proxy/v1/fine-tuning?page=1');
        const data = await response.json();
        setHasJobs(data.data.length > 0);
        if (data.data.length > 0 && !jobName) {
          // If there are jobs but no job is selected, redirect to the first job
          router.push(`/fine-tuning/${data.data[0].name}`);
        }
      } catch (error) {
        console.error('Error checking jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkJobs();
  }, [jobName, router]);

  const handleJobCreationSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    console.log('Job created successfully. Refreshing list...');
  };

  if (isLoading) {
    return <Spinner />;
  }

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
            <JobList refreshTrigger={refreshTrigger} onFirstJobLoad={() => {}} />
          </Suspense>
        </Box>
        {jobName && (
          <Box flex={1} bg="white" borderRadius="md" boxShadow="sm" p={6} width={isMobile ? "100%" : "35%"}>
            <Suspense fallback={<Spinner />}>
              <JobDetails jobName={jobName} />
            </Suspense>
          </Box>
        )}
        {!jobName && hasJobs && (
          <Box flex={1} bg="white" borderRadius="md" boxShadow="sm" p={6} width={isMobile ? "100%" : "35%"}>
            <Text color="gray.500">Select a job to view details</Text>
          </Box>
        )}
      </Flex>
      <CreateFineTunedModelModal isOpen={isOpen} onClose={onClose} onCreationSuccess={handleJobCreationSuccess} />
    </Box>
  );
}
