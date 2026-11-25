export interface Position {
    id: string;
    position: string;
    field: 'infield' | 'outfield';
}

export interface AddPositionRequest {
    position: string;
    field: 'infield' | 'outfield';
}