export interface SOSPuzzle {
    id: string;
    description: string;
    initialGrid: ({ value: 'S' | 'O' | null, playerIndex: number | null })[][];
    targetScore: number; // How many points needed to win
    movesAllowed: number; // Max moves to achieve target
    difficulty: 'Easy' | 'Medium' | 'Hard';
    gridSize: number;
}

export const DAILY_PUZZLES: SOSPuzzle[] = [
    {
        id: 'daily-1',
        description: 'The Setup',
        difficulty: 'Easy',
        gridSize: 3,
        targetScore: 1,
        movesAllowed: 1,
        initialGrid: [
            [{ value: 'S', playerIndex: 0 }, { value: null, playerIndex: null }, { value: 'S', playerIndex: 0 }],
            [{ value: null, playerIndex: null }, { value: null, playerIndex: null }, { value: null, playerIndex: null }],
            [{ value: null, playerIndex: null }, { value: null, playerIndex: null }, { value: null, playerIndex: null }],
        ]
    },
    {
        id: 'daily-2',
        description: 'Double Trouble',
        difficulty: 'Medium',
        gridSize: 4,
        targetScore: 2,
        movesAllowed: 1,
        initialGrid: [
            [{ value: 'S', playerIndex: 1 }, { value: null, playerIndex: null }, { value: 'S', playerIndex: 1 }, { value: null, playerIndex: null }],
            [{ value: null, playerIndex: null }, { value: null, playerIndex: null }, { value: null, playerIndex: null }, { value: null, playerIndex: null }],
            [{ value: 'S', playerIndex: null }, { value: null, playerIndex: null }, { value: 'S', playerIndex: 1 }, { value: null, playerIndex: null }],
            [{ value: null, playerIndex: null }, { value: null, playerIndex: null }, { value: null, playerIndex: null }, { value: null, playerIndex: null }],
        ]
    },
    {
        id: 'daily-3',
        description: 'Endgame Expert',
        difficulty: 'Hard',
        gridSize: 5,
        targetScore: 3,
        movesAllowed: 5,
        initialGrid: [
            [{ value: 'S', playerIndex: 1 }, { value: 'O', playerIndex: 1 }, { value: 'S', playerIndex: 1 }, { value: 'O', playerIndex: 1 }, { value: null, playerIndex: null }],
            [{ value: 'O', playerIndex: 1 }, { value: 'S', playerIndex: 1 }, { value: 'O', playerIndex: 1 }, { value: 'S', playerIndex: 1 }, { value: null, playerIndex: null }],
            [{ value: 'S', playerIndex: 1 }, { value: 'O', playerIndex: 1 }, { value: null, playerIndex: null }, { value: 'O', playerIndex: 1 }, { value: 'S', playerIndex: 1 }],
            [{ value: 'O', playerIndex: 1 }, { value: 'S', playerIndex: 1 }, { value: 'O', playerIndex: 1 }, { value: 'S', playerIndex: 1 }, { value: null, playerIndex: null }],
            [{ value: null, playerIndex: null }, { value: null, playerIndex: null }, { value: null, playerIndex: null }, { value: null, playerIndex: null }, { value: null, playerIndex: null }],
        ]
    }
];
