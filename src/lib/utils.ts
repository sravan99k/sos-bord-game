import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateGameCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateTombolaTicket(): number[][] {
  // Generate a 9x3 Tombola ticket with 15 numbers
  // Each row has exactly 5 numbers, each column has numbers from specific ranges
  const ticket: (number | null)[][] = Array(3).fill(null).map(() => Array(9).fill(null));
  
  const columnRanges = [
    [1, 9], [10, 19], [20, 29], [30, 39], [40, 49],
    [50, 59], [60, 69], [70, 79], [80, 90]
  ];
  
  // Generate numbers for each column
  for (let col = 0; col < 9; col++) {
    const [min, max] = columnRanges[col]!;
    const count = col === 0 || col === 8 ? 
      Math.floor(Math.random() * 2) + 1 : 
      Math.floor(Math.random() * 3) + 1;
    
    const numbers: number[] = [];
    while (numbers.length < Math.min(count, 3)) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!numbers.includes(num)) numbers.push(num);
    }
    numbers.sort((a, b) => a - b);
    
    const rows = [0, 1, 2].sort(() => Math.random() - 0.5).slice(0, numbers.length);
    rows.sort((a, b) => a - b);
    
    numbers.forEach((num, i) => {
      ticket[rows[i]!]![col] = num;
    });
  }
  
  // Ensure each row has exactly 5 numbers
  for (let row = 0; row < 3; row++) {
    const filledCount = ticket[row]!.filter(n => n !== null).length;
    
    if (filledCount < 5) {
      // Add more numbers
      const emptyCols = ticket[row]!.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
      const needed = 5 - filledCount;
      
      for (let i = 0; i < needed && emptyCols.length > 0; i++) {
        const colIdx = Math.floor(Math.random() * emptyCols.length);
        const col = emptyCols.splice(colIdx, 1)[0]!;
        const [min, max] = columnRanges[col]!;
        
        let num: number;
        do {
          num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (ticket.some(r => r[col] === num));
        
        ticket[row]![col] = num;
      }
    } else if (filledCount > 5) {
      // Remove excess numbers
      const filledCols = ticket[row]!.map((v, i) => v !== null ? i : -1).filter(i => i !== -1);
      const excess = filledCount - 5;
      
      for (let i = 0; i < excess; i++) {
        const colIdx = Math.floor(Math.random() * filledCols.length);
        const col = filledCols.splice(colIdx, 1)[0]!;
        ticket[row]![col] = null;
      }
    }
  }
  
  // Convert null to 0 for the final result
  return ticket.map(row => row.map(n => n ?? 0));
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}
