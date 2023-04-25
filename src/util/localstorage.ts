export const userDataKeys = {
  PROJECT_ID: 'projectId',
  HAS_SEEN: 'hasSeen',
};
export const userModalKeys = {
  REDEPLOY_KEY: 'HideRedeployModel',
};

type UserData = {
  [key: string]: string;
};

export class UserLocalStorage {
  domain: string;
  data: UserData;

  constructor() {
    this.domain = window.location.host;
    this.data = this.getData();
  }

  getData(): UserData {
    const data = localStorage.getItem(this.domain);
    return data ? JSON.parse(data) : {};
  }

  setData(key: string, value: string): void {
    this.data[key] = value;
    localStorage.setItem(this.domain, JSON.stringify(this.data));
  }

  getDataByKey(key: string): string {
    return this.data ? this.data[key] : null;
  }

  deleteDataByKey(key: string): void {
    delete this.data[key];
    localStorage.setItem(this.domain, JSON.stringify(this.data));
  }

  clearAllData(): void {
    localStorage.removeItem(this.domain);
  }
}
