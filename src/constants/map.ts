// Shared map coordinate system constants for Leonida Atlas (Elongated Florida-inspired layout)
export const MAP_WIDTH = 2000;
export const MAP_HEIGHT = 2800;

// Coordinate helpers
export const toSvgX = (pctX: number) => (pctX / 100) * MAP_WIDTH;
export const toSvgY = (pctY: number) => (pctY / 100) * MAP_HEIGHT;
