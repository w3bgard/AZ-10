/**
 * Lightbox Manager
 * مدیریت نمایش تصاویر با کیفیت بالا در lightbox
 */
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('imageLightbox');
    const closeButton = document.querySelector('.lightbox-close');
    
    // بستن lightbox با کلیک روی دکمه بستن
    if (closeButton) {
        closeButton.addEventListener('click', closeLightbox);
    }
    
    // بستن lightbox با کلیک روی بک‌گراند تیره
    if (lightbox) {
        lightbox.addEventListener('click', function(event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // بستن lightbox با کلید ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
    
    // تابع بستن lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // برگرداندن اسکرول صفحه
    }
}); 