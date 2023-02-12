import { Box, Flex, Heading, HStack, useToast, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";

const Connect4Column = ({ col, simulateTurn, board }: any) => {
  return (
    <VStack
      display="inline-flex"
      p={3}
      backgroundColor="#5E6398"
      spacing={6}
      onClick={() => simulateTurn(col)}
      cursor="pointer"
    >
      {new Array(8).fill(null).map((cell: any, row: number) => (
        <Box
          boxSize={12}
          backgroundColor={
            board[row][col] === 1
              ? "red"
              : board[row][col] === 0
              ? "yellow"
              : "white"
          }
          borderRadius="full"
          key={row}
        />
      ))}
    </VStack>
  );
};

const Connect4Page: NextPage = () => {
  const [turn, setTurn] = useState(1); // 1 = red, 0 = blue
  const [board, setBoard] = useState<any>(
    new Array(8).fill(new Array(4).fill(null))
  );

  function updateCell(row: number, col: number, player: number) {
    const newBoard = board.map((row: any) => [...row]);
    newBoard[row][col] = player;
    setBoard(newBoard);
  }

  const checkState = useCallback(() => {
    // check horizontal
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] === board[row][col + 1] &&
          board[row][col] === board[row][col + 2] &&
          board[row][col] === board[row][col + 3] &&
          board[row][col] !== null
        ) {
          return board[row][col];
        }
      }
    }

    // check vertical
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] === board[row + 1][col] &&
          board[row][col] === board[row + 2][col] &&
          board[row][col] === board[row + 3][col] &&
          board[row][col] !== null
        ) {
          return board[row][col];
        }
      }
    }

    // check diagonal
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] === board[row + 1][col + 1] &&
          board[row][col] === board[row + 2][col + 2] &&
          board[row][col] === board[row + 3][col + 3] &&
          board[row][col] !== null
        ) {
          return board[row][col];
        }
      }
    }

    // check anti-diagonal
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col + 3] === board[row + 1][col + 2] &&
          board[row][col + 3] === board[row + 2][col + 1] &&
          board[row][col + 3] === board[row + 3][col] &&
          board[row][col + 3] !== null
        ) {
          return board[row][col + 3];
        }
      }
    }

    return null;
  }, [board]);

  const checkIfDraw = useCallback(() => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === null) {
          return false;
        }
      }
    }
    return checkState() === null;
  }, [board, checkState]);

  function simulateTurn(col: number) {
    for (let row = 7; row >= 0; row--) {
      if (board[row][col] === null) {
        updateCell(row, col, turn);
        break;
      }
    }
    flipColumn(col);
    setTurn(turn === 1 ? 0 : 1);
  }

  function flipColumn(col: number) {
    for (let row = 0; row < 4; row++) {
      const temp = board[row][col];
      board[row][col] = board[7 - row][col];
      board[7 - row][col] = temp;
    }
  }

  const toast = useToast();

  useEffect(() => {
    if (checkIfDraw()) {
      alert("Draw!");
      toast({ title: "Draw", status: "info" });
    } else if (checkState() !== null) {
      toast({ title: `Player ${checkState()} wins`, status: "success" });
    }
  }, [board, checkIfDraw, checkState, toast]);

  return (
    <Box minH="100vh" p={4}>
      <Heading textAlign="center" size="lg">
        Connect4 Flip
      </Heading>
      <HStack justifyContent="center" mt={4} spacing={4}>
        {new Array(4).fill(null).map((_, i: number) => (
          <Connect4Column
            key={i}
            col={i}
            board={board}
            simulateTurn={simulateTurn}
            updateCell={updateCell}
            flipColumn={flipColumn}
          />
        ))}
      </HStack>
    </Box>
  );
};

export default Connect4Page;
