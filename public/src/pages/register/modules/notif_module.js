// Toast notification function
export function showToast(message, type = 'info', duration = 3000, redirectUrl = null) {

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.setAttribute('data-aos', 'fade-up');
    toast.setAttribute('data-aos-duration', '200');
    
    // Toast content
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ⓘ'}
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Close">×</button>
        </div>
    `;

    // Add toast styles
    const style = document.createElement('style');
    style.textContent = `
        .toast-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-left: 4px solid #007bff;
            max-width: 350px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .toast-success {
            border-left-color: #28a745;
        }
        
        .toast-error {
            border-left-color: #dc3545;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            padding: 16px;
            gap: 12px;
        }
        
        .toast-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            color: white;
            flex-shrink: 0;
        }
        
        .toast-success .toast-icon {
            background-color: #28a745;
        }
        
        .toast-error .toast-icon {
            background-color: #dc3545;
        }
        
        .toast-info .toast-icon {
            background-color: #007bff;
        }
        
        .toast-message {
            flex: 1;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
        }
        
        .toast-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 2px;
            transition: background-color 0.2s;
            flex-shrink: 0;
        }
        
        .toast-close:hover {
            background-color: #f5f5f5;
            color: #333;
        }
    `;
    
    // Add styles to head if not already present
    if (!document.querySelector('#toast-styles')) {
        style.id = 'toast-styles';
        document.head.appendChild(style);
    }

    // Add toast to body
    document.body.appendChild(toast);

    // Initialize AOS animation
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }

    // Close function
    function closeToast() {
        toast.setAttribute('data-aos', 'fade-down');
        toast.setAttribute('data-aos-duration', '200');
        
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        }, 200);
    }

    // Close button event
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', closeToast);

    // Auto close after duration
    setTimeout(closeToast, duration);
}