"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import * as THREE from "three";
import WidgetBase from "../../common/WidgetBase";
import SlideNavigation from "../../common/SlideNavigation";
import { WidgetTitle } from "../../common";
import type { WidgetBubbleChartData } from "../../../../interfaces/widgets";
import { RotateCcw, Maximize2, Minimize2, Zap } from "lucide-react";

interface CustomBubbleChartProps {
  data: WidgetBubbleChartData[];
  title?: string;
  subtitle?: string;
  isMobile?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

interface ThreeDBubbleData extends WidgetBubbleChartData {
  z: number;
  velocity?: { x: number; y: number; z: number };
  pulsePhase?: number;
  selected?: boolean;
}

export default function CustomBubbleChart({
  data,
  title = "Enhanced 3D Bubble Chart",
  subtitle = "Interactive 3D visualization with animations and filtering",
  onOpenSidebar,
  showSidebarButton = false,
  currentSlide,
  setCurrentSlide,
}: CustomBubbleChartProps & {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const bubbleGroupRef = useRef<THREE.Group | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const isMountedRef = useRef(true);

  const controlsRef = useRef<{
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    rotation: { x: number; y: number; z: number };
    dragPlane: THREE.Plane | null;
    dragPoint: THREE.Vector3 | null;
    velocity: { x: number; y: number };
  }>({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    dragPlane: null,
    dragPoint: null,
    velocity: { x: 0, y: 0 },
  });

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: ThreeDBubbleData;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isZoomedOut, setIsZoomedOut] = useState(false);

  // Detect mobile to apply full-screen sizing
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 425);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Convert 2D data to 3D by adding z-coordinate with enhanced data
  const threeDData: ThreeDBubbleData[] = useMemo(() => {
    const enhancedData: ThreeDBubbleData[] = [];

    // Original data points with enhanced properties
    data.forEach((item) => {
      enhancedData.push({
        ...item,
        z: Math.random() * 100,
        velocity: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        pulsePhase: Math.random() * Math.PI * 2,
        selected: false,
      });
    });

    // Add more data points for better density and variety
    const categories = [
      "Big Tech",
      "AI & Cloud",
      "Fintech",
      "Emerging Tech",
      "Healthcare",
      "Energy",
    ];
    for (let i = 0; i < 30; i++) {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      enhancedData.push({
        x: Math.random() * 3000,
        y: Math.random() * 70,
        z: Math.random() * 100,
        size: Math.random() * 60 + 15,
        category: category,
        label: `${category} Company ${i + 1}`,
        velocity: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.015,
          z: (Math.random() - 0.5) * 0.015,
        },
        pulsePhase: Math.random() * Math.PI * 2,
        selected: false,
      });
    }

    return enhancedData;
  }, [data]);

  // Filter data based on selected category
  const filteredData = useMemo(() => {
    if (!selectedCategory) return threeDData;
    return threeDData.filter((item) => item.category === selectedCategory);
  }, [threeDData, selectedCategory]);

  // Enhanced color mapping with gradients - lighter theme
  const getBubbleColor = useCallback((category: string) => {
    const categoryColorMap: Record<string, string> = {
      "Big Tech": "#FF6B9D", // Bright pink
      "AI & Cloud": "#4ECDC4", // Bright turquoise
      Fintech: "#45B7D1", // Bright blue
      "Emerging Tech": "#96CEB4", // Bright green
      Healthcare: "#FFA726", // Bright orange
      Energy: "#AB47BC", // Bright purple
    };
    const baseColor = categoryColorMap[category] || "#FF6B9D";

    // Create gradient effect based on intensity - keep colors bright and vibrant
    const color = new THREE.Color(baseColor);

    console.log(
      `Color for ${category}: base=${baseColor}, final=${color.getHexString()}`
    );
    return color;
  }, []);

  // Enhanced bubble material with better effects
  const getBubbleMaterial = useCallback(
    (category: string, isSelected: boolean = false) => {
      const baseColor = getBubbleColor(category);
      console.log(
        `Creating material for ${category}:`,
        baseColor.getHexString()
      );
      return new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.85,
      });
    },
    [getBubbleColor]
  );

  // Create connection lines between nearby bubbles
  const createConnectionLines = useCallback(() => {
    const lines = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.4,
      depthTest: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      linewidth: 2,
    });

    // Get all bubble positions - adjusted for dynamic cube size
    const allPositions: THREE.Vector3[] = [];
    const baseSize = isZoomedOut ? 175 : 350; // Half size when zoomed out
    filteredData.forEach((item) => {
      const dataScaleX = baseSize / 2;
      const dataScaleY = baseSize / 2;
      const dataScaleZ = baseSize / 2;

      const x = ((item.x - 1500) / 1500) * dataScaleX;
      const y = ((item.y - 35) / 35) * dataScaleY;
      const z = ((item.z - 50) / 50) * dataScaleZ;

      allPositions.push(new THREE.Vector3(x, y, z));
    });

    // Create connections between nearby bubbles (within same category and nearby bubbles)
    const maxDistance = 100; // Maximum distance for connections - adjusted for smaller cube

    for (let i = 0; i < allPositions.length; i++) {
      for (let j = i + 1; j < allPositions.length; j++) {
        const distance = allPositions[i].distanceTo(allPositions[j]);

        // Connect bubbles that are close to each other
        if (distance < maxDistance) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            allPositions[i],
            allPositions[j],
          ]);
          const line = new THREE.Line(geometry, lineMaterial);
          lines.add(line);
        }
      }
    }

    // Also create category-based connections for stronger visual grouping
    const categoryGroups: { [key: string]: THREE.Vector3[] } = {};
    filteredData.forEach((item, index) => {
      if (!categoryGroups[item.category]) {
        categoryGroups[item.category] = [];
      }
      categoryGroups[item.category].push(allPositions[index]);
    });

    // Create stronger connections within categories
    Object.values(categoryGroups).forEach((positions) => {
      if (positions.length > 1) {
        for (let i = 0; i < positions.length - 1; i++) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            positions[i],
            positions[i + 1],
          ]);
          const line = new THREE.Line(geometry, lineMaterial);
          lines.add(line);
        }
      }
    });

    return lines;
  }, [filteredData]);

  // Create glow effects for bubbles
  const createGlowEffect = useCallback(
    (bubble: THREE.Mesh, category: string) => {
      const radius = (bubble.geometry as THREE.SphereGeometry).parameters
        .radius;
      const glowGeometry = new THREE.SphereGeometry(radius * 1.2, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: getBubbleColor(category),
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      bubble.add(glow);
      return glow;
    },
    [getBubbleColor]
  );

  // Create particle system for ambient effects
  const createParticleSystem = useCallback(() => {
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 700;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 700;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 700;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.1 + 0.6, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(particles, particleMaterial);
  }, []);

  // Initialize Three.js scene with enhanced features
  const initScene = useCallback(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const container = containerRef.current;

    // Clear any existing content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Calculate canvas size accounting for padding
    const containerStyle = window.getComputedStyle(container);
    const paddingTop = parseFloat(containerStyle.paddingTop) || 120;
    const paddingBottom = parseFloat(containerStyle.paddingBottom) || 400;

    const width = container.clientWidth;
    const height = container.clientHeight + paddingTop + paddingBottom;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.Fog(0x000000, 400, 1200);
    sceneRef.current = scene;

    // Camera with better positioning
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 150, 700);
    cameraRef.current = camera;

    // Enhanced renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(100, 100, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x80deea, 0.8, 300);
    pointLight.position.set(-100, 100, -100);
    scene.add(pointLight);

    // Create main 3D object group
    const mainGroup = new THREE.Group();
    mainGroup.position.set(0, 250, 0);
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // Create dynamic 3D box frame based on zoom state
    const baseSize = isZoomedOut ? 175 : 350; // Half size when zoomed out
    const boxWidth = baseSize;
    const boxHeight = baseSize;
    const boxDepth = baseSize;

    // Main box frame
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const boxMaterial = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.08,
      wireframe: true,
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    mainGroup.add(box);

    // Add glowing edges
    const edges = new THREE.EdgesGeometry(boxGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.2,
    });
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    mainGroup.add(edgeLines);

    // Enhanced grid helpers
    const gridHelper1 = new THREE.GridHelper(boxWidth, 25, 0xcccccc, 0x2a2a2a);
    gridHelper1.position.y = -boxHeight / 2;
    gridHelper1.material.transparent = true;
    gridHelper1.material.opacity = 0.15;
    mainGroup.add(gridHelper1);

    const gridHelper2 = new THREE.GridHelper(boxHeight, 25, 0xcccccc, 0x2a2a2a);
    gridHelper2.rotation.x = Math.PI / 2;
    gridHelper2.position.z = -boxDepth / 2;
    gridHelper2.material.transparent = true;
    gridHelper2.material.opacity = 0.15;
    mainGroup.add(gridHelper2);

    const gridHelper3 = new THREE.GridHelper(boxDepth, 25, 0xcccccc, 0x2a2a2a);
    gridHelper3.rotation.z = Math.PI / 2;
    gridHelper3.position.x = -boxWidth / 2;
    gridHelper3.material.transparent = true;
    gridHelper3.material.opacity = 0.15;
    mainGroup.add(gridHelper3);

    // Create bubble group
    const bubbleGroup = new THREE.Group();
    mainGroup.add(bubbleGroup);
    bubbleGroupRef.current = bubbleGroup;

    // Create bubbles with enhanced features - adjusted for dynamic cube size
    filteredData.forEach((item) => {
      const bubbleSize = isZoomedOut ? item.size * 0.1 : item.size * 0.15;
      const geometry = new THREE.SphereGeometry(bubbleSize, 32, 32);
      const material = getBubbleMaterial(item.category, item.selected);

      const bubble = new THREE.Mesh(geometry, material);

      // Scale data to fit the larger box dimensions
      const dataScaleX = boxWidth / 2;
      const dataScaleY = boxHeight / 2;
      const dataScaleZ = boxDepth / 2;

      const x = ((item.x - 1500) / 1500) * dataScaleX;
      const y = ((item.y - 35) / 35) * dataScaleY;
      const z = ((item.z - 50) / 50) * dataScaleZ;

      bubble.position.set(x, y, z);
      bubble.userData = { data: item };
      bubble.castShadow = true;
      bubble.receiveShadow = true;

      // Add subtle random rotation
      bubble.rotation.x = Math.random() * Math.PI;
      bubble.rotation.y = Math.random() * Math.PI;

      // Ensure the material color is properly set with the category color
      if (material) {
        const categoryColor = getBubbleColor(item.category);
        material.color = categoryColor;
        material.needsUpdate = true;
      }

      // Add glow effect
      createGlowEffect(bubble, item.category);

      bubbleGroup.add(bubble);
    });

    // Add connection lines
    const connectionLines = createConnectionLines();
    mainGroup.add(connectionLines);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(1);
    axesHelper.position.set(-boxWidth / 2, -boxHeight / 2, -boxDepth / 2);
    axesHelper.scale.set(boxWidth, boxHeight, boxDepth);
    mainGroup.add(axesHelper);

    // Add particle system
    const particleSystem = createParticleSystem();
    scene.add(particleSystem);
    particleSystemRef.current = particleSystem;

    // Animation loop with enhanced effects
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate bubbles
      if (bubbleGroup) {
        bubbleGroup.children.forEach((bubble) => {
          const data = bubble.userData.data as ThreeDBubbleData;
          if (data.velocity) {
            // Update position with velocity
            bubble.position.x += data.velocity.x * animationSpeed;
            bubble.position.y += data.velocity.y * animationSpeed;
            bubble.position.z += data.velocity.z * animationSpeed;

            // Bounce off boundaries
            const bounds = boxWidth / 2 - data.size * 0.2;
            if (Math.abs(bubble.position.x) > bounds) data.velocity.x *= -1;
            if (Math.abs(bubble.position.y) > bounds) data.velocity.y *= -1;
            if (Math.abs(bubble.position.z) > bounds) data.velocity.z *= -1;

            // Pulse animation
            if (data.pulsePhase !== undefined) {
              data.pulsePhase += 0.05 * animationSpeed;

              // Update material for pulse effect (color only)
              if (bubble instanceof THREE.Mesh) {
                const material = bubble.material as THREE.MeshBasicMaterial;
                if (material) {
                  material.color = getBubbleColor(data.category);
                  material.needsUpdate = true;
                }
              }
            }

            // Rotation animation
            bubble.rotation.x += 0.01 * animationSpeed;
            bubble.rotation.y += 0.01 * animationSpeed;
          }
        });
      }

      // Animate particle system
      if (particleSystem && showParticles) {
        particleSystem.rotation.y += 0.001 * animationSpeed;
        const positions = particleSystem.geometry.attributes.position
          .array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] +=
            Math.sin(Date.now() * 0.001 + i) * 0.1 * animationSpeed;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
      }

      // Auto-rotate main group
      if (mainGroup && !controlsRef.current.isDragging) {
        mainGroup.rotation.y += 0.002 * animationSpeed;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Enhanced 3D drag controls
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dragPlane = new THREE.Plane();
    const dragPoint = new THREE.Vector3();

    const handleMouseDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(mainGroup.children, true);

      if (intersects.length > 0) {
        controlsRef.current.isDragging = true;
        controlsRef.current.previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };

        const intersectPoint = intersects[0].point;
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);

        dragPlane.setFromNormalAndCoplanarPoint(
          cameraDirection,
          intersectPoint
        );
        controlsRef.current.dragPlane = dragPlane;
        controlsRef.current.dragPoint = intersectPoint.clone();

        container.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (
        !controlsRef.current.isDragging ||
        !controlsRef.current.dragPlane ||
        !controlsRef.current.dragPoint
      )
        return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(controlsRef.current.dragPlane, dragPoint);

      if (dragPoint) {
        const dragVector = new THREE.Vector3().subVectors(
          dragPoint,
          controlsRef.current.dragPoint
        );

        // Add minimum movement threshold to prevent tiny movements
        const minMovement = 1.0; // Increased threshold
        if (
          Math.abs(dragVector.x) > minMovement ||
          Math.abs(dragVector.y) > minMovement
        ) {
          const rotationSpeed = 0.0008; // Much reduced sensitivity for smoother dragging
          const damping = 0.8; // Add damping for smoother movement

          mainGroup.rotation.x += dragVector.y * rotationSpeed * damping;
          mainGroup.rotation.y += dragVector.x * rotationSpeed * damping;
        }

        controlsRef.current.dragPoint.copy(dragPoint);
      }

      controlsRef.current.previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleMouseUp = () => {
      controlsRef.current.isDragging = false;
      controlsRef.current.dragPlane = null;
      controlsRef.current.dragPoint = null;
      container.style.cursor = "grab";
    };

    // Enhanced hover detection with selection
    const handleMouseMoveHover = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(bubbleGroup.children, true);

      if (intersects.length > 0) {
        const intersectedBubble = intersects[0].object;
        const bubbleData = intersectedBubble.userData.data;

        if (bubbleData && bubbleData.category) {
          setTooltip({
            x: event.clientX,
            y: event.clientY,
            data: bubbleData,
          });

          // Highlight hovered bubble
          if (intersectedBubble instanceof THREE.Mesh) {
            const material =
              intersectedBubble.material as THREE.MeshBasicMaterial;
            if (material) {
              // For MeshBasicMaterial, we can change opacity for highlighting
              material.opacity = 1.0;
              material.needsUpdate = true;
            }
          }
        }
      } else {
        setTooltip(null);
        // Reset all bubble materials
        bubbleGroup.children.forEach((bubble) => {
          if (bubble instanceof THREE.Mesh) {
            const material = bubble.material as THREE.MeshBasicMaterial;
            if (material) {
              // Reset opacity for MeshBasicMaterial
              material.opacity = 0.85;
              material.needsUpdate = true;
            }
          }
        });
      }
    };

    // Add event listeners
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMoveHover);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Cleanup function
    return () => {
      if (!isMountedRef.current) return;

      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener(
        "mousemove",
        handleMouseMoveHover
      );
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      // Safe cleanup of DOM elements
      if (
        container &&
        renderer.domElement &&
        container.contains(renderer.domElement)
      ) {
        container.removeChild(renderer.domElement);
      }

      // Dispose of Three.js resources
      if (renderer) {
        renderer.dispose();
      }

      // Clear scene references
      if (scene) {
        scene.clear();
      }
    };
  }, [
    filteredData,
    getBubbleColor,
    getBubbleMaterial,
    createParticleSystem,
    showParticles,
    animationSpeed,
    createGlowEffect,
    createConnectionLines,
  ]);

  // Initialize scene on mount
  useEffect(() => {
    if (!containerRef.current) return;

    isMountedRef.current = true;
    const cleanup = initScene();

    return () => {
      isMountedRef.current = false;
      if (cleanup) {
        cleanup();
      }
    };
  }, [initScene]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current)
        return;

      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset rotation
  const handleResetRotation = () => {
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.set(0, 0, 0);
    }
    setSelectedCategory(null);
  };

  // Toggle fullscreen
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(threeDData.map((d) => d.category)));
  }, [threeDData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredData.length;
    const avgSize = filteredData.reduce((sum, d) => sum + d.size, 0) / total;
    const avgGrowth = filteredData.reduce((sum, d) => sum + d.y, 0) / total;
    const avgMarketCap = filteredData.reduce((sum, d) => sum + d.x, 0) / total;

    return {
      total,
      avgSize: Math.round(avgSize),
      avgGrowth: Math.round(avgGrowth),
      avgMarketCap: Math.round(avgMarketCap),
    };
  }, [filteredData]);

  return (
    <WidgetBase
      className={`flex flex-col w-full ${isMobile ? "bubble-chart-widget" : ""}`}
      style={{
        width: "100%",
        height: isMobile ? "82vh" : undefined,
        padding: isMobile ? 0 : undefined,
        borderRadius: isMobile ? 0 : undefined,
      }}
      onOpenSidebar={onOpenSidebar}
      showSidebarButton={showSidebarButton}
    >
      <div
        className="w-full h-full flex flex-col"
        style={{
          padding: isMobile ? "0 1rem 1rem 1rem" : "1.5rem",
          width: "100%",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <WidgetTitle
              title={title}
              subtitle={subtitle}
              variant={isMobile ? "centered" : "default"}
              size="md"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowParticles(!showParticles)}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: showParticles
                  ? "var(--accent-color)"
                  : "var(--button-bg)",
                color: "var(--secondary-text)",
              }}
              title="Toggle Particles"
            >
              <Zap className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetRotation}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--secondary-text)",
              }}
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--secondary-text)",
              }}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                !selectedCategory ? "text-white" : "text-gray-700"
              }`}
              style={{
                backgroundColor: !selectedCategory ? "#4ECDC4" : "#f3f4f6",
                border: !selectedCategory
                  ? "1px solid #4ECDC4"
                  : "1px solid #e5e7eb",
              }}
            >
              All Categories
            </button>
            {categories.map((category) => {
              const categoryColor = getBubbleColor(category).getHexString();
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === category
                        ? `#${categoryColor}`
                        : "#f8f9fa",
                    border: `1px solid #${categoryColor}`,
                    opacity: selectedCategory === category ? 1 : 0.9,
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Speed:</span>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-sm font-mono">
                {animationSpeed.toFixed(1)}x
              </span>
            </div>

            <button
              onClick={() => setIsZoomedOut(!isZoomedOut)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                isZoomedOut
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {isZoomedOut ? "Zoom In" : "Zoom Out"}
            </button>
          </div>
        </div>

        {/* Combined Metrics & 3D Coordinates */}
        <div className="mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg overflow-hidden">
            {/* Colorful Header */}
            <div className="bg-gradient-to-r from-pink-200 via-cyan-200 to-blue-200 px-4 py-2 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-800 text-sm font-semibold">
                    Metrics & Coordinates
                  </span>
                </div>
                <div className="text-gray-600 text-xs">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-3">
              {/* Combined Metrics & 3D Coordinates Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Total Bubbles - Subtle Pink */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-2 border border-gray-200/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-sm">
                      <svg
                        className="w-1.5 h-1.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div className="text-xs text-gray-700 font-bold bg-gray-100/60 px-1.5 py-0.5 rounded-md">
                      TOTAL
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-800 mb-1">
                    {stats.total}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Data Points
                  </div>
                  <div className="mt-1.5 h-1 bg-gray-200/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((stats.total / 50) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Average Size - Subtle Gray */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-2 border border-gray-200/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-sm">
                      <svg
                        className="w-1.5 h-1.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-xs text-gray-700 font-bold bg-gray-100/60 px-1.5 py-0.5 rounded-md">
                      SIZE
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-800 mb-1">
                    {stats.avgSize}K
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Employees
                  </div>
                  <div className="mt-1.5 h-1 bg-gray-200/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((stats.avgSize / 100) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Average Growth - Subtle Gray */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-2 border border-gray-200/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-sm">
                      <svg
                        className="w-1.5 h-1.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div className="text-xs text-gray-700 font-bold bg-gray-100/60 px-1.5 py-0.5 rounded-md">
                      GROWTH
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-800 mb-1">
                    {stats.avgGrowth}%
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Annual
                  </div>
                  <div className="mt-1.5 h-1 bg-gray-200/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((stats.avgGrowth / 70) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Average Market Cap - Subtle Gray */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-2 border border-gray-200/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-sm">
                      <svg
                        className="w-1.5 h-1.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <div className="text-xs text-gray-700 font-bold bg-gray-100/60 px-1.5 py-0.5 rounded-md">
                      VALUE
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-800 mb-1">
                    ${stats.avgMarketCap}B
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    Market Cap
                  </div>
                  <div className="mt-1.5 h-1 bg-gray-200/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((stats.avgMarketCap / 2000) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* X-Axis - Subtle Gray */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-sm p-1 border border-gray-200/40 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="w-2.5 h-2.5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-sm flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">
                        X
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-700 font-bold bg-gray-100/60 px-1 py-0.5 rounded-sm">
                      X-AXIS
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div>
                      <div className="text-[10px] font-bold text-gray-800">
                        Market Cap
                      </div>
                      <div className="text-[10px] text-gray-600">0-3000B</div>
                    </div>
                    <div className="h-0.5 bg-gray-200/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-500"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Y-Axis - Subtle Gray */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-sm p-1 border border-gray-200/40 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="w-2.5 h-2.5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-sm flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">
                        Y
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-700 font-bold bg-gray-100/60 px-1 py-0.5 rounded-sm">
                      Y-AXIS
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div>
                      <div className="text-[10px] font-bold text-gray-800">
                        Growth Rate
                      </div>
                      <div className="text-[10px] text-gray-600">0-70%</div>
                    </div>
                    <div className="h-0.5 bg-gray-200/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-500"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Z-Axis - Subtle Gray */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-sm p-1 border border-gray-200/40 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="w-2.5 h-2.5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-sm flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">
                        Z
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-700 font-bold bg-gray-100/60 px-1 py-0.5 rounded-sm">
                      Z-AXIS
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div>
                      <div className="text-[10px] font-bold text-gray-800">
                        Depth
                      </div>
                      <div className="text-[10px] text-gray-600">0-100</div>
                    </div>
                    <div className="h-0.5 bg-gray-200/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-500"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative w-full"
          style={{
            width: "100%",
            height: isMobile ? "80vh" : isFullscreen ? "95vh" : "1200px",
            maxWidth: "none",
            maxHeight: isFullscreen ? "100%" : "1400px",
            margin: "0",
            borderRadius: "12px",
            overflow: "visible",
            background: "transparent",
            padding: "80px 80px 300px 80px",
          }}
        >
          <div
            ref={containerRef}
            style={{
              width: "100%",
              height: "100%",
              cursor: "grab",
              margin: "10px",
            }}
          />

          {tooltip && tooltip.data && (
            <div
              style={{
                position: "absolute",
                left: tooltip.x + 10,
                top: tooltip.y - 10,
                background: "var(--button-bg)",
                color: "var(--primary-text)",
                borderRadius: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                padding: "16px 20px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: 14,
                pointerEvents: "none",
                zIndex: 10,
                minWidth: 250,
                border: `3px solid #${getBubbleColor(tooltip.data.category).getHexString()}`,
                backgroundColor: `#${getBubbleColor(tooltip.data.category).getHexString()}20`,
                transform: "translate(-50%, -100%)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 20,
                    height: 20,
                    background: `#${getBubbleColor(
                      tooltip.data.category
                    ).getHexString()}`,
                    borderRadius: "50%",
                    marginRight: 8,
                    boxShadow: `0 0 10px #${getBubbleColor(tooltip.data.category).getHexString()}`,
                  }}
                />
                <span style={{ fontSize: 16, fontWeight: 800 }}>
                  {tooltip.data.label || tooltip.data.category}
                </span>
              </div>
              <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
                💰 Market Cap: ${tooltip.data.x}B
              </div>
              <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
                📈 Growth: {tooltip.data.y}%
              </div>
              <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
                👥 Employees: {tooltip.data.size}K
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--secondary-text)",
                }}
              >
                🎯 XYZ: ({Math.round(tooltip.data.x)},{" "}
                {Math.round(tooltip.data.y)}, {Math.round(tooltip.data.z)})
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Legend */}
        <div className="mt-4 flex justify-center">
          <div className="flex gap-4 flex-wrap justify-center">
            {categories.map((category) => {
              const categoryColor = getBubbleColor(category).getHexString();
              return (
                <div key={category} className="flex items-center gap-2">
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: `#${categoryColor}`,
                      boxShadow: `0 0 8px #${categoryColor}`,
                      border: `2px solid #${categoryColor}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      color: "var(--primary-text)",
                    }}
                  >
                    {category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      {currentSlide !== undefined && setCurrentSlide && (
        <SlideNavigation
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          totalSlides={17}
        />
      )}
    </WidgetBase>
  );
}
