import React, { useState, useEffect } from "react";
import {
  VStack,
  Box,
  Text,
  Spinner,
  useToast,
  Flex,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

interface Job {
  id: string;
  created_at: string;
  name: string;
}

interface JobListContentProps {
  refreshTrigger: number;
  onFirstJobLoad: (jobName: string | null) => void;
}

const ITEMS_PER_PAGE = 20;

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

const JobListContent: React.FC<JobListContentProps> = ({ refreshTrigger, onFirstJobLoad }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const params = useParams();
  const selectedJobName = params?.jobName as string;
  const toast = useToast();
  const router = useRouter();

  const loadJobs = async (pageToLoad: number) => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`/fine-tuning?page=${pageToLoad}&per_page=${ITEMS_PER_PAGE}`);
      const newJobs = response.data;
      if (pageToLoad === 1) {
        setJobs(newJobs);
      } else {
        setJobs((prevJobs) => [...prevJobs, ...newJobs]);
      }
      setHasMore(newJobs.length === ITEMS_PER_PAGE);

      if (pageToLoad === 1 && newJobs.length > 0 && !selectedJobName) {
        onFirstJobLoad(newJobs[0].name);
        router.push(`/fine-tuning/${newJobs[0].name}`);
      }
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

  useEffect(() => {
    setPage(1);
    loadJobs(1);
  }, [refreshTrigger]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadJobs(nextPage);
  };

  return (
    <VStack align="stretch" spacing={0} height="700px">
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
            <Flex justify="space-between" alignItems="center">
              <Text fontWeight="medium" color="#261641">
                {job.name}
              </Text>
              <Text fontSize="sm" color="gray.500" ml={4}>
                {new Date(job.created_at).toLocaleString()}
              </Text>
            </Flex>
          </Box>
        </Link>
      ))}
      {isLoading && (
        <Box p={4} textAlign="center">
          <Spinner />
        </Box>
      )}
      {!isLoading && hasMore && (
        <Box p={4} textAlign="center">
          <Button
            onClick={handleLoadMore}
            color="white"
            bg="#4e00a6"
            _hover={{ bg: "#0005A6" }}
          >
            Load More
          </Button>
        </Box>
      )}
    </VStack>
  );
};

interface JobListProps {
  refreshTrigger: number;
  onFirstJobLoad: (jobName: string | null) => void;
}

const JobList: React.FC<JobListProps> = ({ refreshTrigger, onFirstJobLoad }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <JobListContent refreshTrigger={refreshTrigger} onFirstJobLoad={onFirstJobLoad} />
    </ErrorBoundary>
  );
};

export default JobList;
