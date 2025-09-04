"use client";

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as THREE from "three";
import type {
  BubbleSceneCanvasProps,
  BubbleSceneHandle,
  BubblePoint3D,
} from "@/interfaces/charts";

export default React.forwardRef<BubbleSceneHandle, BubbleSceneCanvasProps>(
  function BubbleSceneCanvas(
    {
      data,
      isZoomedOut,
      showParticles,
      animationSpeed,
      onHover,
      getCategoryColor,
    }: BubbleSceneCanvasProps,
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const mainGroupRef = useRef<THREE.Group | null>(null);
    const bubbleGroupRef = useRef<THREE.Group | null>(null);
    const particleSystemRef = useRef<THREE.Points | null>(null);
    const linesGroupRef = useRef<THREE.Group | null>(null);
    const connectionPairsRef = useRef<
      Array<{ a: THREE.Mesh; b: THREE.Mesh; line: THREE.Line }>
    >([]);
    const lastTimeRef = useRef<number | null>(null);
    const isMountedRef = useRef(true);
    const controlsRef = useRef({
      isDragging: false,
      dragPlane: null as THREE.Plane | null,
      dragPoint: null as THREE.Vector3 | null,
    });

    useImperativeHandle(ref, () => ({
      resetRotation: () => {
        if (mainGroupRef.current) mainGroupRef.current.rotation.set(0, 0, 0);
      },
    }));

    const getColor = useCallback(
      (category: string) => new THREE.Color(getCategoryColor(category)),
      [getCategoryColor]
    );

    // Deprecated static builder left removed in favor of dynamic updating connections

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
      particles.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
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

    const initScene = useCallback(() => {
      if (!containerRef.current || typeof window === "undefined") return;
      const container = containerRef.current;
      while (container.firstChild) container.removeChild(container.firstChild);
      const containerStyle = window.getComputedStyle(container);
      const paddingTop = parseFloat(containerStyle.paddingTop) || 120;
      const paddingBottom = parseFloat(containerStyle.paddingBottom) || 400;
      const width = container.clientWidth;
      const height = container.clientHeight + paddingTop + paddingBottom;
      const scene = new THREE.Scene();
      scene.background = null;
      scene.fog = new THREE.Fog(0x000000, 400, 1200);
      sceneRef.current = scene;
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 150, 700);
      cameraRef.current = camera;
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
      scene.add(new THREE.AmbientLight(0x404040, 0.8));
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(100, 100, 100);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);
      const pointLight = new THREE.PointLight(0x80deea, 0.8, 300);
      pointLight.position.set(-100, 100, -100);
      scene.add(pointLight);
      const mainGroup = new THREE.Group();
      mainGroup.position.set(0, 250, 0);
      scene.add(mainGroup);
      mainGroupRef.current = mainGroup;
      const baseSize = isZoomedOut ? 175 : 350;
      const boxGeometry = new THREE.BoxGeometry(baseSize, baseSize, baseSize);
      const boxMaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.08,
        wireframe: true,
      });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      mainGroup.add(box);
      const edges = new THREE.EdgesGeometry(boxGeometry);
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.2,
      });
      mainGroup.add(new THREE.LineSegments(edges, edgeMaterial));
      const gridHelper1 = new THREE.GridHelper(
        baseSize,
        25,
        0xcccccc,
        0x2a2a2a
      );
      gridHelper1.position.y = -baseSize / 2;
      (gridHelper1.material as THREE.Material).transparent = true;
      (gridHelper1.material as THREE.Material & { opacity: number }).opacity =
        0.15;
      mainGroup.add(gridHelper1);
      const gridHelper2 = new THREE.GridHelper(
        baseSize,
        25,
        0xcccccc,
        0x2a2a2a
      );
      gridHelper2.rotation.x = Math.PI / 2;
      gridHelper2.position.z = -baseSize / 2;
      (gridHelper2.material as THREE.Material).transparent = true;
      (gridHelper2.material as THREE.Material & { opacity: number }).opacity =
        0.15;
      mainGroup.add(gridHelper2);
      const gridHelper3 = new THREE.GridHelper(
        baseSize,
        25,
        0xcccccc,
        0x2a2a2a
      );
      gridHelper3.rotation.z = Math.PI / 2;
      gridHelper3.position.x = -baseSize / 2;
      (gridHelper3.material as THREE.Material).transparent = true;
      (gridHelper3.material as THREE.Material & { opacity: number }).opacity =
        0.15;
      mainGroup.add(gridHelper3);
      const bubbleGroup = new THREE.Group();
      mainGroup.add(bubbleGroup);
      bubbleGroupRef.current = bubbleGroup;
      data.forEach((item) => {
        const bubbleSize = isZoomedOut ? item.size * 0.1 : item.size * 0.15;
        const geometry = new THREE.SphereGeometry(bubbleSize, 32, 32);
        const material = new THREE.MeshBasicMaterial({
          color: getColor(item.category),
          transparent: true,
          opacity: 0.85,
        });
        const bubble = new THREE.Mesh(geometry, material);
        const dataScale = baseSize / 2;
        const x = ((item.x - 1500) / 1500) * dataScale;
        const y = ((item.y - 35) / 35) * dataScale;
        const z = ((item.z - 50) / 50) * dataScale;
        bubble.position.set(x, y, z);
        bubble.userData = {
          data: item,
          velocity: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02,
          },
          pulsePhase: Math.random() * Math.PI * 2,
        };
        bubble.rotation.x = Math.random() * Math.PI;
        bubble.rotation.y = Math.random() * Math.PI;
        bubbleGroup.add(bubble);
      });
      // Build initial lines group and store pairs for dynamic updates
      const linesGroup = new THREE.Group();
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.4,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        linewidth: 2,
      });

      const meshes = bubbleGroup.children.filter(
        (c): c is THREE.Mesh => c instanceof THREE.Mesh
      );
      const maxDistance = 100;
      for (let i = 0; i < meshes.length; i++) {
        for (let j = i + 1; j < meshes.length; j++) {
          const d = meshes[i].position.distanceTo(meshes[j].position);
          if (d < maxDistance) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(6);
            geometry.setAttribute(
              "position",
              new THREE.BufferAttribute(positions, 3)
            );
            const line = new THREE.Line(geometry, lineMaterial);
            linesGroup.add(line);
            connectionPairsRef.current.push({
              a: meshes[i],
              b: meshes[j],
              line,
            });
          }
        }
      }
      // Category-adjacent connections
      const categoryToMeshes: Record<string, THREE.Mesh[]> = {};
      data.forEach((p, idx) => {
        const m = meshes[idx];
        if (!m) return;
        if (!categoryToMeshes[p.category]) categoryToMeshes[p.category] = [];
        categoryToMeshes[p.category].push(m);
      });
      Object.values(categoryToMeshes).forEach((arr) => {
        for (let i = 0; i < arr.length - 1; i++) {
          const geometry = new THREE.BufferGeometry();
          const positions = new Float32Array(6);
          geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
          );
          const line = new THREE.Line(geometry, lineMaterial);
          linesGroup.add(line);
          connectionPairsRef.current.push({ a: arr[i], b: arr[i + 1], line });
        }
      });

      mainGroup.add(linesGroup);
      linesGroupRef.current = linesGroup;
      const axesHelper = new THREE.AxesHelper(1);
      axesHelper.position.set(-baseSize / 2, -baseSize / 2, -baseSize / 2);
      axesHelper.scale.set(baseSize, baseSize, baseSize);
      mainGroup.add(axesHelper);
      const particleSystem = createParticleSystem();
      scene.add(particleSystem);
      particleSystemRef.current = particleSystem;

      const animate = () => {
        requestAnimationFrame(animate);
        const now = performance.now();
        const dt =
          lastTimeRef.current === null ? 0 : (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;
        const frameScale = dt * 60; // keep existing tuning comparable to ~60fps
        if (bubbleGroupRef.current) {
          bubbleGroupRef.current.children.forEach((child) => {
            const bubble = child as THREE.Mesh;
            const ud = bubble.userData as {
              data: BubblePoint3D;
              velocity?: { x: number; y: number; z: number };
              pulsePhase?: number;
            };
            if (ud.velocity) {
              bubble.position.x += ud.velocity.x * animationSpeed * frameScale;
              bubble.position.y += ud.velocity.y * animationSpeed * frameScale;
              bubble.position.z += ud.velocity.z * animationSpeed * frameScale;
              const bounds =
                baseSize / 2 - ud.data.size * (isZoomedOut ? 0.1 : 0.15) * 0.2;
              if (Math.abs(bubble.position.x) > bounds) ud.velocity.x *= -1;
              if (Math.abs(bubble.position.y) > bounds) ud.velocity.y *= -1;
              if (Math.abs(bubble.position.z) > bounds) ud.velocity.z *= -1;
              if (ud.pulsePhase !== undefined) {
                ud.pulsePhase += 0.05 * animationSpeed * frameScale;
                const mat = (bubble as THREE.Mesh)
                  .material as THREE.MeshBasicMaterial;
                if (mat) {
                  mat.color = getColor(ud.data.category);
                  mat.needsUpdate = true;
                }
              }
              bubble.rotation.x += 0.01 * animationSpeed * frameScale;
              bubble.rotation.y += 0.01 * animationSpeed * frameScale;
            }
          });
        }
        // Update dynamic line positions to follow bubbles
        if (connectionPairsRef.current.length) {
          for (const pair of connectionPairsRef.current) {
            const attr = (
              pair.line.geometry as THREE.BufferGeometry
            ).getAttribute("position") as THREE.BufferAttribute;
            attr.setXYZ(
              0,
              pair.a.position.x,
              pair.a.position.y,
              pair.a.position.z
            );
            attr.setXYZ(
              1,
              pair.b.position.x,
              pair.b.position.y,
              pair.b.position.z
            );
            attr.needsUpdate = true;
          }
        }

        if (particleSystemRef.current && showParticles) {
          particleSystemRef.current.rotation.y += 0.001 * animationSpeed;
          const positions = particleSystemRef.current.geometry.attributes
            .position.array as Float32Array;
          for (let i = 0; i < positions.length; i += 3)
            positions[i + 1] +=
              Math.sin(Date.now() * 0.001 + i) * 0.1 * animationSpeed;
          particleSystemRef.current.geometry.attributes.position.needsUpdate =
            true;
        }
        if (mainGroupRef.current && !controlsRef.current.isDragging) {
          const rotY =
            (mainGroupRef.current.rotation.y + 0.12 * animationSpeed * dt) %
            (Math.PI * 2);
          mainGroupRef.current.rotation.y = rotY;
        }
        renderer.render(scene, camera);
      };
      animate();

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
        if (dragPoint && mainGroup) {
          const dragVector = new THREE.Vector3().subVectors(
            dragPoint,
            controlsRef.current.dragPoint!
          );
          const minMovement = 1.0;
          if (
            Math.abs(dragVector.x) > minMovement ||
            Math.abs(dragVector.y) > minMovement
          ) {
            const rotationSpeed = 0.0008;
            const damping = 0.8;
            mainGroup.rotation.x += dragVector.y * rotationSpeed * damping;
            mainGroup.rotation.y += dragVector.x * rotationSpeed * damping;
          }
          controlsRef.current.dragPoint!.copy(dragPoint);
        }
      };
      const handleMouseUp = () => {
        controlsRef.current.isDragging = false;
        controlsRef.current.dragPlane = null;
        controlsRef.current.dragPoint = null;
        container.style.cursor = "grab";
      };
      const handleMouseMoveHover = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          bubbleGroup.children as THREE.Object3D[],
          true
        );
        if (intersects.length > 0) {
          const intersected = intersects[0].object as THREE.Mesh;
          const userData = intersected.userData as { data?: BubblePoint3D };
          const bubbleData = userData.data;
          if (bubbleData) {
            onHover({ x: event.clientX, y: event.clientY, data: bubbleData });
            const mat = intersected.material as THREE.MeshBasicMaterial;
            if (mat) {
              mat.opacity = 1.0;
              mat.needsUpdate = true;
            }
          }
        } else {
          onHover(null);
          bubbleGroup.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshBasicMaterial;
            if (mat) {
              mat.opacity = 0.85;
              mat.needsUpdate = true;
            }
          });
        }
      };
      renderer.domElement.addEventListener("mousedown", handleMouseDown);
      renderer.domElement.addEventListener("mousemove", handleMouseMoveHover);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        if (!isMountedRef.current) return;
        renderer.domElement.removeEventListener("mousedown", handleMouseDown);
        renderer.domElement.removeEventListener(
          "mousemove",
          handleMouseMoveHover
        );
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        if (
          container &&
          renderer.domElement &&
          container.contains(renderer.domElement)
        )
          container.removeChild(renderer.domElement);
        renderer.dispose();
        scene.clear();
        // cleanup connections
        connectionPairsRef.current = [];
        linesGroupRef.current = null;
        lastTimeRef.current = null;
      };
    }, [
      animationSpeed,
      createParticleSystem,
      data,
      getColor,
      isZoomedOut,
      onHover,
      showParticles,
    ]);

    useEffect(() => {
      if (!containerRef.current) return;
      isMountedRef.current = true;
      const cleanup = initScene();
      return () => {
        isMountedRef.current = false;
        if (cleanup) cleanup();
      };
    }, [initScene]);

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

    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          margin: "10px",
        }}
      />
    );
  }
);
