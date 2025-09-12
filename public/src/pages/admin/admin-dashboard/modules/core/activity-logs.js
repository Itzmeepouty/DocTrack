import ApiService from '../constants/api.js';
import TimeFormatter from '../utils/time-formatter.js';
import LogStyleFormatter from '../utils/log-formatter.js';

const ActivityLogs = {
    init: function() {
        this.loadLogs();
        this.setupFilterListener();
    },
    
    loadLogs: async function() {
        const logsData = await ApiService.fetchLogs();
        
        if (logsData.error) {
            this.showErrorState();
            return;
        }
        
        // Store logs for filtering
        this.logs = logsData;
        
        // Initial render with all logs
        this.renderLogs(logsData);
    },
    
    renderLogs: function(logs) {
        const container = document.getElementById('activity-log-container');
        const loadingSpinner = document.getElementById('log-loading');
        
        if (loadingSpinner) {
            loadingSpinner.remove();
        }
        
        container.innerHTML = '';
        
        if (!logs || logs.length === 0) {
            this.showEmptyState();
            return;
        }
        
        logs.forEach(log => {
            const logElement = this.createLogElement(log);
            container.appendChild(logElement);
        });
    },
    
    createLogElement: function(log) {
        const style = LogStyleFormatter.getLogTypeStyle(log.log_type);
        const timeAgo = TimeFormatter.formatTimestamp(log.created_datetime);
        
        const logElement = document.createElement('div');
        logElement.className = 'flex items-center justify-between p-4 bg-white bg-opacity-50 rounded-lg';
        logElement.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="p-2 ${style.bgColor} rounded-lg">
                    ${style.icon}
                </div>
                <div>
                    <p class="font-medium text-gray-800">${log.log_title}</p>
                    <p class="text-sm text-gray-600">${log.log_desc}</p>
                </div>
            </div>
            <div class="flex items-center space-x-3">
                <span class="status-badge ${style.statusClass}">${style.statusText}</span>
                <span class="text-sm text-gray-500">${timeAgo}</span>
            </div>
        `;
        
        return logElement;
    },
    
    filterLogs: function(filterValue) {
        if (filterValue === 'all') {
            return this.logs;
        }
        return this.logs.filter(log => log.log_type === filterValue);
    },
    
    setupFilterListener: function() {
        const filterElement = document.getElementById('log-filter');
        if (filterElement) {
            filterElement.addEventListener('change', (e) => {
                const filteredLogs = this.filterLogs(e.target.value);
                this.renderLogs(filteredLogs);
            });
        }
    },
    
    showEmptyState: function() {
        const container = document.getElementById('activity-log-container');
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No activity logs found</p>
            </div>
        `;
    },
    
    showErrorState: function() {
        const container = document.getElementById('activity-log-container');
        const loadingSpinner = document.getElementById('log-loading');
        
        if (loadingSpinner) {
            loadingSpinner.remove();
        }
        
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load activity logs</p>
                <button onclick="ActivityLogs.loadLogs()" class="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                    Try Again
                </button>
            </div>
        `;
    }
};

// Make it available globally for the retry button
window.ActivityLogs = ActivityLogs;

export default ActivityLogs;