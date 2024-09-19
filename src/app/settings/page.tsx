'use client'

import { Box, VStack, Heading } from '@chakra-ui/react';
import BillingSettings from '@/components/settings/BillingSettings';
import APIKeySettings from '@/components/settings/APIKeySettings';

export default function SettingsPage() {
  return (
    <Box maxWidth="800px" margin="0 auto">
      <Heading size="xl" mb={8} color="#261641">Settings</Heading>
      <VStack spacing={12} align="stretch">
        <BillingSettings />
        <APIKeySettings />
      </VStack>
    </Box>
  );
}