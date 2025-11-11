# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Netflix clone web application built with vanilla HTML, CSS, and JavaScript. It's a fun parody project that displays movie/content recommendations with a humorous twist - featuring "worst movies of the last 40 years" and special profiles for different user types including "Terraplanistas" (flat earthers) and book lovers.

## Development Commands

### Running the Application
```bash
# Start a local HTTP server in the project root
python3 -m http.server 8000
# OR
python -m http.server 8000
# OR use any other HTTP server like live-server, serve, etc.

# Access at: http://localhost:8000
```

**Important**: The application requires an HTTP server to function properly due to CORS restrictions when loading JSON data. Using `file://` protocol will result in limited functionality.

## Architecture

### Core Structure
- **index.html**: Main entry point with carousel layout and profile selector
- **js/main.js**: Primary application logic for rendering content and carousels
- **js/service.js**: Data fetching and fallback handling
- **js/acoes.js**: User interaction handlers (profile switching)
- **json/**: Data files for different content profiles
- **style/**: CSS files including responsive design and Owl Carousel themes

### Data System
The application uses a profile-based content system:
- `dados.json`: Default movie/show content
- `piadas.json`: Flat earther/conspiracy content (triggered by `?handicapped=true`)
- `livros.json`: Book recommendations (triggered by `?hero=true`)

### Content Rendering
1. **Initialization**: `init()` determines user profile from URL parameters
2. **Data Loading**: `buscarDados()` fetches appropriate JSON file
3. **Main Carousel**: Dynamic hero banners with background images
4. **Category Carousels**: Horizontal scrolling content sections
5. **Fallback**: `SEM_DADOS` provides error state with helpful links

### Profile System
Three user profiles accessible via dropdown or URL parameters:
- **Normal** (default): Regular movie content
- **Terraplanista** (`?handicapped=true`): Conspiracy/flat earth content
- **Book Lover** (`?hero=true`): Book recommendations with different layout styling

### Dependencies
- **jQuery**: Required for Owl Carousel functionality
- **Owl Carousel**: Powers both main hero carousel and category carousels
- **FontAwesome**: Icons for buttons and UI elements

### Key Functions
- `setarDadosApp()`: Main content orchestrator in js/main.js:25
- `criarItemPrincipal()`: Builds hero carousel items in js/main.js:163
- `criarCategoria()`: Generates category sections in js/main.js:120
- `buscarDados()`: Handles data fetching with error fallback in js/service.js:50
- `mudarPerfil()`: Profile switching logic in js/acoes.js:1

### Error Handling
The application includes robust fallback mechanisms:
- Network failures redirect to book recommendations
- CORS errors provide helpful Stack Overflow links
- Missing data gracefully degrades to default content

## File Organization
```
/
├── index.html              # Main application entry
├── js/
│   ├── main.js            # Core application logic
│   ├── service.js         # Data fetching & fallbacks
│   ├── acoes.js           # User interactions
│   └── owl/               # Carousel library files
├── json/
│   ├── dados.json         # Default content
│   ├── piadas.json        # Flat earth content
│   └── livros.json        # Book recommendations
├── style/
│   ├── main.css           # Primary styles
│   ├── responsive.css     # Mobile responsiveness
│   └── owl/               # Carousel styling
└── img/                   # Static images
```

## Development Notes

- The application uses Portuguese language throughout
- All external dependencies are loaded via CDN except for local Owl Carousel files
- Image sources mix local files and external URLs
- The carousel system is heavily customized with responsive breakpoints
- Profile switching uses URL parameters and page reloads rather than SPA routing