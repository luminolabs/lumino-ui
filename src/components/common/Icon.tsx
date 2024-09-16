'use client'

import { Icon as ChakraIcon, IconProps as ChakraIconProps } from '@chakra-ui/react'
import { IconType } from 'react-icons'

interface IconProps extends ChakraIconProps {
  as: IconType
}

const Icon = ({ as: IconComponent, ...props }: IconProps) => {
  return <ChakraIcon as={IconComponent} {...props} />
}

export default Icon