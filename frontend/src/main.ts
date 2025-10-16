import "./css/main.css";
import { mount } from "svelte";
import App from "./App.svelte";
import { ServerConnector } from "./ts/api";
import { Dialogs } from "./ts/dialog";

async function Main() {
  document.title = "Loading...";
  await new ServerConnector().Connect();

  document.title = "Eureka";

  Dialogs.subscribe((v) => {
    console.log(v);
  });

  mount(App, {
    target: document.getElementById("app")!,
  });
}

Main();
