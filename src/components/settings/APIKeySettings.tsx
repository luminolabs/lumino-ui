"use client"; // Make sure this is marked as a client component

import React, { useState, useEffect } from 'react';
import {
    VStack,
    Button,
    Input,
    Box,
    Text,
    HStack,
    useToast,
    Divider,
    Heading,
    useClipboard,
    IconButton,
} from '@chakra-ui/react';
import { FiCopy } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchWithAuth } from '@/utils/api';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const APIKeySettings: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<Array<{ id: string; name: string; expires_at: string; status: string, prefix: string }>>([]);
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyExpiration, setNewKeyExpiration] = useState<Date | null>(null);
    const [newApiKeySecret, setNewApiKeySecret] = useState<string | null>(null);
    const { onCopy, hasCopied } = useClipboard(newApiKeySecret || '')
    const toast = useToast();

    useEffect(() => {
        console.log("Component mounted. Fetching API keys...");
        listApiKeys();
    }, []);

    const createApiKey = async () => {
        if (!newKeyName || !newKeyExpiration) {
            toast({
                title: 'Error',
                description: 'Please provide both a name and expiration date for the new API key.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        if (newKeyExpiration < (new Date())) {
            toast({
                title: 'Error',
                description: 'Expiration date cannot be in past.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await fetchWithAuth('/api-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName, expires_at: newKeyExpiration.toISOString() }),
            });

            console.log("Response from create API key:", response);
            const data = await response;
            setNewApiKeySecret(data.secret);
            setNewKeyName('');
            setNewKeyExpiration(null);
            console.log("API key created successfully:", data.secret);
            listApiKeys();
            toast({
                title: 'API Key Created',
                description: 'Please save the new API key secret now.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error: any) {
            console.error('Error creating API key:', error);
            const err = error.toString()
            console.log(err);
            
            if (err.includes("422 Unprocessable Entity")) {
                toast({
                    title: 'Duplicate Name Error',
                    description: 'Cannot create an API key with same name as previous active/expired keys',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Unknown Error Occured',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    const revokeApiKey = async (name: string) => {
        if (name === "") {
            toast({
                title: 'Error',
                description: 'Please provide a valid Api key name',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await fetchWithAuth(`/api-keys/${name}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                redirect: "follow"
            });

            console.log("Response from Delete API key : ", response);
            const data = await response;
            console.log("API key revoked successfully");
            listApiKeys();
            toast({
                title: 'API Key revoked',
                description: 'This API key has been revoked now',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error revoking API key:', error);
        }
    };

    const listApiKeys = async () => {
        try {
            const response = await fetchWithAuth(`/api-keys`);
            console.log("Fetched API keys:", response); // Log the fetched data
            setApiKeys(response?.data);
        } catch (error) {
            console.error('Error fetching API keys:', error);
        }
    };

    const IconWrapper = ({ children }: { children: React.ReactNode }) => (
        <Box width="24px" height="24px">
          {children}
        </Box>
      );      

    console.log("Current API keys state:", apiKeys); // Log the state of the API keys

    return (
        <VStack align="stretch" spacing={4}>
            <Heading size="lg" color="#333">API Keys</Heading>
            <Divider />

            {/* Create API Key Section */}
            <HStack spacing={2} alignItems="center">
                <Input
                    placeholder="Enter new API key name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    bg="white"
                    color="black"
                    sx={{
                        '::placeholder': { color: 'gray.500' }, // Custom placeholder styling
                    }}
                    flex="1"
                />
                <DatePicker
                    selected={newKeyExpiration}
                    onChange={(date: Date | null) => setNewKeyExpiration(date)}  // Allow null value
                    timeFormat="HH:mm"
                    dateFormat="MM/dd/yyyy"
                    placeholderText="Select expiration date & time"
                    customInput={
                        <Input
                            bg="white"
                            color="black"
                            sx={{
                                '::placeholder': { color: 'gray.500' },  // Custom placeholder styling
                            }}
                        />
                    }
                />
                <Button 
                    leftIcon={<IconWrapper> <PlusCircleIcon /></IconWrapper>}
                    color="white"
                    bg="#4e00a6"
                    _hover={{ bg: "#0005A6" }} onClick={createApiKey}>
                    Create API Key
                </Button>
            </HStack>

            {newApiKeySecret && (
                <Box mt={4}>
                    <Text display="flex" alignItems="center" bg="#F8F9FA" p={2} borderRadius="md" fontFamily="monospace" color="black">
                        Your new API key is: {newApiKeySecret}
                        <IconButton
                            aria-label="Copy API key"
                            icon={<FiCopy />}
                            onClick={onCopy}
                            ml={2}
                            size="sm"
                            colorScheme="purple"
                        />
                        {hasCopied && (
                            <Text color="green.500" mx="8px" my="auto">
                                Copied to clipboard!
                            </Text>
                        )}
                    </Text>
                    <Text alignItems="center" color="red.500">
                        Please save this key now. You won't be able to see it again!
                    </Text>

                </Box>
            )}

            <Divider />

            {/* API Keys List Section */}
            <Box mt={4}>
                <Heading size="sm" color="#333">Active Keys</Heading>
                <VStack align="stretch">
                    {apiKeys
                        .filter((key) => key.status === 'ACTIVE') // Show only active keys
                        .map((key) => (
                            <HStack key={key.id} justify="space-between" bg="white" p={2} borderRadius="md">
                                <Text color="gray"> {/* Ensure text color is black */}
                                   {key.prefix}********  ({key.name}: {new Date(key.expires_at).toLocaleString()})
                                </Text>
                                <Button color="black" _hover={{ bg: "red", color: "white" }} size="sm" onClick={() => { revokeApiKey(key.name) }}>
                                <IconWrapper> <TrashIcon /></IconWrapper>
                                </Button>
                            </HStack>
                    ))}
                </VStack>
            </Box>
        </VStack>
    );
};

export default APIKeySettings;