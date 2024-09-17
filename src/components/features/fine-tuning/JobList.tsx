'use client'

import { useState, useEffect } from 'react';
import { VStack, Heading, Button, Box, Text, Spinner } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;  // We'll use this as the job name
  userId: number; // We'll use this to generate a fake timestamp
}

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5100/v1/fine-tuning?=null');
        console.log(response)
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data: Job[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box width="300px" pr={4}>
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Fine-tuning Jobs</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="purple">
          Create Job
        </Button>
        <VStack align="stretch" spacing={2}>
          {jobs.map((job) => (
            <Link key={job.id} href={`/fine-tuning/${job.id}`} passHref>
              <Box p={2} bg="purple.50" borderRadius="md" cursor="pointer">
                <Text>Job {job.id}: {job.title.slice(0, 20)}...</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(2023, 0, job.userId).toLocaleString()}
                </Text>
              </Box>
            </Link>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default JobList;