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
import { RotateCcw, Maximize2, Minimize2 } from "lucide-react";

interface CustomBubbleChartProps {
  data: WidgetBubbleChartData[];
  isMobile?: boolean;
  currentSlide?: number;
  setCurrentSlide?: (slide: number) => void;
}

interface ThreeDBubbleData extends WidgetBubbleChartData {
  z: number;
}

export default function CustomBubbleChart({
  data,
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

  // Convert 2D data to 3D by adding z-coordinate
  const threeDData: ThreeDBubbleData[] = useMemo(() => {
    // Generate more data points for better visualization
    const enhancedData = [];

    // Original data points
    data.forEach((item) => {
      enhancedData.push({
        ...item,
        z: Math.random() * 100, // Random z-coordinate for 3D effect
      });
    });

    // Add additional data points for better density
    const categories = ["Big Tech", "AI & Cloud", "Fintech", "Emerging Tech"];
    for (let i = 0; i < 20; i++) {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      enhancedData.push({
        x: Math.random() * 3000, // Market cap 0-3000B
        y: Math.random() * 70, // Growth rate 0-70%
        z: Math.random() * 100, // Depth 0-100
        size: Math.random() * 50 + 10, // Size 10-60
        category: category,
        label: `${category} Company ${i + 1}`,
      });
    }

    return enhancedData;
  }, [data]);

  // Color mapping with better colors
  const getBubbleColor = useCallback((category: string) => {
    const categoryColorMap: Record<string, string> = {
      "Big Tech": "#FF6B9D", // Vibrant pink
      "AI & Cloud": "#4ECDC4", // Bright turquoise
      Fintech: "#45B7D1", // Ocean blue
      "Emerging Tech": "#96CEB4", // Mint green
    };
    return categoryColorMap[category] || "#FF6B9D";
  }, []);

  // Get bubble material with better styling - more "smoosh"
  const getBubbleMaterial = useCallback(
    (category: string) => {
      const baseColor = getBubbleColor(category);
      return new THREE.MeshPhongMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.7, // More transparent for softer look
        shininess: 30, // Less shiny for softer appearance
        specular: 0x222222, // Softer specular highlights
        emissive: 0x111111, // Subtle glow
      });
    },
    [getBubbleColor]
  );

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 250); // Moved camera back for better view of centered box
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting - softer lighting like Highcharts
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    // Create main 3D object group that will be rotated - centered at origin
    const mainGroup = new THREE.Group();
    mainGroup.position.set(0, 0, 0); // Ensure it's centered
    scene.add(mainGroup);

    // Create 3D box frame like Highcharts - optimized dimensions
    const boxWidth = 150; // Optimized width
    const boxHeight = 150; // Optimized height
    const boxDepth = 150; // Optimized depth
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const boxMaterial = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.1,
      wireframe: true,
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    mainGroup.add(box);

    // Add grid helpers for each face - adjusted for optimized box
    const gridHelper1 = new THREE.GridHelper(boxWidth, 20, 0xcccccc, 0xcccccc); // Adjusted divisions for bottom
    gridHelper1.position.y = -boxHeight / 2;
    mainGroup.add(gridHelper1);

    const gridHelper2 = new THREE.GridHelper(boxHeight, 20, 0xcccccc, 0xcccccc); // Adjusted divisions for back
    gridHelper2.rotation.x = Math.PI / 2;
    gridHelper2.position.z = -boxDepth / 2;
    mainGroup.add(gridHelper2);

    const gridHelper3 = new THREE.GridHelper(boxDepth, 20, 0xcccccc, 0xcccccc); // Adjusted divisions for side
    gridHelper3.rotation.z = Math.PI / 2;
    gridHelper3.position.x = -boxWidth / 2;
    mainGroup.add(gridHelper3);

    // Create bubbles - smaller size
    const bubbleGroup = new THREE.Group();

    threeDData.forEach((item, index) => {
      const geometry = new THREE.SphereGeometry(item.size * 0.15, 24, 24); // Higher quality spheres for smoother look
      const material = getBubbleMaterial(item.category);

      const bubble = new THREE.Mesh(geometry, material);

      // Scale data to fit the new optimized box dimensions
      const dataScaleX = boxWidth / 2;
      const dataScaleY = boxHeight / 2;
      const dataScaleZ = boxDepth / 2;

      const x = ((item.x - 1500) / 1500) * dataScaleX; // Market cap scaled to optimized box
      const y = ((item.y - 35) / 35) * dataScaleY; // Growth rate scaled
      const z = ((item.z - 50) / 50) * dataScaleZ; // Depth scaled

      bubble.position.set(x, y, z);
      bubble.userData = { index, data: item };
      bubble.castShadow = true;
      bubble.receiveShadow = true;

      // Add subtle random rotation for more organic look
      bubble.rotation.x = Math.random() * Math.PI;
      bubble.rotation.y = Math.random() * Math.PI;

      bubbleGroup.add(bubble);
    });

    mainGroup.add(bubbleGroup);

    // Add axes helper - positioned at the corner where grid planes intersect
    // Each axis matches the length of its corresponding box side
    const axesHelper = new THREE.AxesHelper(1); // Start with unit length
    // Position axes at the bottom-left-back corner where grid planes meet
    axesHelper.position.set(-boxWidth / 2, -boxHeight / 2, -boxDepth / 2);

    // Scale each axis to match its corresponding box dimension
    axesHelper.scale.set(boxWidth, boxHeight, boxDepth);

    mainGroup.add(axesHelper);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Advanced 3D drag controls
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dragPlane = new THREE.Plane();
    const dragPoint = new THREE.Vector3();

    const handleMouseDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check if we're clicking on the box or any object in the main group
      const intersects = raycaster.intersectObjects(mainGroup.children, true);

      if (intersects.length > 0) {
        controlsRef.current.isDragging = true;
        controlsRef.current.previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };

        // Create a drag plane perpendicular to the camera view
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

      // Find intersection with drag plane
      raycaster.ray.intersectPlane(controlsRef.current.dragPlane, dragPoint);

      if (dragPoint) {
        // Calculate the rotation based on the drag movement
        const dragVector = new THREE.Vector3().subVectors(
          dragPoint,
          controlsRef.current.dragPoint
        );

        // Apply rotation to the main group
        const rotationSpeed = 0.01;
        mainGroup.rotation.x += dragVector.y * rotationSpeed;
        mainGroup.rotation.y += dragVector.x * rotationSpeed;

        // Update the drag point
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

    // Separate hover detection for tooltips - runs independently of dragging
    const handleMouseMoveHover = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Only check for bubble intersections, not the entire main group
      const intersects = raycaster.intersectObjects(bubbleGroup.children, true);

      if (intersects.length > 0) {
        const intersectedBubble = intersects[0].object;
        console.log("Hovering over bubble:", intersectedBubble.userData.data);

        // Update tooltip position using mouse position instead of 3D projection
        setTooltip({
          x: event.clientX,
          y: event.clientY,
          data: intersectedBubble.userData.data,
        });
      } else {
        setTooltip(null);
      }
    };

    // Add event listeners
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMoveHover);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Cleanup function
    return () => {
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener(
        "mousemove",
        handleMouseMoveHover
      );
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [threeDData, getBubbleColor]);

  // Initialize scene on mount
  useEffect(() => {
    const cleanup = initScene();
    return cleanup;
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
    if (controlsRef.current) {
      controlsRef.current.rotation = { x: 0, y: 0, z: 0 };
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 0, 250); // Reset to centered position
        cameraRef.current.lookAt(0, 0, 0); // Look at center
      }
    }
  };

  // Toggle fullscreen
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

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
              title="Draggable 3D Bubble Chart"
              subtitle="Click and drag the plot area to rotate in space"
              variant={isMobile ? "centered" : "default"}
              size="md"
            />
          </div>
          <div className="flex gap-2">
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

        <div
          className="relative w-full"
          style={{
            width: "100%",
            height: isMobile ? "35vh" : isFullscreen ? "70vh" : "350px",
            maxWidth: "none",
            maxHeight: isFullscreen ? "100%" : "400px",
            margin: "0",
            borderRadius: "12px",
            overflow: "hidden",
            background: "transparent",
          }}
        >
          <div
            ref={containerRef}
            style={{
              width: "100%",
              height: "100%",
              cursor: "grab",
            }}
          />

          {tooltip && (
            <div
              style={{
                position: "absolute",
                left: tooltip.x + 10,
                top: tooltip.y - 10,
                background: "var(--button-bg)",
                color: "var(--primary-text)",
                borderRadius: 12,
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                padding: "12px 18px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: 14,
                pointerEvents: "none",
                zIndex: 10,
                minWidth: 200,
                border: `2px solid ${getBubbleColor(tooltip.data.category)}`,
                transform: "translate(-50%, -100%)", // Center horizontally and position above cursor
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    background: getBubbleColor(tooltip.data.category),
                    borderRadius: "50%",
                    marginRight: 8,
                  }}
                />
                <span>{tooltip.data.label || tooltip.data.category}</span>
              </div>
              <div style={{ marginTop: 8, fontWeight: 500, fontSize: 13 }}>
                Market Cap: ${tooltip.data.x}B | Growth: {tooltip.data.y}%
              </div>
              <div style={{ marginTop: 4, fontWeight: 500, fontSize: 13 }}>
                Employees: {tooltip.data.size}K | Depth:{" "}
                {Math.round(tooltip.data.z)}
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontWeight: 500,
                  fontSize: 13,
                  color: "var(--secondary-text)",
                }}
              >
                XYZ: ({Math.round(tooltip.data.x)}, {Math.round(tooltip.data.y)}
                , {Math.round(tooltip.data.z)})
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center">
          <div className="flex gap-4 flex-wrap justify-center">
            {Array.from(new Set(data.map((d) => d.category))).map(
              (category) => (
                <div key={category} className="flex items-center gap-2">
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: getBubbleColor(category),
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      color: "var(--primary-text)",
                    }}
                  >
                    {category}
                  </span>
                </div>
              )
            )}
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
