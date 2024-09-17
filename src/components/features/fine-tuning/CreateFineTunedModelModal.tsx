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
  Radio,
  RadioGroup,
  Stack,
  Input,
  Text,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
} from "@chakra-ui/react";
import { fetchWithAuth } from "@/utils/api";

interface CreateFineTunedModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateFineTunedModelModal: React.FC<CreateFineTunedModelModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [baseModels, setBaseModels] = useState<string[]>([]);
  const [selectedBaseModel, setSelectedBaseModel] = useState<string>("");
  const [trainingDataOption, setTrainingDataOption] = useState<
    "upload" | "select"
  >("upload");
  const [validationDataOption, setValidationDataOption] = useState<
    "upload" | "select" | "none"
  >("upload");
  const [seed, setSeed] = useState<string>("Random");
  const [epochs, setEpochs] = useState<number>(3);
  const [batchSize, setBatchSize] = useState<number>(8);
  const [learningRate, setLearningRate] = useState<number>(3);

  useEffect(() => {
    const fetchBaseModels = async () => {
      try {
        const data = await fetchWithAuth("/base-models");
        setBaseModels(data);
      } catch (error) {
        console.error("Error fetching base models:", error);
      }
    };
    fetchBaseModels();
  }, []);

  const handleFileUpload = async (
    file: File,
    type: "training" | "validation"
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await fetchWithAuth(`/upload-${type}-data`, {
        method: "POST",
        body: formData,
      });
      console.log(`${type} data uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading ${type} data:`, error);
    }
  };

  const handleCreateJob = async () => {
    // Implement job creation logic here
    console.log("Creating fine-tuning job...");
    onClose();
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
              <Text fontWeight="bold">Base Model</Text>
              <Select
                placeholder="Select"
                value={selectedBaseModel}
                onChange={(e) => setSelectedBaseModel(e.target.value)}
              >
                {baseModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </Select>
            </Box>

            <Box>
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
            </Box>

            <Box>
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
            </Box>

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
                    value={epochs}
                    onChange={(value) => setEpochs(value)}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                  <Text textAlign="right">{epochs}</Text>
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
          <Button colorScheme="purple" onClick={handleCreateJob}>
            Create fine-tuning job
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateFineTunedModelModal;
