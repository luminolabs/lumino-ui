"use client";

import { useState, useEffect } from "react";
import {
  VStack,
  Box,
  Text,
  Spinner,
  useToast,
  Flex,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/api";
import { useParams } from "next/navigation";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

interface Job {
  id: string;
  created_at: string;
  name: string;
}

interface ApiResponse {
  data: Job[];
  pagination: {
    total_pages: number;
    current_page: number;
    items_per_page: number;
  };
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Box role="alert" p={4}>
      <Text>Error loading job list:</Text>
      <Text color="red.500">{error.message}</Text>
      <Button onClick={resetErrorBoundary} mt={2}>
        Try again
      </Button>
    </Box>
  );
}

const JobListContent = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const params = useParams();
  const selectedJobName = params?.jobName as string;
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response: ApiResponse = await fetchWithAuth(
          `/fine-tuning?page=${currentPage}`
        );
        setJobs(response.data);
        setTotalPages(response.pagination.total_pages);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error fetching jobs",
          description: "Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, toast]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <VStack align="stretch" spacing={0} height={isMobile ? "auto" : "100%"}>
      {jobs.map((job) => (
        <Link key={job.id} href={`/fine-tuning/${job.name}`} passHref>
          <Box
            p={4}
            bg={selectedJobName === job.name ? "#F3E8FF" : "transparent"}
            borderLeft={
              selectedJobName === job.name ? "4px solid #7C3AED" : "none"
            }
            cursor="pointer"
            _hover={{ bg: "#F3E8FF" }}
          >
            <Text fontWeight="medium" color="#261641">
              {job.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(job.created_at).toLocaleString()}
            </Text>
          </Box>
        </Link>
      ))}
      <Flex justify="center" p={4} borderTop="1px" borderColor="gray.200">
        <Text fontSize="sm" color="gray.600">
          Page {currentPage} of {totalPages}
        </Text>
      </Flex>
    </VStack>
  );
};

const JobList = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <JobListContent />
    </ErrorBoundary>
  );
};

export default JobList;
