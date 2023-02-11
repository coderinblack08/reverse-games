export interface Rating {
  correct: boolean[];
  misplaced: boolean[];
}

function pickRandom(input: any[] | string) {
  return input[Math.floor(Math.random() * input.length)];
}

async function getWords() {
  const all = await fetch("/possible-words.txt");
  return (await all.text()).split("\n").map((w) => w.trim());
}

export async function generateWord() {
  const words = await getWords();
  return pickRandom(words);
}

function countTrue(input: boolean[]) {
  return input.filter((x) => x).length;
}

export async function generateGuess(answer: string) {
  const words = await getWords();
  const ratings = [];
  for (const word of words) {
    if (word !== answer) {
      ratings.push(rateGuess(answer, word));
    }
  }
  ratings.sort((a, b) => {
    return (
      countTrue(a.correct) - countTrue(b.correct) ||
      countTrue(a.misplaced) - countTrue(b.misplaced)
    );
  });

  function exponentiallySpaced(input: any[], count: number) {
    const result = [];
    for (let i = 1; i <= count; i++) {
      result.push(input[Math.floor((input.length - 1) * (i / count))]);
    }
    return result;
  }

  return exponentiallySpaced(ratings, 5);
}

export function rateGuess(answer: string, text: string): Rating {
  const correct = new Array(5).fill(false);
  const misplaced = new Array(5).fill(false);
  for (let i = 0; i < 5; i++) {
    if (text.at(i) === answer.at(i)) {
      correct[i] = true;
    } else if (answer.includes(text.at(i)!)) {
      misplaced[i] = true;
    }
  }
  return { correct, misplaced };
}
