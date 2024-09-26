import React, { useState, useEffect } from "react";
import { Box, Text, Spinner, useToast, VStack, Button } from "@chakra-ui/react";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

interface Dataset {
  id: string;
  created_at: string;
  name: string;
}

interface DatasetListContentProps {
  refreshTrigger: number;
  onFirstDatasetLoad: (datasetName: string | null) => void;
}

const ITEMS_PER_PAGE = 20;

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

const DatasetListContent: React.FC<DatasetListContentProps> = ({
  refreshTrigger,
  onFirstDatasetLoad,
}) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const params = useParams();
  const router = useRouter();
  const selectedDatasetName = params?.datasetName as string;
  const toast = useToast();

  const loadDatasets = async (pageToLoad: number) => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(
        `/datasets?page=${pageToLoad}&per_page=${ITEMS_PER_PAGE}`
      );
      const newDatasets = response.data;
      if (pageToLoad === 1) {
        setDatasets(newDatasets);
      } else {
        setDatasets((prevDatasets) => [...prevDatasets, ...newDatasets]);
      }
      setHasMore(newDatasets.length === ITEMS_PER_PAGE);

      if (pageToLoad === 1 && newDatasets.length > 0 && !selectedDatasetName) {
        onFirstDatasetLoad(newDatasets[0].name);
        router.push(`/datasets/${newDatasets[0].name}`);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadDatasets(1);
  }, [refreshTrigger]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadDatasets(nextPage);
  };

  return (
    <Box height="900px" overflowY="auto">
      <VStack spacing={0} align="stretch">
        {datasets.map((dataset) => (
          <Link key={dataset.id} href={`/datasets/${dataset.name}`} passHref>
            <Box
              p={4}
              bg={selectedDatasetName === dataset.name ? "#F3E8FF" : "transparent"}
              borderLeft={selectedDatasetName === dataset.name ? "4px solid #7C3AED" : "none"}
              cursor="pointer"
              _hover={{ bg: "#F3E8FF" }}
            >
              <Text fontWeight="medium" color="#261641">{dataset.name}</Text>
              <Text fontSize="sm" color="gray.500">{new Date(dataset.created_at).toLocaleString()}</Text>
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
    </Box>
  );
};

interface DatasetListProps {
  refreshTrigger: number;
  onFirstDatasetLoad: (datasetName: string | null) => void;
}

const DatasetList: React.FC<DatasetListProps> = ({
  refreshTrigger,
  onFirstDatasetLoad,
}) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DatasetListContent
        refreshTrigger={refreshTrigger}
        onFirstDatasetLoad={onFirstDatasetLoad}
      />
    </ErrorBoundary>
  );
};

export default DatasetList;