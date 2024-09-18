"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  Input,
  Text,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { fetchWithAuth } from "@/utils/api";

interface UploadDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BaseModel {
  id: string;
  description: string;
  hf_url: string;
  status: string;
  name: string;
  meta: string;
}
interface Datasets {
  id: string;
  description: string;
  status: string;
  name: string;
  fileName: string;
  fileSize: string;
  errors: string;
}

const UploadDatasetModal: React.FC<UploadDatasetModalProps> = ({
  isOpen,
  onClose,
}) => {
    const [trainingData, saetTrainingData] = useState<
      "upload" | "select" | "none"
    >("upload");
  
  const [datasetName, setDatasetName] = useState<string>("");
  const [description, setDescription] = useState<string>("");


  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleUploadDataset = async (file: File) => {
    if (!datasetName || !trainingData) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData()

    formData.append("file", file)

    setIsSubmitting(true);

    const datasetData = {
      file: file,
      dataset_name: datasetName,
      dataset_description: description,
    };

    try {
      const data = await fetchWithAuth("/datasets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datasetData),
      });

      toast({
        title: "Dataset Uploaded",
        description: `"${data.name}" Dataset has been uploaded successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      // Optionally, you can trigger a refresh of the job list here
    } catch (error: any) {
      console.error("Error uploading dataset:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "An error occurred while uploading the dataset.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a fine-tuned model</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontWeight="bold">Job Name : </Text>
              <Input
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="my-dataset-1"
              />
            </Box>

            <Box>
              <Text fontWeight="bold">Description</Text>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="This is my-dataset-1"
              />
            </Box>

            <Box>
              <Text fontWeight="bold">Training Data</Text>
              <Text fontSize="sm" color="gray.500">
                Add a jsonl file
              </Text>
            </Box>

          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={() => handleUploadDataset}
            isLoading={isSubmitting}
            loadingText="Creating..."
          >
            Create fine-tuning job
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadDatasetModal;
