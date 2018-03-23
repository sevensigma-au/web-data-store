export interface ILocalDataStore {
  timeoutSecs: number;
  getItem(key: string, timeoutSecs?: number): any;
  setItem(key: string, value: any, timeoutSecs?: number): void;
  removeItem(key: string): void;
}
