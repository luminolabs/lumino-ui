'use client'

import { Box, VStack, Heading } from '@chakra-ui/react';
import GeneralSettings from '@/components/settings/GeneralSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import APIKeySettings from '@/components/settings/APIKeySettings';
import TeamSettings from '@/components/settings/TeamSettings';

export default function SettingsPage() {
  return (
    <Box maxWidth="800px" margin="0 auto">
      <Heading size="xl" mb={8} color="#261641">Settings</Heading>
      <VStack spacing={12} align="stretch">
        <GeneralSettings />
        <BillingSettings />
        <APIKeySettings />
        <TeamSettings />
      </VStack>
    </Box>
  );
}