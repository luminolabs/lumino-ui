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
} from '@chakra-ui/react';
import { FiCopy } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchWithAuth } from '@/utils/api';

const APIKeySettings: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<Array<{ id: string; name: string; expires_at: string; status: string }>>([]);
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyExpiration, setNewKeyExpiration] = useState<Date | null>(null);
    const [showRevokedKeys, setShowRevokedKeys] = useState(false);
    const [newApiKeySecret, setNewApiKeySecret] = useState<string | null>(null);
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

        try {
            const response = await fetchWithAuth('/api-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName, expires_at: newKeyExpiration.toISOString() }),
            });

            // if (response.ok) {

            debugger;
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
        } catch (error) {
            console.error('Error creating API key:', error);
        }
    };

    const listApiKeys = async () => {
        try {
            //debugger;
            const response = await fetchWithAuth(`/api-keys`);
                console.log("Fetched API keys:", response); // Log the fetched data
                setApiKeys(response?.data);
        } catch (error) {
            console.error('Error fetching API keys:', error);
        }
    };

    const toggleApiKeyList = () => {
        setShowRevokedKeys((prevState) => !prevState);
        console.log("Toggled key list. Showing revoked keys?", !showRevokedKeys);
    };

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
                    onChange={(date: Date) => setNewKeyExpiration(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MM/dd/yyyy h:mm aa"
                    placeholderText="Select expiration date & time"
                    customInput={
                        <Input
                            bg="white"
                            color="black"
                            sx={{
                                '::placeholder': { color: 'gray.500' }, // Custom placeholder styling
                            }}
                        />
                    }
                />
                <Button colorScheme="green" onClick={createApiKey}>
                    Create API Key
                </Button>
            </HStack>

            {newApiKeySecret && (
                <Box mt={4}>
                    <Text bg="#F8F9FA" p={2} borderRadius="md" fontFamily="monospace" color="black">
                        Your new API key is: {newApiKeySecret} <FiCopy cursor="pointer" />
                    </Text>
                    <Text color="red.500">
                        Please save this key now. You won't be able to see it again!
                    </Text>
                </Box>
            )}

            <Divider />

            {/* Update API Key Section */}
            <HStack spacing={2} alignItems="center">
                <Input
                    placeholder="Search and select API key"
                    bg="white"
                    color="black"
                    sx={{
                        '::placeholder': { color: 'gray.500' }, // Custom placeholder styling
                    }}
                    flex="1"
                />
                <Input
                    placeholder="Enter updated API key name (optional)"
                    bg="white"
                    color="black"
                    sx={{
                        '::placeholder': { color: 'gray.500' }, // Custom placeholder styling
                    }}
                    flex="1"
                />
                <DatePicker
                    selected={newKeyExpiration}
                    onChange={(date: Date) => setNewKeyExpiration(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MM/dd/yyyy h:mm aa"
                    placeholderText="Select expiration date & time"
                    customInput={
                        <Input
                            bg="white"
                            color="black"
                            sx={{
                                '::placeholder': { color: 'gray.500' }, // Custom placeholder styling
                            }}
                        />
                    }
                />
                <Button colorScheme="yellow">
                    Update API Key
                </Button>
            </HStack>

            <Divider />

            {/* API Keys List Section */}
            <HStack spacing={2}>
                <Button colorScheme="blue" onClick={toggleApiKeyList} width="full">
                    {showRevokedKeys ? 'Show Active Keys' : 'Show Revoked Keys'}
                </Button>
                <Button colorScheme="blue" onClick={listApiKeys} width="full">
                    Refresh List
                </Button>
            </HStack>

            <Box mt={4}>
                <Heading size="sm" color="#333">Active Keys</Heading>
                <VStack align="stretch">
                    {apiKeys
                        .filter((key) => key.status === 'ACTIVE') // Show only active keys
                        .map((key) => (
                            <HStack key={key.id} justify="space-between" bg="white" p={2} borderRadius="md">
                                <Text color="black"> {/* Ensure text color is black */}
                                    {key.name} (Expires: {new Date(key.expires_at).toLocaleString()})
                                </Text>
                                <Button colorScheme="red" size="sm">
                                    Revoke
                                </Button>
                            </HStack>
                        ))}
                </VStack>
            </Box>
        </VStack>
    );
};

export default APIKeySettings;