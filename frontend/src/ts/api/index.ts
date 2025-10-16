import type { AxiosInstance } from "axios";
import axios, { toFormData } from "axios";
import Cookies from "js-cookie";
import type { FolderRead } from "../../types/folder";
import type { ExistingEurekaNote } from "../../types/note";
import type { UserPreferences } from "../../types/preferences";
import type { ExistingEurekaUser } from "../../types/user";
import { globalErrorHandler } from "../error";
import { type Unsubscriber } from "../writable";
import { Connected, LoggedIn, Preferences, UserInfo } from "./stores";
import { ShowDialog } from "../dialog";

export let GlobalServerConnector: ServerConnector | undefined;

export class ServerConnector {
  private token?: string;
  private userInfo?: ExistingEurekaUser;
  private url: string;
  private axios?: AxiosInstance;
  private preferencesUnsubscribe?: Unsubscriber;

  constructor(url: string = import.meta.env.EUREKA_SERVER_URL) {
    this.url = url;

    GlobalServerConnector = this;
    if (import.meta.env.DEV) (window as any).ServerConnector = this;
  }

  //#region CONNECTION

  async Connect() {
    this.axios = axios?.create({
      baseURL: this.url,
    });

    try {
      const response = await this.axios.get("/ping");

      if (response.data?.ping !== "Pong!") throw "";
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }

    Connected.set(true);
    await this.loadToken();

    if (this.token) {
      this.startPreferencesSubscriber();
    }
  }

  //#endregion
  //#region TOKEN

  async loadToken() {
    const token = Cookies.get("eurekaToken");
    if (!token) return;

    const valid = await this.continueWithToken(token);
  }

  saveToken(token: string) {
    Cookies.set("eurekaToken", token, {
      expires: 365, // backend kicks us out after 1 day of inactivity, so this property doesn't matter.
      domain: import.meta.env.DEV ? "localhost" : location.hostname,
    });
  }

  resetCookies() {
    Cookies.remove("eurekaToken");
  }

  public async GetUserInfo(token = this.token): Promise<ExistingEurekaUser | undefined> {
    try {
      const response = await this.axios!.get(`/auth/user/info`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status !== 200) throw "Token invalid";

      return response.data as ExistingEurekaUser;
    } catch (e) {
      globalErrorHandler(e);
      return undefined;
    }
  }

  async continueWithToken(token: string) {
    const userInfo = await this.GetUserInfo(token);

    if (!userInfo) {
      this.resetEnvironment();
      return false;
    }

    this.saveToken(token);
    this.userInfo = userInfo;
    this.token = token;
    Preferences.set(userInfo.preferences);
    UserInfo.set(userInfo);
    LoggedIn.set(true);

    return true;
  }

  resetEnvironment() {
    this.preferencesUnsubscribe?.();
    this.preferencesUnsubscribe = undefined;
    Preferences.set({});
    LoggedIn.set(false);
    UserInfo.set(undefined);
    this.token = undefined;
    this.userInfo = undefined;
  }

  //#endregion
  //#region PREFERENCES

  startPreferencesSubscriber() {
    if (this.preferencesUnsubscribe) return;

    this.preferencesUnsubscribe = Preferences.subscribe((v) => {
      this.commitPreferences(v);
    });
  }

  async commitPreferences(v: UserPreferences) {
    try {
      await this.axios?.put("/auth/user/preferences", JSON.stringify(v), {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
      });
    } catch {
      ShowDialog({
        title: "Server error",
        message: "Failed to save your preferences to the server. Please refresh the page to try again.",
        buttons: [{ caption: "Refresh", action: () => location.reload() }, { caption: "Okay" }],
      });
      // todo: error handling
    }
  }

  //#endregion
  //#region AUTHORIZATION

  async login(username: string, password: string) {
    try {
      const response = await this.axios!.post("/auth/login", toFormData({ username, password }));
      const token = response.data?.token;

      if (!token) return undefined;

      await this.continueWithToken(token);

      return response.data?.token as string;
    } catch (e) {
      globalErrorHandler(e);
      return undefined;
    }
  }

  async logout() {
    try {
      await this.axios!.post(`/auth/logout`, {}, { headers: { Authorization: `Bearer ${this.token}` } });

      this.resetCookies();
      this.resetEnvironment();

      return true;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  async register(username: string, password: string) {
    try {
      const response = await this.axios!.post("/auth/register", toFormData({ username, password }));

      return response.status === 200;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  //#endregion
  //#region NOTES

  async readNote(id: string): Promise<ExistingEurekaNote | undefined> {
    try {
      const response = await this.axios!.get(`/notes/read/${id}`, { headers: { Authorization: `Bearer ${this.token}` } });

      return response.data as ExistingEurekaNote;
    } catch (e) {
      globalErrorHandler(e);
      return undefined;
    }
  }

  async writeNote(id: string, data: string): Promise<boolean> {
    try {
      const response = await this.axios!.put(`/notes/write/${id}`, toFormData({ data }), {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return response.status === 200;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  async deleteNote(id: string): Promise<boolean> {
    try {
      const response = await this.axios!.delete(`/notes/delete/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return response.status === 200;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  async moveNote(id: string, path: string) {
    try {
      const response = await this.axios!.patch(`/notes/move/${id}`, toFormData({ path }), {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return response.status === 200;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  async renameNote(id: string, newName: string) {
    try {
      const response = await this.axios!.patch(`/notes/rename/${id}`, toFormData({ newName }), {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return response.status === 200;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  //#endregion
  //#region FOLDERS

  async readFolder(path = "") {
    try {
      const response = await this.axios!.get(path ? `/folders/read/${path}`.replace("//", "/") : `/folders/read`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return response.data as FolderRead;
    } catch (e) {
      globalErrorHandler(e);
      return undefined;
    }
  }

  async deleteFolder(path: string) {
    try {
      const response = await this.axios!.delete(`/folders/delete/${path}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return response.status === 200;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  async moveFolder(path: string) {
    try {
      const response = await this.axios!.delete(`/folders/move/${path}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return response.status === 200;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  async renameFolder(path: string) {
    try {
      const response = await this.axios!.delete(`/folders/rename/${path}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return response.status === 200;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  async createFolder(path: string) {
    try {
      const response = await this.axios!.delete(`/folders/create/${path}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return response.status === 200;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  //#endregion
}
