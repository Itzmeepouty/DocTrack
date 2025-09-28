import { loadTheme } from "../../../../assets/javascript/theme-manager.js";
import { TransactionManager } from "./modules/managers/TransactionManager.js";
import { loadSidebar } from "./modules/ui/sidebar.js";

document.addEventListener('DOMContentLoaded', async function() {
    loadTheme();
    loadSidebar();
    TransactionManager.init();
});