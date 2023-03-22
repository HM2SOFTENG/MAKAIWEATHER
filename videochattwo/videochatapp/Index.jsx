import { createRoot } from "react-dom/client";
import App from "./VideoApp";
import "./Index.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
