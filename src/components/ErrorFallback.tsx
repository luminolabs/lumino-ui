import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Box, Text, Button } from '@chakra-ui/react';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Box role="alert" p={4}>
      <Text>Something went wrong:</Text>
      <Text color="red.500">{error.message}</Text>
      <Button onClick={resetErrorBoundary} mt={2}>Try again</Button>
    </Box>
  );
};

export default ErrorFallback;