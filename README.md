# Fracture

A beautiful web application that transforms images into stunning fractured, shattered glass effects using Voronoi diagrams and advanced canvas rendering techniques.

![Fracture App](https://img.shields.io/badge/React-19.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.2.5-purple) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

## ✨ Features

- **Real-time Image Fracturing**: Upload any image and watch it transform with customizable shatter effects
- **Advanced Controls**: Fine-tune every aspect of the fracture effect:
  - Shard count (0-500)
  - Refraction intensity
  - Gap width and color
  - Stability percentage
  - X/Y axis elongation
  - Rotation and scatter effects
- **Mobile Optimized**: Fully responsive design that works beautifully on all devices
- **Web Share API**: Native sharing on mobile devices with automatic fallback to download
- **Drag & Drop**: Intuitive image upload with drag-and-drop support
- **Real-time Preview**: See your changes instantly as you adjust parameters
- **High-Quality Export**: Download or share your fractured images in JPEG format

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fracture-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The production build will be output to the `dist` directory, ready for deployment to any static hosting service.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Usage

1. **Upload an Image**: Click or drag and drop an image onto the upload area
2. **Adjust Parameters**: Use the controls panel to customize the fracture effect:
   - **Shards**: Number of fracture pieces (0 = original image)
   - **Refraction**: Intensity of the displacement effect
   - **Gap Width**: Thickness of the gaps between shards
   - **Gap Color**: Color of the gaps (default: black)
   - **Stability**: Percentage of shards that remain unchanged
   - **Elongation**: Stretch the effect along X or Y axis
   - **Rotation**: Rotate the entire fracture pattern
   - **Scatter**: Random rotation applied to individual shards
3. **Save Your Work**: 
   - On mobile: Use the "Share Image" button to share via native sharing
   - On desktop: Use the "Download" button to save the image

## 🛠️ Tech Stack

- **React 19.2.0** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **d3-delaunay** - Voronoi diagram generation
- **react-dropzone** - Drag & drop file uploads
- **lucide-react** - Icon library
- **Canvas API** - Image rendering and manipulation

## 📱 Mobile Support

Fracture is fully optimized for mobile devices:

- **Responsive Layout**: Controls panel adapts to screen size
- **Touch-Friendly**: All controls are optimized for touch interaction
- **Web Share API**: Native sharing on iOS Safari and Chrome Android
- **Performance**: Optimized canvas rendering for mobile devices
- **PWA Ready**: Meta tags configured for mobile web app installation

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari (latest)
- Chrome Android (latest)

Web Share API is supported on:
- iOS Safari 12.1+
- Chrome Android 76+
- Samsung Internet 10+

On unsupported browsers, the share button automatically falls back to download.

## 🎯 How It Works

Fracture uses Voronoi diagrams to create the shatter effect:

1. **Point Generation**: Random points are generated based on the shard count
2. **Voronoi Tessellation**: The image is divided into cells using Delaunay triangulation
3. **Transform Application**: Each cell is transformed with rotation, scaling, and displacement
4. **Gap Rendering**: Optional gaps are drawn between shards with customizable colors
5. **Canvas Rendering**: The final result is rendered to a high-quality canvas

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚢 Deployment

Fracture can be deployed to any static hosting service:

### GitHub Pages

The repository includes a GitHub Actions workflow for automatic deployment. 

#### Automatic Deployment (Recommended)

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Push to main/master branch**: The workflow will automatically build and deploy your app.

#### Manual Deployment

If you prefer to deploy manually or if your repository name differs from `fracture-app`:

1. **Build for GitHub Pages**:
   ```bash
   # Replace 'your-repo-name' with your actual GitHub repository name
   REPO_NAME=your-repo-name npm run build:gh-pages
   ```

2. **Deploy the dist folder**:
   - Go to Settings → Pages in your repository
   - Select your branch (usually `gh-pages` or `main`)
   - Set the folder to `/dist` or upload the contents of `dist` to your Pages branch

**Troubleshooting**: If you see a blank page, check:
- Your repository name matches the `REPO_NAME` used in the build command
- The base path in `vite.config.js` matches your repository name
- Browser console for JavaScript errors (F12 → Console)
- That all files in `dist` were uploaded correctly

### Other Hosting Services

- **Vercel**: `vercel --prod`
- **Netlify**: Connect your Git repository
- **Cloudflare Pages**: Connect your repository

The app is a static site with no backend requirements.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

Contributions are welcome! Please feel free to fork the repository and submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

For questions or suggestions, please open an issue on GitHub.

---

Built with ❤️ using React and Vite
