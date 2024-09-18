'use client'

import React, { useState } from 'react';
import { Box, Flex, Heading, Button, Text, Spinner, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import UploadDatasetModal from '@/components/features/datasets/UploadDatasetModal';

const DatasetList = dynamic(() => import('@/components/features/datasets/DatasetList'), {
  loading: () => <Spinner />,
  ssr: false
});

const DatasetDetails = dynamic(() => import('@/components/features/datasets/DatasetDetails'), {
  loading: () => <Spinner />,
  ssr: false
});

export default function DatasetsPage() {
  const params = useParams();
  const datasetName = params?.datasetName as string;
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
      // Increment the refreshTrigger to cause a re-fetch in the DatasetList component
      setRefreshTrigger(prev => prev + 1);
    console.log('Dataset uploaded successfully. Refreshing list...');
  };

  return (
    <Box p={4} bg="gray.50" minH="calc(100vh - 64px)">
      <Flex mb={6} direction={isMobile ? "column" : "row"} justify="space-between" align={isMobile ? "stretch" : "center"}>
        <Heading size="lg" color="#261641" mb={isMobile ? 4 : 0}>Datasets</Heading>
        <Button 
          leftIcon={<FiPlus />}
          bg="#7C3AED" 
          color="white" 
          _hover={{ bg: '#6D28D9' }}
          width={isMobile ? "100%" : "auto"}
          onClick={onOpen}
        >
          Upload Dataset
        </Button>
      </Flex>
      <Flex direction={isMobile ? "column" : "row"} height="100%">
        <Box width={isMobile ? "100%" : "35%"} bg="white" borderRadius="md" boxShadow="sm" mb={isMobile ? 4 : 0} mr={isMobile ? 0 : 6}>
          <Suspense fallback={<Spinner />}>
            <DatasetList refreshTrigger={refreshTrigger} />
          </Suspense>
        </Box>
        <Box flex={1} bg="white" borderRadius="md" boxShadow="sm" p={6} width={isMobile ? "100%" : "35%"}>
          <Suspense fallback={<Spinner />}>
            {datasetName ? (
              <DatasetDetails datasetName={datasetName} />
            ) : (
              <Text color="gray.500">Select a dataset to view details</Text>
            )}
          </Suspense>
        </Box>
      </Flex>
      <UploadDatasetModal isOpen={isOpen} onClose={onClose} onUploadSuccess={handleUploadSuccess} />
    </Box>
  );
}