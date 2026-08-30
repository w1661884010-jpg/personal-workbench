import { createRoot } from "react-dom/client";
import { LearningWorkbench } from "../app/components/LearningWorkbench";
import "../app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("缺少应用挂载节点 #root。");
}

createRoot(root).render(<LearningWorkbench />);
