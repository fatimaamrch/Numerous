import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';

export function Provider({ children }) {
  return (
    <ThemeProvider>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </ThemeProvider>
  );
}
