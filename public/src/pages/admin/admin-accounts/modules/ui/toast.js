export function showToast(message, type = 'info', duration = 3000, redirectUrl = null) {
    let container = document.getElementById('toast-container');
    
    if(!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-4 right-4 z-[10000] space-y-3 w-full max-w-xs';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type} animate-fade-in-up`;
    toast.setAttribute('role', 'alert');

    const { icon, bgColor, borderColor } = getToastStyles(type);

    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon" style="background-color: ${bgColor}">
                ${icon}
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Close">×</button>
        </div>
    `;

    container.appendChild(toast);

    const closeToast = () => {
        toast.classList.remove('animate-fade-in-up');
        toast.classList.add('animate-fade-out-down');

        setTimeout(() => {
            toast.remove();
            if(redirectUrl) {
                window.location.href = redirectUrl;
            }

            if (container && container.children.length === 0) {
                container.remove();
            }
        }, 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', closeToast);

    if (duration > 0 ){
        setTimeout(closeToast, duration);
    }

    return closeToast;
}

function getToastStyles(type) {
   const styles = {
        success: {
            icon: '✓',
            bgColor: '#28a745',
            borderColor: '#28a745'
        },
        error: {
            icon: '✕',
            bgColor: '#dc3545',
            borderColor: '#dc3545'
        },
        warning: {
            icon: '⚠',
            bgColor: '#ffc107',
            borderColor: '#ffc107'
        },
        info: {
            icon: 'ⓘ',
            bgColor: '#17a2b8',
            borderColor: '#17a2b8'
        }
    };
    
    return styles[type] || styles.info;
}

export const Toast = {
    success: (message, duration, redirectUrl) =>
        showToast(message, 'success', duration, redirectUrl),
    error: (message, duration, redirectUrl) =>
        showToast(message, 'error', duration, redirectUrl),
    warning: (message, duration, redirectUrl) =>
        showToast(message, 'warning', duration, redirectUrl),
    info: (message, duration, redirectUrl) =>
        showToast(message, 'info', duration, redirectUrl)
};

const style = document.createElement('style');
style.id = 'toast-styles';
style.textContent = `
.toast-notification {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-left: 4px solid;
        width: 100%;
        overflow: hidden;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
    }
    
    .animate-fade-in-up {
        animation: fadeInUp 0.3s ease-out forwards;
    }
    
    .animate-fade-out-down {
        animation: fadeOutDown 0.3s ease-in forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        padding: 1rem;
        gap: 0.75rem;
    }
    
    .toast-icon {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 0.75rem;
        color: white;
        flex-shrink: 0;
    }
    
    .toast-message {
        flex: 1;
        font-size: 0.875rem;
        line-height: 1.25;
        color: #333;
    }
    
    .toast-close {
        background: none;
        border: none;
        font-size: 1.125rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 1.25rem;
        height: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.125rem;
        transition: all 0.2s;
        flex-shrink: 0;
    }
    
    .toast-close:hover {
        background-color: #f5f5f5;
        color: #333;
    }
    
    /* Type-specific border colors */
    .toast-success { border-left-color: #28a745; }
    .toast-error { border-left-color: #dc3545; }
    .toast-warning { border-left-color: #ffc107; }
    .toast-info { border-left-color: #17a2b8; }
`;

if(!document.getElementById('toast-styles')) {
    document.head.appendChild(style);
}
