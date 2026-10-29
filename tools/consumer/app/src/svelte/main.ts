import "@fluidkit/blur/style.css";
import "@fluidkit/core/motion.css";
import "../scene.css";
import { mount } from "svelte";
import App from "./App.svelte";

mount(App, { target: document.getElementById("app")! });
