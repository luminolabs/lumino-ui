'use client'

import { useState, useEffect } from 'react';
import { Box, VStack, Heading, Text, Spinner, useToast } from '@chakra-ui/react';
import { fetchWithAuth } from '@/utils/api';

interface JobDetail {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  base_model_id: string;
  dataset_id: string;
  status: string;
  current_step: number;
  total_steps: number;
  current_epoch: number;
  total_epochs: number;
  num_tokens: number;
}

const JobDetails = ({ jobName }: { jobName: string }) => {
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const data = await fetchWithAuth(`/fine-tuning/${jobName}`);
        setJobDetails(data);
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast({
          title: 'Error fetching job details',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobName, toast]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!jobDetails) {
    return <Text>Job not found</Text>;
  }

  return (
    <Box>
      <Heading size="lg" mb={4}>{jobDetails.name}</Heading>
      <VStack align="start" spacing={2}>
        <Text><strong>Name:</strong> {jobDetails.name}</Text>
        <Text><strong>Created At:</strong> {new Date(jobDetails.created_at).toLocaleString()}</Text>
        <Text><strong>Status:</strong> {jobDetails.status}</Text>
        <Text><strong>Status:</strong> {jobDetails.status}</Text>
        <Text><strong>Status:</strong> {jobDetails.status}</Text>
        <Text><strong>Status:</strong> {jobDetails.status}</Text>
        <Text><strong>Status:</strong> {jobDetails.status}</Text>
        <Text><strong>Status:</strong> {jobDetails.status}</Text>
        {/* Add more job details here */}
      </VStack>
    </Box>
  );
};

export default JobDetails;