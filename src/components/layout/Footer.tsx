import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" bg="gray.100" py={4} mt={8}>
      <Text textAlign="center" fontSize="sm" color="gray.500">
        &copy; 2024 Lumino. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;