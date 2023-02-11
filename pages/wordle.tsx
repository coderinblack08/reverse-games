import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  generateGuess,
  generateWord,
  rateGuess,
  Rating,
} from "../generate-word";

const WordleRow: React.FC<{
  guess?: string;
  rating: Rating;
  interactive?: boolean;
}> = ({ guess, rating, interactive = false }) => {
  return (
    <HStack
      as="button"
      _focus={{
        // boxshadow with 2px offset
        boxShadow: "0 0 0 3px #3182ce",
      }}
      spacing={1.5}
    >
      {new Array(5).fill(null).map((_, i) => (
        <Flex
          key={i}
          boxSize="52px"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          fontSize="32px"
          lineHeight={1}
          textTransform="uppercase"
          color={interactive ? "gray.800" : "white"}
          backgroundColor={
            rating.correct[i]
              ? "#6aaa64"
              : rating.misplaced[i]
              ? "#c9b458"
              : "#787c7e"
          }
        >
          {guess && guess.at(i)}
        </Flex>
      ))}
    </HStack>
  );
};

const WordlePage: NextPage = () => {
  const [word, setWord] = useState("");
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [guess, setGuess] = useState("");

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      console.log(event.key);
      if (event.key === "Backspace") {
        setGuess(guess.slice(0, -1));
      } else if (event.key === "Enter") {
        setGuess("");
      } else if (
        event.key.length === 1 &&
        event.key.match(/[a-z]/i) &&
        guess.length < 5
      ) {
        setGuess(guess + event.key);
      }
    },
    [guess]
  );

  useEffect(() => {
    generateWord().then((w) => setWord(w!));
  }, []);

  useEffect(() => {
    generateGuess(word).then(setRatings);
  }, [word]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Box minH="100vh">
      <Box py={3} borderBottom="2px solid" borderColor="gray.300">
        <Heading textAlign="center" size="lg">
          Reverse Wordle
        </Heading>
      </Box>
      <VStack p={4} justifyContent="center" spacing={1.5}>
        {ratings.map((rating, i) => (
          <WordleRow key={i} rating={rating} interactive />
        ))}
        <WordleRow guess={word} rating={rateGuess(word, word)} />
      </VStack>
    </Box>
  );
};

export default WordlePage;
