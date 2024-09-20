import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Text,
  VStack,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { fetchWithAuth } from "@/utils/api";

interface UploadDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadDatasetModal: React.FC<UploadDatasetModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [datasetName, setDatasetName] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [nameError, setNameError] = useState("");
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (!datasetName.trim()) {
      setNameError("Dataset name is required");
      isValid = false;
    } else {
      setNameError("");
    }
    return isValid;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", datasetName.trim());
    if (datasetDescription.trim()) {
      formData.append("description", datasetDescription.trim());
    }

    try {
      const response = await fetchWithAuth("/datasets", {
        method: "POST",
        body: formData,
      });

      toast({
        title: "Dataset Uploaded",
        description: `Dataset "${response.name}" has been uploaded successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onUploadSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error uploading dataset:", error);
      toast({
        title: "Upload Error",
        description:
          error.message || "An error occurred while uploading the dataset.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent style={{ background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 10 }}>
        <ModalHeader color="#261641">Upload Dataset</ModalHeader>
        <ModalCloseButton color="#261641" />
        <ModalBody color="#4e00a6">
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!nameError} isRequired>
              <FormLabel>Dataset Name</FormLabel>
              <Input
                color="black"
                borderColor="#4e00a6"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="Enter dataset name"
                _placeholder={{ color: "gray.400" }}
              />
              <FormErrorMessage>{nameError}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>Description (Optional)</FormLabel>
              <Input
                color="black"
                borderColor="#4e00a6"
                value={datasetDescription}
                onChange={(e) => setDatasetDescription(e.target.value)}
                placeholder="Enter dataset description"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Upload File</FormLabel>
              <Input
                color="black"
                borderColor="#4e00a6"
                type="file"
                accept=".jsonl,.json,.csv,.txt"
                onChange={handleFileChange}
              />
            </FormControl>
            {file && (
              <Text fontSize="sm" color="gray.600">
                Selected file: {file.name}
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button bg="#F2F2F2" color="black" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="white"
            bg="#4e00a6"
            _hover={{ bg: "#0005A6" }}
            onClick={handleUpload}
            isLoading={isUploading}
            loadingText="Uploading..."
          >
            Upload Dataset
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadDatasetModal;
