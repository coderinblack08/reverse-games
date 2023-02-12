import {
  Box,
  Button,
  Heading,
  HStack,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import { shallow } from "zustand/shallow";

const useBoardStore = create((set, get) => ({
  board: new Array(8).fill(new Array(4).fill(null)),
  turn: 1,
  simulateTurn: (row: number, col: number) => {
    set((state: any) => {
      const newBoard = state.board.map((row: any) => [...row]);
      newBoard[row][col] = state.turn;
      return { board: newBoard, turn: (state.turn + 1) % 2 };
    });
  },
  checkState: () => {
    const { board } = get() as any;
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
  },
  checkIfDraw: () => {
    const { board, checkState } = get() as any;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === null) return false;
      }
    }
    return checkState() === null;
  },
  updateCell: (row: number, col: number, player: number) => {
    set((state: any) => {
      const newBoard = state.board.map((row: any) => [...row]);
      newBoard[row][col] = player;
      return { board: newBoard };
    });
  },
  flipColumn: (col: number) =>
    set((state: any) => {
      const newBoard = state.board.map((row: any) => [...row]);
      // swap rows 0 and 7, 1 and 6, 2 and 5, 3 and 4
      for (let i = 0; i < 4; i++) {
        const temp = newBoard[i][col];
        newBoard[i][col] = newBoard[7 - i][col];
        newBoard[7 - i][col] = temp;
      }
      return { board: newBoard };
    }),
}));

const Connect4Column = ({ col }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [board, simulateTurn, flipColumn] = useBoardStore(
    (state: any) => [state.board, state.simulateTurn, state.flipColumn],
    shallow
  );

  function animate() {
    ref.current?.animate(
      [
        { transform: "rotateX(0deg)" },
        { transform: "rotateX(180deg)" },
        { transform: "rotateX(0deg)" },
      ],
      { duration: 1000, iterations: 1, easing: "ease-in-out" }
    );
  }

  return (
    <VStack
      display="inline-flex"
      p={3}
      backgroundColor="#5E6398"
      spacing={6}
      ref={ref}
    >
      {new Array(8).fill(null).map((cell: any, row: number) => (
        <Button
          variant="unstyled"
          disabled={board[row][col] !== null}
          boxSize={12}
          onClick={() => {
            if (board[row][col] !== null) return;
            simulateTurn(row, col);
            animate();
            setTimeout(() => {
              flipColumn(col);
            }, 500);
          }}
          cursor="pointer"
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
  const toast = useToast();
  const [board, checkState, checkIfDraw] = useBoardStore(
    (state: any) => [state.board, state.checkState, state.checkIfDraw],
    shallow
  );

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
        Connect 4 Flip
      </Heading>
      <HStack justifyContent="center" mt={4} spacing={4}>
        {new Array(4).fill(null).map((_, i: number) => (
          <Connect4Column key={i} col={i} />
        ))}
      </HStack>
    </Box>
  );
};

export default Connect4Page;
