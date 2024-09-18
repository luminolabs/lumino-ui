'use client';

import React, { Suspense } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Spinner,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import UploadDatasetModal from '@/components/features/datasets/UploadDatasetModal';

// Dynamically load components
const DatasetList = dynamic(() => import('@/components/features/datasets/DatasetList'), {
  loading: () => <Spinner />,
  ssr: false,
});

const DatasetDetails = dynamic(() => import('@/components/features/datasets/DatasetDetails'), {
  loading: () => <Spinner />,
  ssr: false,
});

export default function FineTuningPage() {
  const params = useParams();
  const datasetName = params?.datasetName as string;
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
      <Box p={4} bg="gray.50" minH="calc(100vh - 64px)">
        {/* Heading and Upload Button */}
        <Flex
            mb={6}
            direction={isMobile ? 'column' : 'row'}
            justify="space-between"
            align={isMobile ? 'stretch' : 'center'}
        >
          <Heading size="lg" color="#261641" mb={isMobile ? 4 : 0}>
            Datasets
          </Heading>
          <Button
              leftIcon={<FiPlus />}
              bg="#7C3AED"
              color="white"
              _hover={{ bg: '#6D28D9' }}
              width={isMobile ? '100%' : 'auto'}
              onClick={onOpen}
          >
            Upload Dataset
          </Button>
        </Flex>

        {/* Dataset List and Details Section */}
        <Flex direction="row" height="100%" justifyContent="space-between">
          {/* Dataset List (left pane, 50% width) */}
          <Box
              flex="1" // Set to take up 50% of available width
              maxWidth="50%" // Ensures it does not exceed 50% width
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              p={4}
              mr={6} // Adds space between the two sections
              overflowY="auto" // Scroll if the list overflows
          >
            <Suspense fallback={<Spinner />}>
              <DatasetList />
            </Suspense>
          </Box>

          {/* Dataset Details (right pane, 50% width) */}
          <Box
              flex="1" // Set to take up 50% of available width
              maxWidth="50%" // Ensures it does not exceed 50% width
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              p={6}
              overflowY="auto" // Scroll if the content overflows
          >
            <Suspense fallback={<Spinner />}>
              {datasetName ? (
                  <DatasetDetails datasetName={datasetName} />
              ) : (
                  <Text color="gray.500">Select a dataset to view details</Text>
              )}
            </Suspense>
          </Box>
        </Flex>

        {/* Upload Dataset Modal */}
        <UploadDatasetModal isOpen={isOpen} onClose={onClose} />
      </Box>
  );
}