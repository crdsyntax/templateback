import { Logger } from "@nestjs/common";
import dayjs from "dayjs";

const logger = new Logger("common");

export const normalst = (val: string | undefined | null): string => {
  if (!val || typeof val !== "string") {
    return "";
  }

  const trimmedVal = val.trim();
  if (trimmedVal.length === 0) {
    return "";
  }

  try {
    return trimmedVal

      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9ñÑ ,.]/g, "")
      .trim()
      .toUpperCase();
  } catch (error) {
    logger.error("Error normalizando string:", error);
    return "";
  }
};

export const truncateToTwoDecimals = (num: number): number => {
  return Math.floor(num * 100) / 100;
};

export const safeNumber = (value: any) =>
  isNaN(Number(value)) ? 0 : Number(value);

export const safeMap = <T, R>(
  array: T[] | undefined | null,
  mapper: (item: T, index: number) => R,
  defaultValue: R[] = []
): R[] => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return defaultValue;
  }
  return array.map(mapper);
};

export const safeFilter = <T>(
  array: T[] | undefined | null,
  predicate: (item: T, index: number) => boolean,
  defaultValue: T[] = []
): T[] => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return defaultValue;
  }
  return array.filter(predicate);
};

export const safeReduce = <T, R>(
  array: T[] | undefined | null,
  reducer: (accumulator: R, item: T, index: number) => R,
  initialValue: R
): R => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return initialValue;
  }
  return array.reduce(reducer, initialValue);
};

export const safeFlatMap = <T, R>(
  array: T[] | undefined | null,
  mapper: (item: T, index: number) => R[],
  defaultValue: R[] = []
): R[] => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return defaultValue;
  }
  return array.flatMap(mapper);
};

export const ftDate = (date: any): string => {
  if (!date) return "";
  try {
    return dayjs(date).format("YYYY-MM-DD");
  } catch (error) {
    logger.error("Error formateando fecha:", error);
    return "";
  }
};
