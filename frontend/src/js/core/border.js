/**
 * Content Border Manager
 * Version: 1.0.1
 * Description: Manages content containment and border appearance
 */

document.addEventListener('DOMContentLoaded', function() {
    // We're now using direct CSS borders instead of a separate element
    // This script will handle any additional adjustments needed
    
    // Get the main content element
    const mainContent = document.getElementById('main-content');
    
    if (mainContent) {
        // اضافه کردن کلاس content برای اطمینان از اعمال استایل‌های مربوطه
        mainContent.classList.add('content');
        
        // ایجاد کانتینر داخلی اگر وجود ندارد
        if (!mainContent.querySelector('.content-inner')) {
            const innerContainer = document.createElement('div');
            innerContainer.className = 'content-inner';
            
            // انتقال همه فرزندان به کانتینر داخلی
            while (mainContent.firstChild) {
                innerContainer.appendChild(mainContent.firstChild);
            }
            
            // افزودن کانتینر داخلی به محتوای اصلی
            mainContent.appendChild(innerContainer);
        }
        
        // بررسی وضعیت کادر پس از بارگذاری کامل صفحه
        setTimeout(function() {
            const computedStyle = window.getComputedStyle(mainContent, '::before');
            console.log('Border visibility check - Bottom border:', computedStyle.borderBottomWidth);
            
            // اطمینان از نمایش درست کادر پایین
            if (parseInt(computedStyle.borderBottomWidth) < 2) {
                console.log('Fixing bottom border issue');
                document.documentElement.style.setProperty('--bottom-fix', '12px');
            }
        }, 500);
    }
    
    console.log('Content border fixed with bottom border visibility improvements');
}); 