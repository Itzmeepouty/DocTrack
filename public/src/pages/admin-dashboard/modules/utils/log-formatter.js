// Utility functions for formatting log styles
const LogStyleFormatter = {
    getLogTypeStyle: function(logType) {
        switch (logType) {
            case 'Created':
                return {
                    icon: `<i class="fas fa-plus-circle text-purple-600 w-5 h-5"></i>`,
                    bgColor: 'bg-purple-100',
                    statusClass: 'status-created',
                    statusText: 'Created'
                };
            case 'Verified':
                return {
                    icon: `<i class="fas fa-check-circle text-green-600 w-5 h-5"></i>`,
                    bgColor: 'bg-green-100',
                    statusClass: 'status-verified',
                    statusText: 'Verified'
                };
            case 'Updated':
                return {
                    icon: `<i class="fas fa-edit text-indigo-600 w-5 h-5"></i>`,
                    bgColor: 'bg-indigo-100',
                    statusClass: 'status-updated',
                    statusText: 'Updated'
                };
            case 'Deleted':
                return {
                    icon: `<i class="fas fa-trash-alt text-red-600 w-5 h-5"></i>`,
                    bgColor: 'bg-red-100',
                    statusClass: 'status-deleted',
                    statusText: 'Deleted'
                };
            case 'Approved':
                return {
                    icon: `<i class="fas fa-thumbs-up text-emerald-600 w-5 h-5"></i>`,
                    bgColor: 'bg-emerald-100',
                    statusClass: 'status-approved',
                    statusText: 'Approved'
                };
            case 'Rejected':
                return {
                    icon: `<i class="fas fa-times-circle text-rose-600 w-5 h-5"></i>`,
                    bgColor: 'bg-rose-100',
                    statusClass: 'status-rejected',
                    statusText: 'Rejected'
                };
            case 'Completed':
                return {
                    icon: `<i class="fas fa-check text-teal-600 w-5 h-5"></i>`,
                    bgColor: 'bg-teal-100',
                    statusClass: 'status-completed',
                    statusText: 'Completed'
                };
            case 'Pending':
                return {
                    icon: `<i class="fas fa-hourglass-half text-yellow-600 w-5 h-5"></i>`,
                    bgColor: 'bg-yellow-100',
                    statusClass: 'status-pending',
                    statusText: 'Pending'
                };
            default:
                return {
                    icon: `<i class="fas fa-info-circle text-gray-600 w-5 h-5"></i>`,
                    bgColor: 'bg-gray-100',
                    statusClass: 'status-unknown',
                    statusText: logType
                };
        }
    }
};

export default LogStyleFormatter;