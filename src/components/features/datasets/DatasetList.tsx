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

const DatasetListContent = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const params = useParams();
  const selectedDatasetName = params?.datasetName as string;
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setIsLoading(true);
        const response: ApiResponse = await fetchWithAuth(
            `/datasets?page=${currentPage}`
        );
        setDatasets(response.data);
        setTotalPages(response.pagination.total_pages);
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

    fetchDatasets();
  }, [currentPage, toast]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
      <VStack align="stretch" spacing={0} height={isMobile ? "auto" : "100%"}>
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
                <Flex justify="space-between" align="center" whiteSpace="nowrap">
                  <Text fontWeight="medium" color="#261641" isTruncated>
                    {dataset.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500" isTruncated>
                    {new Date(dataset.created_at).toLocaleString()}
                  </Text>
                </Flex>
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

const DatasetList = () => {
  return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DatasetListContent />
      </ErrorBoundary>
  );
};

export default DatasetList;