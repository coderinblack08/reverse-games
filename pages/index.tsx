import { Container, Heading, Text } from "@chakra-ui/layout";
import { Button, HStack, Image } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Container py={8} px={2}>
      <Heading color="gray.800">
        Upside-Down <br /> <Text color="gray.500">Game Studio</Text>
      </Heading>
      <HStack spacing={4} mt={8}>
        <Button
          w="full"
          as={Link}
          size="lg"
          href="/wordle"
          colorScheme="green"
          leftIcon={<Image src="/wordle.png" boxSize={8} />}
        >
          Wordle
        </Button>
        <Button w="full" colorScheme="blue" size="lg" isDisabled>
          Sudoku
        </Button>
      </HStack>
    </Container>
  );
}
