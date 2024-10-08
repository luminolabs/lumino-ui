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
  useToast,
} from "@chakra-ui/react";
import { FiDollarSign } from "react-icons/fi";
import { fetchWithAuth } from "@/utils/api";
import { useParams } from "next/navigation";

const BillingSettings = () => {
  const [amount, setAmount] = useState(10);
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
   if (window.location.href.split('?')[1] === "stripe_success=2") {
    toast({
      title: 'Payment method Updated',
      description: 'Successfully added/updated payment method.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
   }
   if (window.location.href.split('?')[1] === "stripe_success=1") {
    toast({
      title: 'Credits added',
      description: 'Successfully added credits.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
   }
    
    fetchUserData();
  }, []);

  const handleAddCredits = async () => {
    const redirectUrl = `/api/proxy/v1/billing/stripe-credits-add?amount_dollars=${amount}`;
    try {
      const response = await fetch(redirectUrl, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.redirect_url) {
          // Redirect to the URL provided by the server
          window.location.href = data.redirect_url;
        } else {
          console.error('No redirect URL provided');
        }
      } else {
        console.error('Error response:', response.status);
      }
    } catch (error) {
      console.error('Error adding credits:', error);
      toast({
        title: 'Error adding credits',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Handle error (e.g., show an error message to the user)
    }
  };
  const handleAddUpdatePayment = async () => {
    const redirectUrl = `/api/proxy/v1/billing/stripe-payment-method-add`;
    try {
      const response = await fetch(redirectUrl, {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.redirect_url) {
          // Redirect to the URL provided by the server
          window.location.href = data.redirect_url;
        } else {
          console.error('No redirect URL provided');
        }
      } else {
        console.error('Error response:', response.status);
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: 'Error adding/updating payment method',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Handle error (e.g., show an error message to the user)
    }
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
        <Text fontWeight="bold" color="#261641">
          Credits:
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
          <NumberInputField color="black" />
          <NumberInputStepper color="black">
            <NumberIncrementStepper color="black" />
            <NumberDecrementStepper color="black" />
          </NumberInputStepper>
        </NumberInput>
      </Box>
      <Box>
        <Button
          isDisabled={Number.isNaN(amount) || amount === 0}
          color="white"
          bg="#4e00a6"
          _hover={{ bg: "#0005A6" }}
          onClick={handleAddCredits}
        >
          {Number.isNaN(amount) || amount === 0 ?
            `Add $0 Credits` : `Add $${amount} Credits`}
        </Button>
        <Box>
          <Button onClick={handleAddUpdatePayment} variant="link" pt="10px" color="#6B46C1">
            Add / Update Billing
          </Button>
        </Box>
      </Box>
    </VStack>
  );
};

export default BillingSettings;
