import {
  Box,
  Flex,
  Heading,
  HStack,
  Kbd,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import {
  generateGuess,
  generateWord,
  rateGuess,
  Rating,
} from "../generate-word";
import { isWord } from "../is-word";

const WordleRow: React.FC<{
  guess?: string;
  answer?: string;
  rating: Rating;
  interactive?: boolean;
}> = ({ guess, answer, rating, interactive = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [solved, setSolved] = useState(false);
  const [typed, setTyped] = useState("");
  const toast = useToast();

  return (
    <HStack spacing={1.5}>
      <HStack
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            const checkRow = async () => {
              if (!(await isWord(typed))) {
                toast({ title: "Not a real word", status: "error" });
                return false;
              }
              if (typed.length === 5 && answer) {
                const typedRating = rateGuess(answer, typed);
                for (let i = 0; i < 5; i++) {
                  if (typedRating.correct[i] !== rating.correct[i]) {
                    return false;
                  }
                  if (typedRating.misplaced[i] !== rating.misplaced[i]) {
                    return false;
                  }
                }
                return true;
              } else {
                return false;
              }
            };

            if (await checkRow()) {
              toast({ title: "Correct!", status: "success" });
              setSolved(true);
            }
            // setIsFocused(false);
          } else if (e.key === "Backspace") {
            setTyped(typed.slice(0, -1));
          } else if (
            e.key.length === 1 &&
            e.key.match(/[a-z]/i) &&
            typed.length < 5
          ) {
            setTyped(typed + e.key.toLocaleLowerCase());
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        as="button"
        _focus={{
          outlineOffset: "2px",
          outline: "3px solid",
          outlineColor: "gray.400",
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
            color="white"
            backgroundColor={
              rating.correct[i]
                ? "#6aaa64"
                : rating.misplaced[i]
                ? "#c9b458"
                : "#787c7e"
            }
          >
            {interactive ? typed?.at(i) : guess?.at(i)}
          </Flex>
        ))}
      </HStack>
      <Box opacity={interactive ? 1 : 0}>{solved ? "✅" : "❌"}</Box>
    </HStack>
  );
};

const WordlePage: NextPage = () => {
  const [word, setWord] = useState("");
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    generateWord().then((w) => setWord(w!));
  }, []);

  useEffect(() => {
    generateGuess(word).then(setRatings);
  }, [word]);

  return (
    <Box minH="100vh">
      <Box pt={4}>
        <Heading textAlign="center" size="lg">
          Reverse Wordle
        </Heading>
      </Box>
      <VStack p={4} justifyContent="center" spacing={1.5}>
        {ratings.map((rating, i) => (
          <WordleRow key={i} answer={word} rating={rating} interactive />
        ))}
        <WordleRow guess={word} rating={rateGuess(word, word)} />
        <Text fontSize="sm">
          Press <Kbd>↩</Kbd> to check each row
        </Text>
      </VStack>
    </Box>
  );
};

export default WordlePage;
