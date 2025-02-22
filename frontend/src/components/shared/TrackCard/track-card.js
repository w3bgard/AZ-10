/**
 * Track Card Component
 * Version: 4.0.0
 * Description: Shows a card for each track, including rating submission with an input field and result display.
 */

class TrackCard {
    constructor(trackData) {
        // داده‌های اصلی ترک + مقادیر پیش‌فرض
        this.data = this.initializeData(trackData);

        // ساخت ساختار کارت
        this.element = this.createCard();

        // تنظیم رویدادهای اولیه (کلیک روی کارت و غیره)
        this.setupEventListeners();
    }

    /**
     * مقداردهی اولیه داده‌ها با مقادیر پیش‌فرض
     */
    initializeData(data) {
        return {
            id: data.id || '',
            basicInfo: {
                title: data.basicInfo?.title || 'Untitled Track',
                artist: data.basicInfo?.artist || 'Unknown Artist',
                trackType: data.basicInfo?.trackType || 'Single',
                albumTitle: data.basicInfo?.albumTitle || '',
                releaseDate: data.basicInfo?.releaseDate || '',
                label: data.basicInfo?.label || '',
                category: data.basicInfo?.category || 'mainstream'
            },
            stats: {
                communityRating: data.stats?.communityRating || 0,
                numberOfVotes: data.stats?.numberOfVotes || 0
            },
            media: {
                coverArt: data.media?.coverArt || '/images/default-cover.jpg',
                hasVideo: data.media?.hasVideo || false
            },
            metadata: {
                duration: data.metadata?.duration || '',
                explicit: data.metadata?.explicit || false
            },
            productionCredits: data.productionCredits || {}
        };
    }

    /**
     * ساختار اصلی HTML کارت ترک
     * - تاریخ فقط به صورت میلادی نمایش داده می‌شود
     * - یک بخش جدید زیر اطلاعات ترک برای ثبت امتیاز + نمایش نتیجه اضافه شده است
     */
    createCard() {
        const card = document.createElement('div');
        card.className = 'track-card';
        card.setAttribute('data-track-id', this.data.id);

        // تاریخ میلادی
        const releaseDate = this.formatDate(this.data.basicInfo.releaseDate);

        // ساختار HTML
        card.innerHTML = `
            <div class="card-image">
                <img src="${this.data.media.coverArt}" alt="${this.data.basicInfo.title}" loading="lazy">
                <div class="card-overlay">
                    ${this.createRatingBadge()} 
                    ${this.createDurationBadge()}
                    ${this.data.media.hasVideo ? this.createVideoBadge() : ''}
                </div>
            </div>
            <div class="card-info">
                <div class="track-main-info">
                    <h3 class="track-title">${this.data.basicInfo.title}</h3>
                    <div class="artist-info">
                        <span class="artist-name">${this.data.basicInfo.artist}</span>
                        ${
                            this.data.basicInfo.albumTitle
                                ? `<span class="album-name">from "${this.data.basicInfo.albumTitle}"</span>`
                                : ''
                        }
                    </div>
                </div>

                <!-- تاریخ فقط میلادی -->
                <div class="track-details">
                    ${this.createTrackMetadata()}
                </div>

                <!-- بخش ثبت امتیاز و نمایش نتیجه -->
                <div class="rating-section">
                    <div class="rating-input-container">
                        <input 
                            type="number" 
                            class="rating-input" 
                            placeholder="" 
                            min="0" 
                            max="10" 
                            step="0.1"
                        />
                        <button class="rate-submit-btn">Rate</button>
                    </div>
                    <div class="rating-result">
                        Overall >> 
                        <span class="rating-value">${this.data.stats.communityRating.toFixed(1)}</span>
                        /10
                        (<span class="rating-votes">${this.formatNumber(this.data.stats.numberOfVotes)}</span> votes)
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    /**
     * ساخت نشانگر امتیاز در اورلی (rating-badge)
     * این بخش در بالای کاور ترک نمایش داده می‌شود.
     */
    createRatingBadge() {
        const rating = this.data.stats.communityRating.toFixed(1);
        return `
            <div class="rating-badge">
                <span class="rating-score">${rating}</span>
                <span class="rating-max">/10</span>
            </div>
        `;
    }

    /**
     * نشانگر مدت زمان ترک (در صورت وجود)
     */
    createDurationBadge() {
        if (!this.data.metadata.duration) return '';
        return `
            <div class="duration-badge">
                <span>${this.data.metadata.duration}</span>
            </div>
        `;
    }

    /**
     * نشانگر ویدیو
     */
    createVideoBadge() {
        return `
            <div class="video-badge">
                <i class="fas fa-video"></i>
            </div>
        `;
    }

    /**
     * اطلاعات تولید (تهیه‌کننده، etc.)
     */
    createTrackMetadata() {
        const producer = this.data.productionCredits?.music?.beatProducer;
        if (!producer) return '';
        return `
            <div class="metadata-section">
                <div class="producer-info">
                    <span>Prod. by ${producer}</span>
                </div>
            </div>
        `;
    }

    /**
     * آمار (تعداد رای، New Wave badge و غیره)
     */
    createStatsSection() {
        return `
            <div class="stats-section">
                <div class="votes-count">
                    <i class="far fa-star"></i>
                    <span>${this.formatNumber(this.data.stats.numberOfVotes)} votes</span>
                </div>
                ${
                    this.data.basicInfo.category === 'newWave'
                        ? '<span class="new-wave-badge">New Wave</span>'
                        : ''
                }
            </div>
        `;
    }

    /**
     * فرمت‌بندی تاریخ میلادی
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * فرمت‌بندی اعداد (مثلاً 1500 => 1.5K)
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    /**
     * راه‌اندازی رویدادها
     * - کلیک روی کارت => هدایت به صفحهٔ جزئیات ترک
     * - هاور موس => نمایش/مخفی‌کردن امتیاز
     * - لود عکس => افزودن کلاس
     * - تنظیمات موبایل هاور
     * - رویداد کلیک برای دکمه ثبت امتیاز
     */
    setupEventListeners() {
        // کلیک روی کل کارت برای هدایت به صفحه جزئیات
        this.element.addEventListener('click', () => {
            window.location.href = `/track/${this.createSlug()}`;
        });

        // بارگذاری عکس
        const image = this.element.querySelector('img');
        image.addEventListener('load', () => {
            image.classList.add('loaded');
        });

        // هاور موس (نمایش اطلاعات امتیاز در overlay)
        const coverImage = this.element.querySelector('.card-image');
        coverImage.addEventListener('mouseenter', () => this.showRatingInfo());
        coverImage.addEventListener('mouseleave', () => this.hideRatingInfo());

        // هاور در موبایل
        this.setupMobileHover();

        // رویداد کلیک دکمه ثبت امتیاز
        const submitBtn = this.element.querySelector('.rate-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleRatingSubmission();
            });
        }
    }

    /**
     * هاور موس برای نشانگر امتیاز
     */
    showRatingInfo() {
        const ratingBadge = this.element.querySelector('.rating-badge');
        if (ratingBadge) ratingBadge.classList.add('hover');
    }

    hideRatingInfo() {
        const ratingBadge = this.element.querySelector('.rating-badge');
        if (ratingBadge) ratingBadge.classList.remove('hover');
    }

    /**
     * هاور موبایل: لمس روی کارت => اضافه‌کردن کلاس hover
     */
    setupMobileHover() {
        if ('ontouchstart' in window) {
            this.element.addEventListener('touchstart', () => {
                this.element.classList.add('hover');
            });
            document.addEventListener('touchstart', (ev) => {
                if (!this.element.contains(ev.target)) {
                    this.element.classList.remove('hover');
                }
            });
        }
    }

    /**
     * مدیریت ثبت امتیاز:
     * ۱) خواندن مقدار از فیلد input
     * ۲) بررسی صحت عدد (۰ تا ۱۰)
     * ۳) محاسبه میانگین جدید
     * ۴) به‌روزرسانی کارت و ذخیره در localStorage
     */
    handleRatingSubmission() {
        // آیا کاربر قبلاً امتیاز داده؟
        const ratedTracks = JSON.parse(localStorage.getItem('ratedTracks')) || {};
        if (ratedTracks[this.data.id]) {
            alert('شما قبلاً به این ترک امتیاز داده‌اید!');
            return;
        }

        // دریافت مقدار عددی از اینپوت
        const inputField = this.element.querySelector('.rating-input');
        if (!inputField) return;

        const ratingValue = parseFloat(inputField.value);
        if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 10) {
            alert('عدد واردشده معتبر نیست. لطفاً بین 0 تا 10 وارد کنید.');
            return;
        }

        // محاسبهٔ امتیاز جدید
        const currentVotes = this.data.stats.numberOfVotes || 0;
        const currentTotal = this.data.stats.communityRating * currentVotes;
        const newVoteCount = currentVotes + 1;
        const newAverage = (currentTotal + ratingValue) / newVoteCount;

        // بروزرسانی داده‌های ترک
        this.data.stats.communityRating = newAverage;
        this.data.stats.numberOfVotes = newVoteCount;

        // نمایش نتیجه در بخش .rating-result
        const ratingValueSpan = this.element.querySelector('.rating-value');
        const ratingVotesSpan = this.element.querySelector('.rating-votes');
        if (ratingValueSpan) {
            ratingValueSpan.textContent = newAverage.toFixed(1);
        }
        if (ratingVotesSpan) {
            ratingVotesSpan.textContent = this.formatNumber(newVoteCount);
        }

        // بروزرسانی نشانگر بالای کاور (rating-badge)
        const ratingBadge = this.element.querySelector('.rating-badge .rating-score');
        if (ratingBadge) {
            ratingBadge.textContent = newAverage.toFixed(1);
        }

        // ذخیره امتیاز در localStorage
        ratedTracks[this.data.id] = ratingValue;
        localStorage.setItem('ratedTracks', JSON.stringify(ratedTracks));

        alert('امتیاز شما با موفقیت ثبت شد!');
    }

    /**
     * ساخت slug برای URL
     */
    createSlug() {
        return `${this.data.basicInfo.title}-${this.data.basicInfo.artist}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
}

export default TrackCard;
