/**
 * Track Slider Navigation
 * با جلوه‌های بصری بهبود یافته برای اسلایدر ترک‌ها
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeSliders();
});

function initializeSliders() {
    const sliderContainers = document.querySelectorAll('.track-slider-container');
    
    sliderContainers.forEach(container => {
        const slider = container.querySelector('.track-slider');
        const leftBtn = container.querySelector('.scroll-btn.left');
        const rightBtn = container.querySelector('.scroll-btn.right');
        
        if (!slider || !leftBtn || !rightBtn) return;
        
        // به‌روزرسانی وضعیت دکمه‌ها در لود
        updateButtonStates(slider, leftBtn, rightBtn);
        
        // به‌روزرسانی وضعیت دکمه‌ها هنگام اسکرول
        slider.addEventListener('scroll', () => {
            updateButtonStates(slider, leftBtn, rightBtn);
            animateCurrentCards(slider);
        });
        
        // کلیک روی دکمه چپ
        leftBtn.addEventListener('click', () => {
            // اسکرول به اندازه تقریبی عرض ۲ کارت
            scrollTracks(slider, -480);
            
            // افکت دکمه
            animateButton(leftBtn);
        });
        
        // کلیک روی دکمه راست
        rightBtn.addEventListener('click', () => {
            // اسکرول به اندازه تقریبی عرض ۲ کارت
            scrollTracks(slider, 480);
            
            // افکت دکمه
            animateButton(rightBtn);
        });
        
        // اضافه کردن افکت به کارت‌ها هنگام اسکرول
        slider.addEventListener('scroll', debounce(() => {
            animateCurrentCards(slider);
        }, 100));
        
        // اجرای اولیه برای انیمیشن کارت‌ها
        animateCurrentCards(slider);
    });
}

/**
 * اسکرول اسلایدر به میزان مشخص
 */
function scrollTracks(container, offset) {
    container.scrollBy({
        left: offset,
        behavior: 'smooth'
    });
}

/**
 * انیمیشن دکمه هنگام کلیک
 */
function animateButton(button) {
    button.classList.add('button-clicked');
    setTimeout(() => {
        button.classList.remove('button-clicked');
    }, 200);
}

/**
 * به‌روزرسانی وضعیت دکمه‌های ناوبری بر اساس موقعیت اسکرول
 */
function updateButtonStates(slider, leftBtn, rightBtn) {
    // پنهان کردن دکمه چپ در ابتدا
    if (slider.scrollLeft <= 10) {
        leftBtn.style.opacity = '0.4';
        leftBtn.style.transform = 'translateY(-50%) scale(0.95)';
        leftBtn.style.pointerEvents = 'none';
    } else {
        leftBtn.style.opacity = '0.8';
        leftBtn.style.transform = 'translateY(-50%) scale(1)';
        leftBtn.style.pointerEvents = 'auto';
    }
    
    // پنهان کردن دکمه راست در انتها
    const isAtEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10;
    if (isAtEnd) {
        rightBtn.style.opacity = '0.4';
        rightBtn.style.transform = 'translateY(-50%) scale(0.95)';
        rightBtn.style.pointerEvents = 'none';
    } else {
        rightBtn.style.opacity = '0.8';
        rightBtn.style.transform = 'translateY(-50%) scale(1)';
        rightBtn.style.pointerEvents = 'auto';
    }
}

/**
 * برجسته‌سازی کارت‌های فعلی در مرکز نمایش
 */
function animateCurrentCards(slider) {
    const cards = slider.querySelectorAll('.track-card');
    const sliderCenter = slider.offsetLeft + slider.clientWidth / 2;
    
    cards.forEach(card => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2 - slider.scrollLeft;
        const distanceFromCenter = Math.abs(cardCenter - sliderCenter);
        
        // کارت‌های نزدیک به مرکز بزرگتر شوند
        if (distanceFromCenter < card.offsetWidth) {
            const scale = 1 - (distanceFromCenter / (card.offsetWidth * 2)) * 0.07;
            card.style.transform = `scale(${scale})`;
            card.style.zIndex = '2';
        } else {
            card.style.transform = 'scale(0.97)';
            card.style.zIndex = '1';
        }
    });
}

/**
 * تابع debounce برای بهینه‌سازی رویدادهای متوالی
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
} 