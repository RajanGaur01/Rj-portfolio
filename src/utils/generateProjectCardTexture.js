import { portfolioData } from '../data/portfolioData';

// Helper to asynchronously preload an image
function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback to local SVG data uri if remote image fails
      resolve(null);
    };
    img.src = url;
  });
}

// Generate minimal 3-element card texture: 1. Single Real Image, 2. Project Name, 3. Project Description
export function renderCleanProjectCardCanvas(project, loadedImage = null) {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d');
  if (!ctx) return project.image;

  // Background smoked obsidian
  ctx.fillStyle = '#0a0a0e';
  ctx.fillRect(0, 0, 900, 1200);

  // Outer border with subtle silver glow
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 880, 1180);

  // =========================================================================
  // 1. SINGLE REAL PROJECT IMAGE (Takes top 72% of the card: 20px to 860px)
  // =========================================================================
  const imgX = 24;
  const imgY = 24;
  const imgW = 852;
  const imgH = 820;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(imgX, imgY, imgW, imgH, 16);
  ctx.clip();

  if (loadedImage && loadedImage.naturalWidth > 0) {
    // Draw real loaded image with perfect cover aspect ratio
    const imgAspect = loadedImage.naturalWidth / loadedImage.naturalHeight;
    const frameAspect = imgW / imgH;
    let sx, sy, sWidth, sHeight;
    if (imgAspect > frameAspect) {
      sHeight = loadedImage.naturalHeight;
      sWidth = loadedImage.naturalHeight * frameAspect;
      sx = (loadedImage.naturalWidth - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = loadedImage.naturalWidth;
      sHeight = loadedImage.naturalWidth / frameAspect;
      sx = 0;
      sy = (loadedImage.naturalHeight - sHeight) / 2;
    }
    ctx.drawImage(loadedImage, sx, sy, sWidth, sHeight, imgX, imgY, imgW, imgH);
  } else {
    // Fallback dark gradient if loading
    const grad = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
    grad.addColorStop(0, '#1c1c26');
    grad.addColorStop(1, '#0e0e14');
    ctx.fillStyle = grad;
    ctx.fillRect(imgX, imgY, imgW, imgH);
  }

  // Subtle bottom vignette over image to transition into text area
  const imgVignette = ctx.createLinearGradient(0, imgY + imgH - 180, 0, imgY + imgH);
  imgVignette.addColorStop(0, 'rgba(10, 10, 14, 0)');
  imgVignette.addColorStop(1, 'rgba(10, 10, 14, 0.85)');
  ctx.fillStyle = imgVignette;
  ctx.fillRect(imgX, imgY + imgH - 180, imgW, 180);

  ctx.restore();

  // Subtle image border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.strokeRect(imgX, imgY, imgW, imgH);

  // Hairline separator
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(36, 880);
  ctx.lineTo(864, 880);
  ctx.stroke();

  // =========================================================================
  // 2. PROJECT NAME (Bold, high-contrast white heading)
  // =========================================================================
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 48px sans-serif';
  ctx.fillText(project.title.toUpperCase(), 36, 950);

  // =========================================================================
  // 3. PROJECT DESCRIPTION (Clean 1-2 lines, light grey)
  // =========================================================================
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '400 26px sans-serif';
  
  const descText = project.subtitle || project.tagline || project.description || '';
  const words = descText.split(' ');
  let line = '';
  let y = 1010;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 820 && n > 0) {
      ctx.fillText(line, 36, y);
      line = words[n] + ' ';
      y += 40;
      if (y > 1110) break;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 36, y);

  return canvas.toDataURL('image/jpeg', 0.95);
}

// Project list
const allProjectsList = [
  ...portfolioData.projects,
  {
    id: 'cloud-platform',
    title: 'AWS CLOUD ARCHITECTURE',
    subtitle: 'Serverless microservices, Lambda functions, and S3 edge distribution.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    category: 'Cloud & Infrastructure',
    year: '2026',
    badge: 'INFRASTRUCTURE',
    problem: 'High-availability infrastructure for scalable full-stack applications.',
    solution: 'Configured AWS Lambda, S3 storage buckets, CloudFront CDN, and CI/CD pipelines.',
    tech: ['AWS Cloud', 'Node.js', 'Docker', 'REST APIs', 'CloudFront'],
    features: ['Automated CI/CD', 'Serverless Functions', 'Zero-Downtime Deployment'],
  },
  {
    id: 'ai-vision-lab',
    title: 'GEMINI AI VISION LAB',
    subtitle: 'Multimodal AI extraction pipelines and real-time prompt streaming.',
    image: 'https://images.unsplash.com/photo-1633493106185-075f73c683b5?q=80&w=1200&auto=format&fit=crop',
    category: 'Artificial Intelligence',
    year: '2026',
    badge: 'INTELLIGENCE',
    problem: 'Connecting complex multimodal AI models with real-time UI/UX state.',
    solution: 'Built structured JSON extraction pipelines with Google Gemini API & streaming output.',
    tech: ['Gemini AI API', 'Python', 'React', 'FastAPI', 'Vector Embeddings'],
    features: ['Streaming Inference', 'Context Caching', 'Visual Recognition'],
  },
  {
    id: 'flutter-ux',
    title: 'FLUTTER MOBILE UX',
    subtitle: '60 FPS cross-platform mobile architectures with offline state cache.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    category: 'Mobile Engineering',
    year: '2026',
    badge: 'MOBILE ENGINE',
    problem: 'Delivering 60 FPS mobile transitions across Android devices without stutter.',
    solution: 'Engineered custom Flutter render objects, Bloc state trees, and local Hive cache.',
    tech: ['Flutter', 'Dart', 'Bloc Pattern', 'Android SDK', 'Hive DB'],
    features: ['60 FPS Animations', 'Offline Sync', 'Custom Painters'],
  },
];

// Async loader that guarantees all real images are preloaded before rendering canvas textures
export async function loadAllProjectCardTextures() {
  const loadedList = await Promise.all(
    allProjectsList.map(async (proj, idx) => {
      const img = await preloadImage(proj.image);
      const dataUrl = renderCleanProjectCardCanvas(proj, img);
      return {
        src: dataUrl,
        rawImage: proj.image,
        alt: proj.title,
        project: proj,
        index: idx,
      };
    })
  );
  return loadedList;
}

// Synchronous initial fallback
export function getInitialProjectCardTextures() {
  return allProjectsList.map((proj, idx) => ({
    src: renderCleanProjectCardCanvas(proj, null),
    rawImage: proj.image,
    alt: proj.title,
    project: proj,
    index: idx,
  }));
}
