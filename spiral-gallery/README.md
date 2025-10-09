# 🌀 Spiral Gallery - 3D Interactive Gallery

A stunning 3D spiral gallery built with Three.js and GSAP, featuring smooth animations, particle effects, and interactive cards showcasing your services.

## ✨ Features

- **3D Spiral Layout**: Cards arranged in an elegant expanding helix
- **Smooth Scroll**: Momentum-based scrolling with spring physics
- **Interactive Cards**: Hover effects with shader-based animations
- **Particle System**: 2000+ flowing particles along the spiral path
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Keyboard Navigation**: Full accessibility support
- **Performance Optimized**: Automatic quality adjustment based on FPS
- **Custom Shaders**: GLSL shaders for advanced visual effects

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd spiral-gallery
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🎮 Controls

### Mouse/Touch
- **Scroll**: Navigate through the spiral
- **Hover**: Preview card with glow effect
- **Click**: Open detailed view

### Keyboard
- **Arrow Up/Down**: Scroll through cards
- **Tab**: Cycle through cards
- **Enter**: Select focused card
- **Escape**: Close detail view

## 📁 Project Structure

```
spiral-gallery/
├── index.html              # Main HTML file
├── main.js                 # Application entry point
├── style.css               # Additional styles
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
│
├── js/                     # JavaScript modules
│   ├── SceneManager.js     # Three.js scene setup
│   ├── SpiralController.js # Spiral path generation
│   ├── CardManager.js      # Card system & rendering
│   ├── AnimationEngine.js  # Scroll & animation logic
│   ├── InteractionHandler.js # User interactions
│   └── ParticleSystem.js   # Particle effects
│
├── shaders/                # GLSL shaders
│   ├── vertex.glsl         # Vertex shader
│   └── fragment.glsl       # Fragment shader
│
└── assets/                 # Images and textures
```

## 🎨 Customization

### Card Data

Edit the card information in `js/CardManager.js`:

```javascript
const CARD_DATA = [
    {
        id: 'custom-dev',
        title: 'Custom Development',
        category: 'Development',
        color: '#10b981',
        items: ['CMS Development', 'Web Applications', 'Mobile Apps'],
        icon: '💻'
    },
    // Add more cards...
];
```

### Spiral Configuration

Adjust spiral parameters in `main.js`:

```javascript
this.spiralController = new SpiralController({
    radius: 300,           // Base radius
    verticalSpacing: 80,   // Space between loops
    rotations: 2,          // Number of full rotations
    segments: 50           // Curve smoothness
});
```

### Performance Settings

Quality tiers automatically adjust based on FPS:
- **High**: All effects enabled (>50 FPS)
- **Medium**: Reduced particles (30-50 FPS)
- **Low**: Basic rendering (<30 FPS)

## 🔧 Technologies

- **Three.js** - 3D rendering engine
- **GSAP** - Animation library
- **Vite** - Build tool and dev server
- **WebGL/GLSL** - Custom shaders

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

**Note**: WebGL support required

## ⚡ Performance Tips

1. **Reduce Particle Count**: Lower `particleCount` in `ParticleSystem.js` for slower devices
2. **Disable Effects**: Comment out particle system initialization in `main.js`
3. **Adjust Card Count**: Reduce `cardCount` in `CardManager.js` for mobile

## 🐛 Troubleshooting

### Cards not appearing
- Check browser console for errors
- Ensure WebGL is enabled
- Try refreshing the page

### Poor performance
- Close other browser tabs
- Reduce particle count
- Check FPS in browser DevTools

### Shaders not loading
- Ensure GLSL files are in `shaders/` folder
- Check Vite configuration for `.glsl` file handling

## 📄 License

MIT License - Feel free to use for personal and commercial projects

## 👨‍💻 Author

LogicLayer Labs

---

**Enjoy your 3D Spiral Gallery!** 🎉
