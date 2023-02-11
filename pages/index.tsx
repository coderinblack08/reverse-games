import { Container, Heading } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Container py={8} px={2}>
      <Heading>Upside-Down Games</Heading>
      <Link href="/wordle">
        <Button mt={4} w="full" colorScheme="green" as="a">
          Wordle
        </Button>
      </Link>
      <Button mt={4} w="full" colorScheme="blue">
        Sudoku
      </Button>
    </Container>
  );
}
