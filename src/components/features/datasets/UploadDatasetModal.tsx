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
  //   const [validationDataOption, setValidationDataOption] = useState<
  //     "upload" | "select" | "none"
  //   >("upload");
  const [baseModels, setBaseModels] = useState<BaseModel[]>([]);
  const [selectedBaseModel, setSelectedBaseModel] = useState<string>("");
  const [datasets, setDatasets] = useState<Datasets[]>([]);
  const [selectedDatasets, setSelectedDatasets] = useState<string>("");
  const [jobName, setJobName] = useState<string>("");
  const [batchSize, setBatchSize] = useState<number>(2);
  const [learningRate, setLearningRate] = useState<number>(2);
  const [shuffle, setShuffle] = useState<boolean>(true);
  const [seed, setSeed] = useState<string>("Random");
  const [numEpochs, setNumEpochs] = useState<number>(1);
  const [useLora, setUseLora] = useState<boolean>(true);
  const [useQlora, setUseQlora] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleCreateJob = async () => {
    if (!selectedBaseModel || !selectedDatasets || !jobName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    const jobData = {
      base_model_name: selectedBaseModel,
      dataset_name: selectedDatasets,
      parameters: {
        batch_size: batchSize,
        shuffle: shuffle,
        num_epochs: numEpochs,
        use_lora: useLora,
        use_qlora: useQlora,
      },
      name: jobName,
    };

    try {
      const data = await fetchWithAuth("/fine-tuning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      toast({
        title: "Job Created",
        description: `Fine-tuning job "${data.name}" has been created successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      // Optionally, you can trigger a refresh of the job list here
    } catch (error: any) {
      console.error("Error creating fine-tuning job:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "An error occurred while creating the fine-tuning job.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchBaseModels = async () => {
      try {
        const data = await fetchWithAuth("/models/base");
        setBaseModels(data?.data);
      } catch (error) {
        console.error("Error fetching base models:", error);
      }
    };
    fetchBaseModels();
  }, [isOpen]);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await fetchWithAuth("/datasets");
        if (response && Array.isArray(response.data)) {
          setDatasets(response.data);
        } else {
          console.error("Unexpected API response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching datasets:", error);
      }
    };
    fetchDatasets();
  }, []);

  //   const handleFileUpload = async (
  //     file: File,
  //     type: "training" | "validation"
  //   ) => {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     try {
  //       await fetchWithAuth(`/upload-${type}-data`, {
  //         method: "POST",
  //         body: formData,
  //       });
  //       console.log(`${type} data uploaded successfully`);
  //     } catch (error) {
  //       console.error(`Error uploading ${type} data:`, error);
  //     }
  //   };

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
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                placeholder="my-model-1"
              />
            </Box>

            <Box>
              <Text fontWeight="bold">Base Model</Text>
              <Select
                placeholder="Select"
                value={selectedBaseModel}
                onChange={(e) => setSelectedBaseModel(e.target.value)}
              >
                {baseModels.map((model) => (
                  <option key={model.id} value={model.name}>
                    {model.name + " (" + model.description + ")"}
                  </option>
                ))}
              </Select>
            </Box>

            <Box>
              <Text fontWeight="bold">Dataset</Text>
              <Select
                placeholder="Select"
                value={selectedDatasets}
                onChange={(e) => setSelectedDatasets(e.target.value)}
              >
                {datasets.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name + " (" + model.description + ")"}
                  </option>
                ))}
              </Select>
            </Box>

            {/* <Box>
              <Text fontWeight="bold">Training Data</Text>
              <Text fontSize="sm" color="gray.500">
                Add a jsonl file
              </Text>
              <RadioGroup
                onChange={(value) =>
                  setTrainingDataOption(value as "upload" | "select")
                }
                value={trainingDataOption}
              >
                <Stack direction="row">
                  <Radio value="upload">Upload new</Radio>
                  <Radio value="select">Select existing file</Radio>
                </Stack>
              </RadioGroup>
              {trainingDataOption === "upload" && (
                <Input
                  type="file"
                  accept=".jsonl"
                  onChange={(e) =>
                    e.target.files &&
                    handleFileUpload(e.target.files[0], "training")
                  }
                />
              )}
            </Box> */}

            {/* <Box>
              <Text fontWeight="bold">Validation Data</Text>
              <Text fontSize="sm" color="gray.500">
                Add a jsonl file
              </Text>
              <RadioGroup
                onChange={(value) =>
                  setValidationDataOption(value as "upload" | "select" | "none")
                }
                value={validationDataOption}
              >
                <Stack direction="row">
                  <Radio value="upload">Upload new</Radio>
                  <Radio value="select">Select existing file</Radio>
                  <Radio value="none">None</Radio>
                </Stack>
              </RadioGroup>
              {validationDataOption === "upload" && (
                <Input
                  type="file"
                  accept=".jsonl"
                  onChange={(e) =>
                    e.target.files &&
                    handleFileUpload(e.target.files[0], "validation")
                  }
                />
              )}
            </Box> */}

            <Box>
              <Text fontWeight="bold">Seed</Text>
              <Input
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Random"
              />
            </Box>

            <Box>
              <Text fontWeight="bold">Hyperparameter Tuning</Text>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text>Number of epochs</Text>
                  <Slider
                    min={0}
                    max={20}
                    step={1}
                    value={numEpochs}
                    onChange={(value) => setNumEpochs(value)}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                  <Text textAlign="right">{numEpochs}</Text>
                </Box>
                <Box>
                  <Text>Batch Size</Text>
                  <Slider
                    min={0}
                    max={20}
                    step={1}
                    value={batchSize}
                    onChange={(value) => setBatchSize(value)}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                  <Text textAlign="right">{batchSize}</Text>
                </Box>
                <Box>
                  <Text>Learning Rate</Text>
                  <Slider
                    min={0}
                    max={20}
                    step={1}
                    value={learningRate}
                    onChange={(value) => setLearningRate(value)}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                  <Text textAlign="right">{learningRate}</Text>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleCreateJob}
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
