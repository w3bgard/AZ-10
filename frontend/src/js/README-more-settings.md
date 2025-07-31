# More Settings Module

## Overview

The `more-settings.js` module handles the "More" button functionality and theme switching for the AZ10 platform. This is an optimized and refactored version of the previous `theme.js` file.

## Features

### 🎨 Theme Management

- **Dark/Light Theme Toggle**: Seamless switching between dark and light themes
- **Persistent Storage**: Theme preference is saved in localStorage
- **Smooth Transitions**: Enhanced animations and visual feedback
- **Accessibility**: Full keyboard navigation and screen reader support

### 🔧 Settings Window

- **Responsive Design**: Adapts to different screen sizes
- **Smart Positioning**: Automatically positions to avoid going off-screen
- **Keyboard Support**: Full keyboard navigation (Enter, Space, Escape)
- **Click Outside to Close**: Intuitive user experience

### ♿ Accessibility Features

- **ARIA Attributes**: Proper labeling and state management
- **Keyboard Navigation**: Tab, Enter, Space, and Escape key support
- **Focus Management**: Automatic focus handling for better UX
- **Screen Reader Support**: Proper semantic markup

## Code Improvements

### 🏗️ Architecture

- **Class-based Structure**: Organized, maintainable code
- **Event Delegation**: Efficient event handling
- **Error Handling**: Robust error catching and logging
- **Memory Management**: Proper cleanup and event removal

### ⚡ Performance Optimizations

- **Debounced Events**: Prevents excessive function calls
- **Efficient DOM Queries**: Minimized DOM traversal
- **Smooth Animations**: Hardware-accelerated transitions
- **Lazy Initialization**: Theme functionality only loads when needed

### 🎯 User Experience

- **Visual Feedback**: Hover effects and button animations
- **Smooth Transitions**: CSS transitions for all state changes
- **Responsive Design**: Works on all device sizes
- **Intuitive Interactions**: Natural user flow

## Usage

### Basic Initialization

```javascript
// The module auto-initializes when loaded
// No additional setup required
```

### Programmatic Theme Control

```javascript
// Get current theme
const currentTheme = moreSettings.getCurrentTheme();

// Set theme programmatically
moreSettings.setTheme("light"); // or 'dark'

// Check if settings window is open
const isOpen = moreSettings.isOpen();
```

### Event Listening

```javascript
// Listen for theme changes
document.addEventListener("themeChanged", (event) => {
  console.log("Theme changed to:", event.detail.theme);
});
```

## File Structure

```
frontend/src/js/
├── more-settings.js          # Main module file
└── README-more-settings.md   # This documentation
```

## Dependencies

- **Font Awesome**: For icons (fas fa-ellipsis-h, fas fa-moon, fas fa-sun)
- **CSS Variables**: Uses CSS custom properties for theming
- **Modern JavaScript**: ES6+ features (classes, arrow functions, etc.)

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **ES6+ Support**: Requires modern JavaScript features
- **CSS Grid/Flexbox**: For responsive layout

## Migration from theme.js

The old `theme.js` file has been completely replaced with `more-settings.js`. Key improvements:

1. **Better Organization**: Class-based structure instead of global functions
2. **Enhanced Accessibility**: Full ARIA support and keyboard navigation
3. **Improved Performance**: Optimized event handling and DOM operations
4. **Better Error Handling**: Try-catch blocks and proper error logging
5. **Cleaner Code**: More readable and maintainable structure

## Future Enhancements

- [ ] Add more settings options (language, notifications, etc.)
- [ ] Implement theme auto-detection based on system preference
- [ ] Add animation preferences
- [ ] Support for custom themes
- [ ] Integration with user preferences API

## Contributing

When modifying this module:

1. Maintain accessibility standards
2. Test on multiple devices and screen sizes
3. Ensure smooth animations and transitions
4. Add proper error handling
5. Update this documentation

## License

Part of the AZ10 platform - By The Community / For The Community
