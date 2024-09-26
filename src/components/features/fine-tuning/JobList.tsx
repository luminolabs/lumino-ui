import { useState, useEffect } from "react";
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

interface JobListContentProps {
  refreshTrigger: number;
  onFirstJobLoad: (jobName: string | null) => void;
}

const JobListContent: React.FC<JobListContentProps> = ({ refreshTrigger, onFirstJobLoad }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const params = useParams();
  const selectedJobName = params?.jobName as string;
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response: ApiResponse = await fetchWithAuth(
          `/fine-tuning?page=${currentPage}`
        );
        const sortedJobs = response.data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setJobs(sortedJobs);
        setTotalPages(response.pagination.total_pages);

        // If there's at least one job and no job is currently selected, select the first one
        if (sortedJobs.length > 0 && !selectedJobName) {
          onFirstJobLoad(sortedJobs[0].name);
          router.push(`/fine-tuning/${sortedJobs[0].name}`);
        } else if (sortedJobs.length === 0) {
          onFirstJobLoad(null);
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
        onFirstJobLoad(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, toast, refreshTrigger, selectedJobName, onFirstJobLoad, router]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <VStack align="stretch" spacing={0} height="100%">
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
      <Flex justify="center" p={4} borderTop="1px" borderColor="gray.200" marginTop="auto">
        <Text fontSize="sm" color="gray.600">
          {totalPages === 0 ? 
            `Page 0 of 0` :
            `Page ${currentPage} of ${totalPages}`
          }
        </Text>
      </Flex>
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
