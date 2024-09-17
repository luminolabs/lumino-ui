'use client'

import { useState, useEffect } from 'react';
import { VStack, Box, Text, Spinner, useToast, Button } from '@chakra-ui/react';
import Link from 'next/link';
import { fetchWithAuth } from '@/utils/api';

interface Job {
  id: string;
  created_at: string;
  updated_at: string;
  name: string
  // base_model_name: string;
  // dataset_name: string;
}

interface ApiResponse {
  data: Job[];
  pagination: {
    total_pages: number;
    current_page: number;
    items_per_page: number;
  };
}

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  const fetchJobs = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response: ApiResponse = await fetchWithAuth(`/fine-tuning?page=${page}`);
      setJobs(response.data);
      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.total_pages);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      toast({
        title: 'Error fetching jobs',
        description: error instanceof Error ? error.message : 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">Error: {error}</Text>;
  }

  return (
    <VStack align="stretch" spacing={4}>
      {jobs.map((job) => (
        <Link key={job.name} href={`/fine-tuning/${job.name}`} passHref>
          <Box 
            p={3} 
            bg="#F8F5FF" 
            borderRadius="md" 
            cursor="pointer"
            _hover={{ bg: '#EFE9FF' }}
          >
            <Text color="#261641" fontWeight="medium">Job Name: {job.name}</Text>
            <Text fontSize="sm" color="gray.500">
              Created: {new Date(job.created_at).toLocaleString()}
            </Text>
            {/* <Text fontSize="sm" color="gray.500">
              Base Model: {job.base_model_name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Dataset: {job.dataset_name}
            </Text> */}
          </Box>
        </Link>
      ))}
      <Box>
        <Button 
          disabled={currentPage === 1} 
          onClick={() => fetchJobs(currentPage - 1)}
        >
          Previous
        </Button>
        <Text display="inline" mx={2}>
          Page {currentPage} of {totalPages}
        </Text>
        <Button 
          disabled={currentPage === totalPages} 
          onClick={() => fetchJobs(currentPage + 1)}
        >
          Next
        </Button>
      </Box>
    </VStack>
  );
};

export default JobList;