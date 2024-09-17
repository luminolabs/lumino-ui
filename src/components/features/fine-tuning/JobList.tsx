'use client'

import { useState, useEffect } from 'react';
import { VStack, Box, Text, Spinner } from '@chakra-ui/react';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;
  createdAt: string;
}

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5100/v1/fine-tuning?');
        console.log(response);
        
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
    <VStack align="stretch" spacing={2}>
      {jobs.map((job) => (
        <Link key={job.id} href={`/fine-tuning/${job.id}`} passHref>
          <Box 
            p={3} 
            bg="#F8F5FF" 
            borderRadius="md" 
            cursor="pointer"
            _hover={{ bg: '#EFE9FF' }}
          >
            <Text color="#261641" fontWeight="medium">Job {job.id}: {job.title.slice(0, 20)}...</Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(2023, 0, job.id).toLocaleString()}
            </Text>
          </Box>
        </Link>
      ))}
    </VStack>
  );
};

export default JobList;