'use client'

import { useState, useEffect } from 'react';
import { Box, Heading, VStack, HStack, Text, Spinner } from '@chakra-ui/react';
import { FiCheck, FiCpu, FiBox, FiClock, FiHash, FiRepeat, FiGrid, FiZap, FiDatabase } from 'react-icons/fi';
import Icon from '@/components/common/Icon';

interface JobDetail {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const JobDetails = ({ jobId }: { jobId: string }) => {
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data: JobDetail = await response.json();
        setJobDetails(data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!jobDetails) {
    return <Text>Job not found</Text>;
  }

  const details = [
    { icon: FiCheck, label: 'Status', value: 'Success' },
    { icon: FiCpu, label: 'Base Model', value: 'llama 3.1.8b' },
    { icon: FiBox, label: 'Output Model', value: `llama 3.1.8b-job-${jobDetails.id}` },
    { icon: FiClock, label: 'Created At', value: new Date(2023, 0, jobDetails.userId).toLocaleString() },
    { icon: FiHash, label: 'Trained Tokens', value: (jobDetails.body.length * 100).toString() },
    { icon: FiRepeat, label: 'Epochs', value: jobDetails.userId.toString() },
    { icon: FiGrid, label: 'Batch Size', value: (jobDetails.userId % 8 + 1).toString() },
    { icon: FiZap, label: 'LR Multiplier', value: (jobDetails.userId % 5 + 1).toString() },
    { icon: FiZap, label: 'Seed', value: (jobDetails.id * 10000).toString() },
    { icon: FiDatabase, label: 'Dataset', value: 'mathinstruct.jsonl' },
  ];

  return (
    <Box flex={1} pl={4}>
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Job {jobDetails.id}: {jobDetails.title}</Heading>
        {details.map((detail, index) => (
          <HStack key={index} spacing={4}>
            <Icon as={detail.icon} color="purple.500" />
            <Text fontWeight="bold" width="120px">{detail.label}</Text>
            <Text>{detail.value}</Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default JobDetails;