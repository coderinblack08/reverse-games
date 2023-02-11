export async function isWord(word: string) {
  const words = await fetch("/5-letter-words.txt");
  const text = await words.text();
  return text.includes(word.toUpperCase());
}
