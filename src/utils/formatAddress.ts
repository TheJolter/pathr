export default function formatAddress(input: string | null): string | null {
  if (input === null) {
    return null;
  }

  if (input.length < 11) {
    return input;
  }

  return `${input.slice(0, 6)}***${input.slice(-4)}`;
}