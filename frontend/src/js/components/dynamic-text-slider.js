/**
 * Dynamic Text Slider with Typing Animation
 * Uses Typed.js to create a typing animation effect for displaying phrases
 */
document.addEventListener('DOMContentLoaded', () => {
    const typedElement = document.getElementById('typed-text');
    
    if (typedElement) {
        // Parent container for better positioning and alignment
        const container = document.querySelector('.dynamic-text-slider');
        
        // Initialize Typed.js with optimized settings for cursor alignment
        const typed = new Typed('#typed-text', {
            strings: [
                'Fans Decide the Score',
                'Quality over Hype',
                'The Numbers Behind Hip-Hop',
                'Honest Ratings, Better Music',
                'Real Scores, Real Hip-Hop',
                'Listen, Rate, Influence'
            ],
            typeSpeed: 50,          // Typing speed in milliseconds
            backSpeed: 30,          // Backspacing speed in milliseconds
            backDelay: 1500,        // Time before backspacing starts
            startDelay: 500,        // Time before typing starts
            loop: true,             // Loop the animation indefinitely
            showCursor: true,       // Show blinking cursor
            cursorChar: '|',        // Character for the cursor
            autoInsertCss: true,    // Let Typed.js handle cursor CSS
            fadeOut: false,         // Don't fade out the text
            smartBackspace: true,   // Only backspace what doesn't match the previous string
            onStringTyped: (arrayPos, self) => {
                // Ensure cursor stays with the text after each string is typed
                fixCursorAlignment();
            },
            preStringTyped: (arrayPos, self) => {
                // Ensure cursor is properly positioned before typing starts
                fixCursorAlignment();
            }
        });
        
        // Helper function to fix cursor alignment issues
        function fixCursorAlignment() {
            // Get the cursor element that Typed.js creates
            const cursor = document.querySelector('.typed-cursor');
            if (cursor) {
                // Make sure cursor is visible and properly styled
                cursor.style.display = 'inline-block';
                cursor.style.verticalAlign = 'middle';
                
                // Ensure the text and cursor are centered together
                if (container) {
                    container.style.display = 'flex';
                    container.style.justifyContent = 'center';
                    container.style.alignItems = 'center';
                }
            }
        }
        
        // Initial fix for cursor position
        setTimeout(fixCursorAlignment, 100);
        
        // Fix on window resize for responsive views
        window.addEventListener('resize', fixCursorAlignment);
    }
}); 