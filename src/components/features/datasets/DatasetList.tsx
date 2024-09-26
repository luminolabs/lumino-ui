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

interface Dataset {
  id: string;
  created_at: string;
  name: string;
}

interface ApiResponse {
  data: Dataset[];
  pagination: {
    total_pages: number;
    current_page: number;
    items_per_page: number;
  };
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Box role="alert" p={4}>
      <Text>Error loading dataset list:</Text>
      <Text color="red.500">{error.message}</Text>
      <Button onClick={resetErrorBoundary} mt={2}>
        Try again
      </Button>
    </Box>
  );
}

interface DatasetListContentProps {
  refreshTrigger: number;
  onFirstDatasetLoad: (datasetName: string | null) => void;
}

const DatasetListContent: React.FC<DatasetListContentProps> = ({ refreshTrigger, onFirstDatasetLoad }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const params = useParams();
  const selectedDatasetName = params?.datasetName as string;
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setIsLoading(true);
        const response: ApiResponse = await fetchWithAuth(
          `/datasets?page=${currentPage}`
        );
        const sortedDatasets = response.data.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setDatasets(sortedDatasets);
        setTotalPages(response.pagination.total_pages);

        // If there's at least one dataset and no dataset is currently selected, select the first one
        if (sortedDatasets.length > 0 && !selectedDatasetName) {
          onFirstDatasetLoad(sortedDatasets[0].name);
          router.push(`/datasets/${sortedDatasets[0].name}`);
        } else if (sortedDatasets.length === 0) {
          onFirstDatasetLoad(null);
        }
      } catch (error) {
        console.error("Error fetching datasets:", error);
        toast({
          title: "Error fetching datasets",
          description: "Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        onFirstDatasetLoad(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatasets();
  }, [currentPage, toast, refreshTrigger, selectedDatasetName, onFirstDatasetLoad, router]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <VStack align="stretch" spacing={0} height="100%">
      {datasets.map((dataset) => (
        <Link key={dataset.id} href={`/datasets/${dataset.name}`} passHref>
          <Box
            p={4}
            bg={selectedDatasetName === dataset.name ? "#F3E8FF" : "transparent"}
            borderLeft={
              selectedDatasetName === dataset.name ? "4px solid #7C3AED" : "none"
            }
            cursor="pointer"
            _hover={{ bg: "#F3E8FF" }}
          >
            <Flex justify="space-between" alignItems="center">
              <Text fontWeight="medium" color="#261641">
                {dataset.name}
              </Text>
              <Text fontSize="sm" color="gray.500" ml={4}>
                {new Date(dataset.created_at).toLocaleString()}
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

interface DatasetListProps {
  refreshTrigger: number;
  onFirstDatasetLoad: (datasetName: string | null) => void;
}

const DatasetList: React.FC<DatasetListProps> = ({ refreshTrigger, onFirstDatasetLoad }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DatasetListContent refreshTrigger={refreshTrigger} onFirstDatasetLoad={onFirstDatasetLoad} />
    </ErrorBoundary>
  );
};

export default DatasetList;