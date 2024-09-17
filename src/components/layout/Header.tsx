'use client'

import { Box, Flex, Spacer, Link, Image } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FiClock } from 'react-icons/fi';

const Header = () => {
  return (
    <Box as="header" bg="white" boxShadow="sm" py={4} px={8}>
      <Flex maxW="container.xl" mx="auto" alignItems="center">
        <NextLink href="/" passHref>
          <Flex as="a" alignItems="center">
            <Box as={FiClock} color="purple.500" fontSize="24px" mr={2} />
            <Box as="span" fontSize="xl" fontWeight="bold" color="purple.700">
              lumino
            </Box>
          </Flex>
        </NextLink>
        <Spacer />
        <Flex gap={6}>
          <Link as={NextLink} href="/dashboard" color="gray.600">
            Dashboard
          </Link>
          <Link as={NextLink} href="/docs" color="gray.600">
            Docs
          </Link>
          <Box as={FiClock} color="gray.600" fontSize="20px" />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;