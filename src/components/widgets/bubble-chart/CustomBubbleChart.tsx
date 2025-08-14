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
  }>({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    dragPlane: null,
    dragPoint: null,
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

  // Enhanced color mapping with gradients
  const getBubbleColor = useCallback(
    (category: string, intensity: number = 1) => {
      const categoryColorMap: Record<string, string> = {
        "Big Tech": "#FF6B9D", // Vibrant pink
        "AI & Cloud": "#4ECDC4", // Bright turquoise
        Fintech: "#45B7D1", // Ocean blue
        "Emerging Tech": "#96CEB4", // Mint green
        Healthcare: "#FFA726", // Orange
        Energy: "#AB47BC", // Purple
      };
      const baseColor = categoryColorMap[category] || "#FF6B9D";

      // Create gradient effect based on intensity
      const color = new THREE.Color(baseColor);
      color.multiplyScalar(intensity);
      return color;
    },
    []
  );

  // Enhanced bubble material with better effects
  const getBubbleMaterial = useCallback(
    (
      category: string,
      isSelected: boolean = false,
      pulseIntensity: number = 1
    ) => {
      const baseColor = getBubbleColor(category, pulseIntensity);
      return new THREE.MeshPhongMaterial({
        color: baseColor,
        transparent: true,
        opacity: isSelected ? 0.9 : 0.8,
        shininess: isSelected ? 100 : 50,
        specular: isSelected ? 0x666666 : 0x333333,
        emissive: new THREE.Color(isSelected ? 0x444444 : 0x222222),
      });
    },
    [getBubbleColor]
  );

  // Create connection lines between nearby bubbles
  const createConnectionLines = useCallback(() => {
    const lines = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4ecdc4,
      transparent: true,
      opacity: 0.3,
    });

    // Create connections between bubbles of the same category
    const categoryGroups: { [key: string]: THREE.Vector3[] } = {};

    filteredData.forEach((item) => {
      if (!categoryGroups[item.category]) {
        categoryGroups[item.category] = [];
      }
      const dataScaleX = 400 / 2;
      const dataScaleY = 400 / 2;
      const dataScaleZ = 400 / 2;

      const x = ((item.x - 1500) / 1500) * dataScaleX;
      const y = ((item.y - 35) / 35) * dataScaleY;
      const z = ((item.z - 50) / 50) * dataScaleZ;

      categoryGroups[item.category].push(new THREE.Vector3(x, y, z));
    });

    // Create lines between bubbles in the same category
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
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

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

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.Fog(0x000000, 100, 500);
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4ecdc4, 0.5, 300);
    pointLight.position.set(-100, 100, -100);
    scene.add(pointLight);

    // Create main 3D object group
    const mainGroup = new THREE.Group();
    mainGroup.position.set(0, 100, 0);
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // Create larger and more interesting 3D box frame
    const boxWidth = 400;
    const boxHeight = 400;
    const boxDepth = 400;

    // Main box frame
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const boxMaterial = new THREE.MeshBasicMaterial({
      color: 0x4ecdc4,
      transparent: true,
      opacity: 0.1,
      wireframe: true,
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    mainGroup.add(box);

    // Add glowing edges
    const edges = new THREE.EdgesGeometry(boxGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x4ecdc4,
      transparent: true,
      opacity: 0.3,
    });
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    mainGroup.add(edgeLines);

    // Enhanced grid helpers
    const gridHelper1 = new THREE.GridHelper(boxWidth, 25, 0x4ecdc4, 0x2a2a2a);
    gridHelper1.position.y = -boxHeight / 2;
    gridHelper1.material.transparent = true;
    gridHelper1.material.opacity = 0.3;
    mainGroup.add(gridHelper1);

    const gridHelper2 = new THREE.GridHelper(boxHeight, 25, 0x4ecdc4, 0x2a2a2a);
    gridHelper2.rotation.x = Math.PI / 2;
    gridHelper2.position.z = -boxDepth / 2;
    gridHelper2.material.transparent = true;
    gridHelper2.material.opacity = 0.3;
    mainGroup.add(gridHelper2);

    const gridHelper3 = new THREE.GridHelper(boxDepth, 25, 0x4ecdc4, 0x2a2a2a);
    gridHelper3.rotation.z = Math.PI / 2;
    gridHelper3.position.x = -boxWidth / 2;
    gridHelper3.material.transparent = true;
    gridHelper3.material.opacity = 0.3;
    mainGroup.add(gridHelper3);

    // Create bubble group
    const bubbleGroup = new THREE.Group();
    mainGroup.add(bubbleGroup);
    bubbleGroupRef.current = bubbleGroup;

    // Create bubbles with enhanced features
    filteredData.forEach((item) => {
      const geometry = new THREE.SphereGeometry(item.size * 0.2, 32, 32);
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
              const pulseIntensity = 0.8 + 0.2 * Math.sin(data.pulsePhase);

              // Update material for pulse effect (color only)
              if (bubble instanceof THREE.Mesh) {
                const material = bubble.material as THREE.MeshPhongMaterial;
                if (material) {
                  material.color = getBubbleColor(
                    data.category,
                    pulseIntensity
                  );
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

        const rotationSpeed = 0.01;
        mainGroup.rotation.x += dragVector.y * rotationSpeed;
        mainGroup.rotation.y += dragVector.x * rotationSpeed;

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
              intersectedBubble.material as THREE.MeshPhongMaterial;
            if (material && material.emissive) {
              material.emissive.setHex(0x333333);
            }
          }
        }
      } else {
        setTooltip(null);
        // Reset all bubble materials
        bubbleGroup.children.forEach((bubble) => {
          if (bubble instanceof THREE.Mesh) {
            const material = bubble.material as THREE.MeshPhongMaterial;
            if (material && material.emissive) {
              material.emissive.setHex(0x111111);
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
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                !selectedCategory ? "text-white" : "bg-gray-200 text-gray-700"
              }`}
              style={{
                backgroundColor: !selectedCategory ? "#4ECDC4" : undefined,
              }}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category ? "text-white" : "text-white"
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === category
                      ? getBubbleColor(category).getHexString()
                      : getBubbleColor(category).getHexString(),
                  opacity: selectedCategory === category ? 1 : 0.7,
                }}
              >
                {category}
              </button>
            ))}
          </div>

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
        </div>

        {/* Enhanced Statistics with Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg text-center border border-blue-200 dark:border-blue-700">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Total Bubbles
            </div>
            <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
              Active Data Points
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg text-center border border-green-200 dark:border-green-700">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              {stats.avgSize}K
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 font-medium">
              Avg Size
            </div>
            <div className="text-xs text-green-500 dark:text-green-400 mt-1">
              Employee Count
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg text-center border border-purple-200 dark:border-purple-700">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {stats.avgGrowth}%
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
              Avg Growth
            </div>
            <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">
              Annual Rate
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 p-4 rounded-lg text-center border border-orange-200 dark:border-orange-700">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              ${stats.avgMarketCap}B
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">
              Avg Market Cap
            </div>
            <div className="text-xs text-orange-500 dark:text-orange-400 mt-1">
              Valuation
            </div>
          </div>
        </div>

        {/* 3D Coordinate System Info */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📊 3D Coordinate System
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">X-Axis:</span> Market Cap (0-3000B)
            </div>
            <div>
              <span className="font-medium">Y-Axis:</span> Growth Rate (0-70%)
            </div>
            <div>
              <span className="font-medium">Z-Axis:</span> Depth (0-100)
            </div>
          </div>
        </div>

        <div
          className="relative w-full"
          style={{
            width: "100%",
            height: isMobile ? "45vh" : isFullscreen ? "75vh" : "500px",
            maxWidth: "none",
            maxHeight: isFullscreen ? "100%" : "550px",
            margin: "0",
            borderRadius: "12px",
            overflow: "hidden",
            background: "transparent",
            padding: "20px 20px 40px 20px",
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
                border: `3px solid ${getBubbleColor(tooltip.data.category).getHexString()}`,
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
                    background: getBubbleColor(
                      tooltip.data.category
                    ).getHexString(),
                    borderRadius: "50%",
                    marginRight: 8,
                    boxShadow: `0 0 10px ${getBubbleColor(tooltip.data.category).getHexString()}`,
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
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-2">
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: getBubbleColor(category).getHexString(),
                    boxShadow: `0 0 8px ${getBubbleColor(category).getHexString()}`,
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
            ))}
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
