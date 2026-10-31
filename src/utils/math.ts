export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const smoothstep = (value: number) => value * value * (3 - 2 * value);

export const easeOutCubic = (value: number) => 1 - (1 - value) ** 3;

export const easeOutQuart = (value: number) => 1 - (1 - value) ** 4;
