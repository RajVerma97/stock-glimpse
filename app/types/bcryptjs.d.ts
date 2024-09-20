declare module 'bcryptjs' {
  export function hash(data: string, salt: string | number): Promise<string>
  export function compare(data: string, encrypted: string): Promise<boolean>
  export function genSalt(rounds?: number): Promise<string>
  // Add more functions as needed
}
