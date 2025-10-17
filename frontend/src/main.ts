import { mount } from "svelte";
import App from "./App.svelte";
import "./css/main.css";
import { ServerConnector } from "./ts/api";
import { ViewerState } from "./ts/state";
import { OpenedState } from "./ts/state/opened";

async function Main() {
  mount(App, {
    target: document.getElementById("app")!,
  });

  document.title = "Loading...";
  await new ServerConnector().Connect();
  new OpenedState();
  await new ViewerState().initialize();
  document.title = "Eureka";
}

Main();
