export interface PlayerAssignment {
    playerId: string;
    playerName: string;
    position: string;
    field: 'infield' | 'outfield' | 'bench';
}

export interface Slot {
    position: string;
    field: 'infield' | 'outfield' | 'bench';
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