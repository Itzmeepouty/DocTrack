const TimeFormatter = {
    formatTimestamp: function(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        
        // Add 8 hours to convert UTC to Philippine Time (UTC+8)
        const phTime = new Date(date.getTime() + (8 * 60 * 60 * 1000));
        const nowPhTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
        
        const diffInSecs = Math.floor((nowPhTime - phTime) / 1000);

        if (diffInSecs < 60) {
            return `${diffInSecs} seconds ago`;
        }

        const diffInMins = Math.floor(diffInSecs / 60);
        if (diffInMins < 60) {
            return `${diffInMins} minutes ago`;
        }

        const diffInHours = Math.floor(diffInMins / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        }
        
        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) {
            return `${diffInWeeks} weeks ago`;
        }

        // For logs older than 4 weeks, return the date in Philippine time
        return phTime.toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};

export default TimeFormatter;