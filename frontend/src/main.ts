import { mount } from "svelte";
import App from "./App.svelte";
import AppShared from "./AppShared.svelte";
import "./css/main.css";
import { ServerConnector } from "./ts/api";
import { ContextMenuState } from "./ts/state/context";
import { KeyboardState } from "./ts/state/keyboard";
import { ModularityState } from "./ts/state/modular";
import { OpenedState } from "./ts/state/opened";
import { GlobalShareState, ShareState } from "./ts/state/share";
import { ViewerState } from "./ts/state/viewer";

async function Main() {
  const searchParams = new URLSearchParams(location.search);
  const shareValue = searchParams.get("share");

  document.title = "Loading...";

  await new ServerConnector().Connect();

  if (shareValue) {
    new ContextMenuState();
    new ShareState(shareValue);
    await new ViewerState().initialize();
    new ModularityState();
  }

  mount(shareValue ? AppShared : App, {
    target: document.getElementById("app")!,
  });

  GlobalShareState?.initialize()

  if (!shareValue) {
    new KeyboardState().initialize();
    new ContextMenuState();
    new ModularityState();
    new OpenedState();
    await new ViewerState().initialize();
  }

  document.title = "EUREKA";
}

Main();
