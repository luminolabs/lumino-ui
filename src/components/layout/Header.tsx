import React from 'react';
import { Box, Flex, Spacer, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <Box as="header" bg="white" boxShadow="sm" py={4} px={8}>
      <Flex maxW="container.xl" mx="auto" alignItems="center">
        <NextLink href="/" passHref>
          <Flex as="a" alignItems="center">
            <Box position="absolute" width="128px" height="32px">
              <Image
                src="/logo.svg"
                alt="Lumino Logo"
                layout="fill"
                objectFit="contain"
              />
            </Box>
            {/* <Text fontSize="xl" fontWeight="bold" color="purple.700">
              lumino
            </Text> */}
          </Flex>
        </NextLink>
        <Spacer />
        <Flex gap={6}>
          {/* <Link as={NextLink} href="/dashboard" color="gray.600">
            Dashboard
          </Link> */}
          <Link as={NextLink} href="https://docs.luminolabs.ai" target="_blank" color="gray.600">
            Docs
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;