"use client";

import React, { useEffect, useState } from "react";
import {
  VStack,
  Heading,
  HStack,
  Text,
  Button,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
} from "@chakra-ui/react";
import { FiDollarSign } from "react-icons/fi";
import { fetchWithAuth } from "@/utils/api";

const BillingSettings = () => {
  const [amount, setAmount] = useState(10);
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleAddCredits = () => {
    // Redirect to the billing URL
    const redirectUrl = `/api/proxy/billing/credits-add?amount_dollars=${amount}`;
    window.location.href = redirectUrl;
  };

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await fetchWithAuth("/users/me");
      setCreditsBalance(parseFloat(userData.credits_balance));
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch credit balance. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="lg" color="#261641">
        Billing
      </Heading>
      <HStack marginLeft="auto">
        <FiDollarSign />
        <Text fontWeight="bold" color="#261641">
          Credits Left:
        </Text>
        {isLoading ? (
          <Spinner size="sm" />
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : (
          <Text color="#261641">${creditsBalance?.toFixed(2)}</Text>
        )}
      </HStack>
      <Box>
        <NumberInput
          border="gray"
          value={amount}
          onChange={(valueString) => setAmount(parseInt(valueString))}
          min={1}
        >
          <NumberInputField color="gray" />
          <NumberInputStepper color="gray">
            <NumberIncrementStepper color="gray" />
            <NumberDecrementStepper color="gray" />
          </NumberInputStepper>
        </NumberInput>
      </Box>
      <Box>
        <Button
          isDisabled={Number.isNaN(amount) || amount === 0}
          colorScheme="purple"
          bg="#E7E0FD"
          color="#6B46C1"
          _hover={{ bg: "#D3C7F2" }}
          onClick={handleAddCredits}
        >
          {Number.isNaN(amount) || amount === 0 ?
            `Add $0 Credits` : `Add ${amount} Credits`}
        </Button>
      </Box>
      <Box>
        <Button variant="link" color="#6B46C1">
          Update Billing
        </Button>
      </Box>
    </VStack>
  );
};

export default BillingSettings;
