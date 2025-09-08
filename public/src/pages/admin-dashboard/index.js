// Main entry point for the admin dashboard
import SidebarLoader from './modules/utils/sidebar-loader.js';
import OfficesCard from './modules/core/offices-card.js';
import UsersCard from './modules/core/users-card.js';
import ActivityLogs from './modules/core/activity-logs.js';

document.addEventListener('DOMContentLoaded', function() {
    SidebarLoader.init();
    OfficesCard.init();
    UsersCard.init();
    ActivityLogs.init();
});