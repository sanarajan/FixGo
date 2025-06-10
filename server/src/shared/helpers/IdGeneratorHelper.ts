import { v4 as uuidv4 } from 'uuid';

export function generateWorkerId(): string {
  const uniquePart = uuidv4().replace(/-/g, "").slice(0, 6);
  console.log(uniquePart+" generated work in helper")
  return `WKR${uniquePart.toUpperCase()}`;
}