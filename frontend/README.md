# AZ10 Frontend

AZ10 is a Persian Hip-Hop Rating Platform that allows users to discover, rate, and review tracks, artists, and more.

## Shared Components System

This project uses a shared components system to maintain consistency across pages and reduce code duplication.

### Core Components

The shared components system includes:

1. **Common UI Elements** - `src/components/shared/Layout/common-elements.js`

   - Side panel with navigation
   - Error container for displaying messages
   - Loading indicator
   - Common page header structure

2. **HTML Templates** - `src/components/shared/Layout/html-templates.js`

   - Standard HTML head content
   - Body layout templates
   - Filter controls
   - Common HTML structures

3. **Common CSS** - `src/styles/components/common.css`

   - Styles for common UI elements that appear across pages
   - Filter controls styling
   - View toggle styling
   - Error and loading indicators

4. **Page Builder** - `src/js/utils/page-builder.js`

   - Utility for constructing consistent page HTML
   - Handles all the standard page elements

5. **View Toggle Utility** - `src/js/utils/view-toggle.js`

   - Handles toggling between grid and list views
   - Persists user preferences across sessions

6. **Page Generator** - `src/js/generators/page-generator.js`
   - Tool for generating new pages from templates
   - Contains predefined page templates

### Page Structure

Each page follows a consistent structure:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
  <head>
    <!-- Common CSS and meta tags -->
    <!-- Page-specific CSS -->
  </head>
  <body class="page-specific-class">
    <!-- Side Panel -->
    <div id="side-panel" class="panel"></div>

    <!-- Main Content -->
    <main id="main-content" class="content">
      <!-- Page Header -->
      <div class="page-header">...</div>

      <!-- Filters (if applicable) -->
      <div class="filter-section">...</div>

      <!-- Main Content Container -->
      <div id="content-container" class="content-grid view-grid">
        <!-- Content -->
      </div>
    </main>

    <!-- Common UI Elements -->
    <!-- Error Container -->
    <!-- Loading Indicator -->

    <!-- Core Scripts -->
    <!-- Common UI Elements Script -->
    <!-- Page-specific Scripts -->
  </body>
</html>
```

### Creating New Pages

#### Method 1: Using the Page Generator

For Node.js environments, you can use the page generator:

```javascript
import { generatePage } from "./src/js/generators/page-generator.js";

// Generate a listing page
generatePage("artists", "listing-page", {
  title: "AZ10 | Artists",
  description: "Browse and discover Persian Hip-Hop artists",
  headerTitle: "Artists",
  headerDescription: "Explore the best artists in the Persian Hip-Hop scene",
});
```

#### Method 2: Manual Creation

1. Create a new HTML file in the `public` directory
2. Use the HTML templates from `src/components/shared/Layout/html-templates.js`
3. Create a CSS file in `src/styles/pages/[page-name]/[page-name].css`
4. Import the common elements in your scripts

Example:

```javascript
import { initCommonElements } from "../src/components/shared/Layout/common-elements.js";
import { initViewToggle } from "../src/js/utils/view-toggle.js";

// Initialize common elements
document.addEventListener("DOMContentLoaded", initCommonElements);

// Initialize view toggle if needed
initViewToggle("#contentContainer");
```

### URL Structure and Linking

Pages are linked with consistent URL patterns:

- **Home**: `/`
- **List Pages**: `/{category}.html` (e.g., `/artists.html`, `/blogs.html`)
- **Detail Pages**: `/{category}-detail.html?id={id}` (e.g., `/artist-detail.html?id=123`)

All links in the navigation and "View All" buttons follow these patterns.
