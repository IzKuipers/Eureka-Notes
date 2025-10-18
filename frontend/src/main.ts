import { mount } from "svelte";
import App from "./App.svelte";
import "./css/main.css";
import { ServerConnector } from "./ts/api";
import { ViewerState } from "./ts/state/viewer";
import { OpenedState } from "./ts/state/opened";
import { ModularityState } from "./ts/state/modular";

async function Main() {
  mount(App, {
    target: document.getElementById("app")!,
  });

  document.title = "Loading...";

  await new ServerConnector().Connect();
  new ModularityState();
  new OpenedState();
  await new ViewerState().initialize();
  document.title = "EUREKA";
}

Main();
