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
  SliderMark,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { fetchWithAuth } from "@/utils/api";
import "@/app/global.css"
import { ChevronDownIcon } from "@chakra-ui/icons";

interface CreateFineTunedModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreationSuccess: () => void;
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

const CreateFineTunedModelModal: React.FC<CreateFineTunedModelModalProps> = ({
  isOpen,
  onClose,
  onCreationSuccess,
}) => {
  const [baseModels, setBaseModels] = useState<BaseModel[]>([]);
  const [selectedBaseModel, setSelectedBaseModel] = useState<string>("");
  const [datasets, setDatasets] = useState<Datasets[]>([]);
  const [selectedDatasets, setSelectedDatasets] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("FULL");
  const [jobName, setJobName] = useState<string>("");
  const [batchSize, setBatchSize] = useState<number>(2);
  const [learningRate, setLearningRate] = useState<number>(0.003);
  const [shuffle, setShuffle] = useState<boolean>(true);
  const [seed, setSeed] = useState<number>(9347235);
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
      },
      type: selectedType,
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
      onCreationSuccess();
      onClose();
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

  const inputStyle = {
    color: "black",
    borderColor: "gray.300",
    _hover: { borderColor: "#4e00a6" },
    _focus: { borderColor: "#4e00a6", boxShadow: "0 0 0 1px #4e00a6" },
  };

  const labelStyle = {
    color: "#4e00a6", // Dark purple color for better visibility
    fontWeight: "700",
    marginBottom: "2px",
  };

  const buttonStyle = {
    bg: "white",
    color: "gray.800",
    borderColor: "gray.300",
    borderWidth: "1px",
    _hover: { borderColor: "#4e00a6" },
    _active: { bg: "gray.100" },
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent style={{ background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 10 }}>
        <ModalHeader color="#261641">Create a fine-tuned model</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text {...labelStyle}>Job Name</Text>
              <Input
                {...inputStyle}
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                placeholder="my-model-1"
                _placeholder={{ color: "gray.400" }}
              />
            </Box>

            <Box>
              <Text {...labelStyle}>Base Model</Text>
              <Menu>
                <MenuButton as={Button} {...buttonStyle} rightIcon={<ChevronDownIcon />}>
                  {selectedBaseModel || "Select Base Model"}
                </MenuButton>
                <MenuList bg="white">
                  {baseModels.map((model) => (
                    <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} key={model.id} onClick={() => setSelectedBaseModel(model.name)}>
                      {model.description}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>

            <Box>
              <Text {...labelStyle}>Dataset</Text>
              <Menu>
                <MenuButton as={Button} {...buttonStyle} rightIcon={<ChevronDownIcon />}>
                  {selectedDatasets || "Select Dataset"}
                </MenuButton>
                <MenuList bg="white">
                  {datasets.map((dataset) => (
                    <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} key={dataset.id} onClick={() => setSelectedDatasets(dataset.name)}>
                      {dataset.name} ({dataset.description})
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>

            <Box>
              <Text {...labelStyle}>Type of Fine-Tuning</Text>
              <Menu>
                <MenuButton as={Button} {...buttonStyle} rightIcon={<ChevronDownIcon />}>
                  {selectedType}
                </MenuButton>
                <MenuList bg="white">
                    <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} key="FULL" onClick={() => setSelectedType("FULL")}>
                      FULL
                    </MenuItem>
                    <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} key="LORA" onClick={() => setSelectedType("LORA")}>
                      LORA
                    </MenuItem>
                    <MenuItem bg="white" color="black" _hover={{ bg: '#D6C6F6', color: '#4E00A6' }} key="QLORA" onClick={() => setSelectedType("QLORA")}>
                      QLORA
                    </MenuItem>
                </MenuList>
              </Menu>
            </Box>

            <Box>
              <Text {...labelStyle}>Seed</Text>
              <Input
                {...inputStyle}
                color="black"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                placeholder="Random"
                _placeholder={{ color: "gray.400" }}
              />
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
              <Text {...labelStyle} fontWeight="bold">Hyperparameter Tuning</Text>
              <VStack spacing={4} align="stretch">
                <Box className="lumino-purple-dark">
                  <Text>Number of epochs</Text>
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={numEpochs}
                    onChange={(value) => setNumEpochs(value)}
                  >

                    <SliderTrack color="purple" bg="#F2F2F2">
                      <SliderFilledTrack bg="#4e00a6" />
                    </SliderTrack>
                    <SliderThumb bg="#4e00a6" />
                    <SliderMark
                      value={numEpochs}
                      textAlign='center'
                      color="#4e00a6"
                      mt='2'
                      ml='-6'
                      w='12'
                    >
                      {numEpochs}
                    </SliderMark>
                  </Slider>
                </Box>
                <Box className="lumino-purple-dark">
                  <Text>Batch Size</Text>
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={batchSize}
                    onChange={(value) => setBatchSize(value)}
                  >
                    <SliderTrack color="purple" bg="#F2F2F2">
                      <SliderFilledTrack bg="#4e00a6" />
                    </SliderTrack>
                    <SliderThumb bg="#4e00a6" />
                    <SliderMark
                      value={batchSize}
                      textAlign='center'
                      color="#4e00a6"
                      mt='2'
                      ml='-6'
                      w='12'
                    >
                      {batchSize}
                    </SliderMark>
                  </Slider>
                </Box>
                <Box className="lumino-purple-dark">
                  <Text>Learning Rate</Text>
                  <Slider
                    min={0.0001}
                    max={0.01}
                    step={0.0001}
                    value={learningRate}
                    onChange={(value) => setLearningRate(value)}
                  >
                    <SliderTrack color="purple" bg="#F2F2F2">
                      <SliderFilledTrack bg="#4e00a6" />
                    </SliderTrack>
                    <SliderThumb bg="#4e00a6" />
                    <SliderMark
                      value={learningRate}
                      textAlign='center'
                      color="#4e00a6"
                      mt='2'
                      ml='-6'
                      w='14'
                    >
                      {learningRate}
                    </SliderMark>
                  </Slider>
                </Box>
                <Box>
                  <Text>Shuffle</Text>
                  <RadioGroup onChange={(value) => setShuffle(value === 'true')} value={shuffle.toString()}>
                    <Stack direction="row">
                      <Radio borderColor="gray.600" colorScheme="purple" value="true">True</Radio>
                      <Radio borderColor="gray.600" colorScheme="purple" value="false">False</Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
              </VStack>
            </Box>
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

export default CreateFineTunedModelModal;
