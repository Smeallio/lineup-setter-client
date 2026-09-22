export interface PlayerAssignment {
    playerId: string;
    playerName: string;
    slot: string;
}

export interface LineupByInning { 
    inning: number;
    assignments: PlayerAssignment[];
}

export interface FullLineup {
    id: string;
    createdAt: string;
    innings: LineupByInning[];
}