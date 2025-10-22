import { mount } from "svelte";
import App from "./App.svelte";
import "./css/main.css";
import { ServerConnector } from "./ts/api";
import { ContextMenuState } from "./ts/state/context";
import { ModularityState } from "./ts/state/modular";
import { OpenedState } from "./ts/state/opened";
import { ViewerState } from "./ts/state/viewer";

async function Main() {
  mount(App, {
    target: document.getElementById("app")!,
  });

  document.title = "Loading...";

  await new ServerConnector().Connect();
  new ContextMenuState();
  new ModularityState();
  new OpenedState();
  await new ViewerState().initialize();
  document.title = "EUREKA";
}

Main();
