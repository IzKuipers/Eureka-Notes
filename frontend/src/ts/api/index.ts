import type { AxiosInstance } from "axios";
import axios, { toFormData } from "axios";
import Cookies from "js-cookie";
import type { FolderRead } from "../../types/folder";
import type { ExistingEurekaNote, NoteSearchResults } from "../../types/note";
import type { UserPreferences } from "../../types/preferences";
import type { ExistingEurekaUser } from "../../types/user";
import { ShowDialog } from "../dialog";
import { globalErrorHandler } from "../error";
import { GlobalOpenedState } from "../state/opened";
import { GlobalViewerState } from "../state/viewer";
import { sortByKey } from "../util";
import { type Unsubscriber } from "../writable";
import { BuildHash, Connected, Connecting, EurekaVersion, LoggedIn, Preferences, UserInfo } from "./stores";

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
    Connecting.set(true);
    this.axios = axios?.create({
      baseURL: this.url,
    });

    try {
      const response = await this.axios.get("/ping");

      if (response.data?.ping !== "Pong!") throw "";

      BuildHash.set(response.data.build);
      EurekaVersion.set(response.data.version);
    } catch (e) {
      Connected.set(false);
      globalErrorHandler(e);
      return false;
    }

    await this.loadToken();

    Connected.set(true);

    if (this.token) {
      this.startPreferencesSubscriber();
    }
  }

  //#endregion
  //#region TOKEN

  async loadToken() {
    const token = Cookies.get("eurekaToken");
    if (!token) return;

    await this.continueWithToken(token);
  }

  saveToken(token: string, username: string) {
    Cookies.set("eurekaToken", token, {
      expires: 365, // backend kicks us out after 1 day of inactivity, so this property doesn't matter.
      domain: location.hostname,
    });

    Cookies.set("eurekaUsername", username, {
      expires: 365,
      domain: location.hostname,
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

    this.saveToken(token, userInfo.username);
    this.userInfo = userInfo;
    this.token = token;
    Preferences.set(userInfo.preferences);
    UserInfo.set(userInfo);
    LoggedIn.set(true);
    await GlobalViewerState?.initialize();

    return true;
  }

  resetEnvironment() {
    this.preferencesUnsubscribe?.();
    this.preferencesUnsubscribe = undefined;
    Preferences.set({});
    LoggedIn.set(false);
    UserInfo.set(undefined);
    GlobalOpenedState?.reset();
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
        buttons: [
          { caption: "Refresh", action: () => location.reload() },
          { caption: "Okay", autofocus: true },
        ],
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

  async moveNote(id: string, newFolderId: string) {
    try {
      const response = await this.axios!.patch(`/notes/move/${id}`, toFormData({ newFolderId }), {
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

  async createNote(name: string, data: string, folderId?: string, refresh = true) {
    try {
      const response = await this.axios!.post(`/notes`, toFormData({ name, data, folderId }), {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      if (refresh) await GlobalViewerState?.refresh();

      return response.data as ExistingEurekaNote;
    } catch (e) {
      globalErrorHandler(e);
      return undefined;
    }
  }

  async searchNotes(query: string, folderId?: string): Promise<NoteSearchResults> {
    try {
      const response = await this.axios!.post(`/notes/search`, toFormData({ query, folderId }), {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      response.data.length = 20;

      return response.data.filter(Boolean) as NoteSearchResults;
    } catch (e) {
      globalErrorHandler(e);

      return [];
    }
  }

  //#endregion
  //#region FOLDERS

  async readFolderByPath(path = "") {
    try {
      const response = await this.axios!.get(path ? `/folders/read/path/${path}`.replaceAll("//", "/") : `/folders/read/path`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      const data = response.data as FolderRead;

      data.folders = sortByKey(data.folders, "name");
      data.notes = sortByKey(data.notes, "name");

      return response.data as FolderRead;
    } catch (e) {
      globalErrorHandler(e);
      return undefined;
    }
  }

  async readFolderById(id: string) {
    if (!id) return await this.readFolderByPath("");

    try {
      const response = await this.axios!.get(`/folders/read/id/${id}`, { headers: { Authorization: `Bearer ${this.token}` } });

      const data = response.data as FolderRead;

      data.folders = sortByKey(data.folders, "name");
      data.notes = sortByKey(data.notes, "name");

      return response.data as FolderRead;
    } catch (e) {
      globalErrorHandler(e);
      return undefined;
    }
  }

  async deleteFolder(id: string) {
    try {
      const response = await this.axios!.delete(`/folders/delete/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      return response.status === 200;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  async moveFolder(folderId: string, destinationId?: string) {
    try {
      const response = await this.axios!.post(
        `/folders/move`,
        toFormData({
          id: folderId,
          destinationId,
        }),
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );

      return response.status === 200;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  async renameFolder(folderId: string, newName: string) {
    try {
      const response = await this.axios!.post(`/folders/rename/${folderId}`, toFormData({ newName }), {
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
      const response = await this.axios!.post(
        `/folders/create/${path}`,
        {},
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );

      return response.status === 200;
    } catch (e) {
      globalErrorHandler(e);
      return false;
    }
  }

  //#endregion
}
