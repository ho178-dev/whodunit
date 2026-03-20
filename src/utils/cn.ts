// Tailwindクラス名を結合・マージするユーティリティ関数
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwindクラス名を結合・マージして返す
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
