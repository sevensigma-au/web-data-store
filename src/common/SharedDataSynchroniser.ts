import { Promise } from 'es6-promise';
import { ILocalDataStore } from '../model/LocalDataStore';

export class SharedDataSynchroniser {
  private static readonly defaultCheckPeriodMilliSecs = 500;
  private static readonly semaphoreKeySuffix = '-is-loading';

  constructor(
    public dataStore: ILocalDataStore,
    public checkPeriodMilliSecs: number = SharedDataSynchroniser.defaultCheckPeriodMilliSecs,
    public timeoutSecs: number = dataStore.timeoutSecs / 2
  ) { }

  public setIsLoading(dataKey: string, value: boolean): void {
    const semaphoreKey = `${dataKey}${SharedDataSynchroniser.semaphoreKeySuffix}`;
    this.dataStore.setItem(semaphoreKey, value);
  }

  public isLoading(dataKey: string): boolean {
    const semaphoreKey = `${dataKey}${SharedDataSynchroniser.semaphoreKeySuffix}`;
    return this.dataStore.getItem(semaphoreKey);
  }

  public waitForData(dataKey: string, timeoutSecs: number = this.timeoutSecs): Promise<any> {
    return new Promise<any>(
      (resolve, reject) => {
        if (this.dataStore) {
          window.setTimeout(() => { this.checkData(dataKey, timeoutSecs, this.checkPeriodMilliSecs / 1000, resolve, reject); }, this.checkPeriodMilliSecs);
        }
        else {
          reject(new Error(`A local data store is required to share data for data key: ${dataKey}.`));
        }
      }
    );
  }

  protected checkData(dataKey: string, timeoutSecs: number = this.timeoutSecs, waitedSecs: number = 0, resolve: (value?: any) => void, reject: (error?: any) => void): void {
    if (this.dataStore) {
      if (this.isLoading(dataKey)) {
        if (waitedSecs < timeoutSecs) {
          window.setTimeout(() => { this.checkData(dataKey, timeoutSecs, waitedSecs + this.checkPeriodMilliSecs / 1000, resolve, reject); }, this.checkPeriodMilliSecs);
        }
        else {
          reject(new Error(`The shared data timeout of ${timeoutSecs}s was exceeded for data key: ${dataKey}.`));
        }
      }
      else {
        resolve(this.dataStore.getItem(dataKey));
      }
    }
    else {
      reject(new Error(`A local data store is required to share data for data key: ${dataKey}.`));
    }
  }
}
