import { mount } from "svelte";
import App from "./App.svelte";
import AppShared from "./AppShared.svelte";
import "./css/main.css";
import { ServerConnector } from "./ts/api";
import { KeyboardState } from "./ts/state/keyboard";
import { ModularityState } from "./ts/state/modular";
import { ShareState } from "./ts/state/share";
import { ViewerState } from "./ts/state/viewer";
import { ContextMenuState } from "./ts/state/context";

async function Main() {
  const searchParams = new URLSearchParams(location.search);
  const shareValue = searchParams.get("share");

  document.title = "Loading...";

  ServerConnector.initialize();
  ContextMenuState.Initialize();

  await ServerConnector.Connect();

  mount(shareValue ? AppShared : App, {
    target: document.getElementById("app")!,
  });

  if (shareValue) {
    document.title = "EUREKA Shared";
    await ShareState?.initialize(shareValue);
  } else {
    await ViewerState.initialize();
  }

  if (!shareValue) {
    KeyboardState.initialize();
    document.title = "EUREKA";
  }
}

Main();
