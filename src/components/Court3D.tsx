import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Drill3D, DrillPoint3D } from '../types/basketball';
import { soundEffects } from '../utils/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowLeft,
  Video,
  Activity,
  Flame
} from 'lucide-react';

interface Court3DProps {
  currentDrill: Drill3D;
  onSelectDrill: (drill: Drill3D) => void;
  allDrills: Drill3D[];
  onBackToHome?: () => void;
  onStartRoutineWithDrill?: (drillId: string) => void;
}

export const Court3D: React.FC<Court3DProps> = ({
  currentDrill,
  onSelectDrill,
  allDrills,
  onBackToHome,
  onStartRoutineWithDrill
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeActionLabel, setActiveActionLabel] = useState<string>('En posición');
  const [activeCamPreset, setActiveCamPreset] = useState<'general' | 'rim'>('general');

  // Three.js mutable references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  // Interactive athlete model references
  const playerAvatarRef = useRef<THREE.Group | null>(null);
  const torsoRef = useRef<THREE.Mesh | null>(null);
  const leftArmRef = useRef<THREE.Group | null>(null);
  const rightArmRef = useRef<THREE.Group | null>(null);
  const leftLegRef = useRef<THREE.Group | null>(null);
  const rightLegRef = useRef<THREE.Group | null>(null);
  const ballMeshRef = useRef<THREE.Mesh | null>(null);
  const coneGroupRef = useRef<THREE.Group | null>(null);
  const pathLineRef = useRef<THREE.Line | null>(null);

  // Animation progress
  const animProgressRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  isPlayingRef.current = isPlaying;
  const currentDrillRef = useRef<Drill3D>(currentDrill);
  currentDrillRef.current = currentDrill;

  // Smooth camera targets: Default FULL BASKETBALL COURT (Cancha Completa)
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 20, 23));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const setCameraPreset = useCallback((preset: 'general' | 'rim') => {
    setActiveCamPreset(preset);
    soundEffects.playBounce();
    if (preset === 'general') {
      // FULL COURT: Both baskets (-14m to +14m) and both sidelines fully visible
      targetCamPosRef.current.set(0, 20, 23);
      targetLookAtRef.current.set(0, 0, 0);
    } else {
      // Focus on the basket and shooting area
      targetCamPosRef.current.set(-14, 5.5, 7.5);
      targetLookAtRef.current.set(-12, 2.5, 0);
    }
  }, []);

  // Update Cones and 3D Drill Path when drill changes
  useEffect(() => {
    animProgressRef.current = 0;
    setActiveActionLabel(currentDrill.points[0]?.label || 'En posición');

    if (coneGroupRef.current && sceneRef.current) {
      while (coneGroupRef.current.children.length > 0) {
        const child = coneGroupRef.current.children[0];
        coneGroupRef.current.remove(child);
      }

      const coneGeo = new THREE.ConeGeometry(0.3, 0.6, 16);
      const coneBaseGeo = new THREE.BoxGeometry(0.5, 0.05, 0.5);
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        roughness: 0.35,
        metalness: 0.1
      });
      const coneBaseMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.7
      });
      const coneStripeMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.2
      });

      currentDrill.cones.forEach((pos: { x: number; z: number }) => {
        const coneMesh = new THREE.Group();
        
        const base = new THREE.Mesh(coneBaseGeo, coneBaseMat);
        base.position.y = 0.025;
        base.castShadow = true;
        coneMesh.add(base);

        const body = new THREE.Mesh(coneGeo, coneMat);
        body.position.y = 0.32;
        body.castShadow = true;
        coneMesh.add(body);

        const stripeGeo = new THREE.CylinderGeometry(0.19, 0.23, 0.14, 16);
        const stripe = new THREE.Mesh(stripeGeo, coneStripeMat);
        stripe.position.y = 0.3;
        coneMesh.add(stripe);

        coneMesh.position.set(pos.x, 0, pos.z);
        coneGroupRef.current?.add(coneMesh);
      });
    }

    if (sceneRef.current) {
      if (pathLineRef.current) {
        sceneRef.current.remove(pathLineRef.current);
        pathLineRef.current.geometry.dispose();
      }

      const points = currentDrill.points.map((p: DrillPoint3D) => new THREE.Vector3(p.x, Math.max(p.y, 0.08), p.z));
      const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.2);
      const curvePoints = curve.getPoints(120);
      const pathGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const pathMat = new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        linewidth: 2,
        scale: 1,
        dashSize: 0.5,
        gapSize: 0.25
      });
      const line = new THREE.Line(pathGeo, pathMat);
      line.computeLineDistances();
      sceneRef.current.add(line);
      pathLineRef.current = line;
    }

    // Default to general full court unless drill specifies
    if (currentDrill.cameraPreset === 'rim') {
      setCameraPreset('rim');
    } else {
      setCameraPreset('general');
    }
  }, [currentDrill, setCameraPreset]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a101f);
    scene.fog = new THREE.FogExp2(0x0a101f, 0.016);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    // Position camera to see FULL COURT
    camera.position.set(0, 20, 23);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 6;
    controls.maxDistance = 44;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Arena Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.4);
    keyLight.position.set(12, 22, 14);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    const d = 18;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    scene.add(keyLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    blueRimLight.position.set(-14, 16, -12);
    scene.add(blueRimLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x0f172a, 1.1);
    scene.add(hemiLight);

    // Hardwood Court (Full 28m x 15m)
    const courtLength = 28;
    const courtWidth = 15;
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1096;
    const ctx = canvas.getContext('2d')!;

    // Wood base
    ctx.fillStyle = '#c79c65';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Wood Planks
    const plankH = 18;
    for (let y = 0; y < canvas.height; y += plankH) {
      const tint = ((y * 11) % 24) - 12;
      ctx.fillStyle = `rgb(${199 + tint}, ${156 + tint}, ${101 + Math.floor(tint * 0.7)})`;
      ctx.fillRect(0, y, canvas.width, plankH - 1);
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      ctx.fillRect(0, y + plankH - 1, canvas.width, 1);
    }

    // Court Perimeter Border in Championship Royal Blue
    const margin = 50;
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 14;
    ctx.strokeRect(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2);

    // Half Court Line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, margin);
    ctx.lineTo(canvas.width / 2, canvas.height - margin);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Center Circle (Radius ~ 1.8m)
    const centerR = (1.8 / courtWidth) * (canvas.height - margin * 2);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, centerR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(30, 58, 138, 0.85)';
    ctx.fill();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Center Court Brand Text
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '6px';
    ctx.fillText('SURVIVORS', 0, -18);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 22px sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('MELLADO B.C.', 0, 20);
    ctx.restore();

    // Half-Court Markings (Key, 3-point, free throw)
    const drawHalfCourt = (isLeft: boolean) => {
      const baseX = isLeft ? margin : canvas.width - margin;
      const dir = isLeft ? 1 : -1;
      const keyWidthPx = (4.9 / courtWidth) * (canvas.height - margin * 2);
      const keyLengthPx = (5.8 / courtLength) * (canvas.width - margin * 2);
      const centerY = canvas.height / 2;

      // Painted Key (Survivors Royal Blue)
      ctx.fillStyle = 'rgba(30, 58, 138, 0.75)';
      ctx.fillRect(
        isLeft ? baseX : baseX - keyLengthPx,
        centerY - keyWidthPx / 2,
        keyLengthPx,
        keyWidthPx
      );

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.strokeRect(
        isLeft ? baseX : baseX - keyLengthPx,
        centerY - keyWidthPx / 2,
        keyLengthPx,
        keyWidthPx
      );

      const ftR = (1.8 / courtWidth) * (canvas.height - margin * 2);
      ctx.beginPath();
      ctx.arc(baseX + dir * keyLengthPx, centerY, ftR, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.stroke();

      const hoopDist = (1.575 / courtLength) * (canvas.width - margin * 2);
      const hoopX = baseX + dir * hoopDist;
      const threePtR = (6.75 / courtWidth) * (canvas.height - margin * 2);

      ctx.beginPath();
      ctx.arc(hoopX, centerY, threePtR, -Math.PI / 2.3, Math.PI / 2.3, !isLeft);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 8;
      ctx.stroke();
    };

    drawHalfCourt(true);
    drawHalfCourt(false);

    const courtTex = new THREE.CanvasTexture(canvas);
    courtTex.colorSpace = THREE.SRGBColorSpace;
    courtTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const courtGeo = new THREE.PlaneGeometry(courtLength, courtWidth);
    const courtMat = new THREE.MeshStandardMaterial({
      map: courtTex,
      roughness: 0.28,
      metalness: 0.05
    });
    const courtMesh = new THREE.Mesh(courtGeo, courtMat);
    courtMesh.rotation.x = -Math.PI / 2;
    courtMesh.receiveShadow = !isSoftwareGl;
    scene.add(courtMesh);

    // Outer Stadium Runoff Floor
    const runoffGeo = new THREE.PlaneGeometry(courtLength + 10, courtWidth + 8);
    const runoffMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7
    });
    const runoffMesh = new THREE.Mesh(runoffGeo, runoffMat);
    runoffMesh.rotation.x = -Math.PI / 2;
    runoffMesh.position.y = -0.01;
    scene.add(runoffMesh);

    // Basketball Hoops (Both Ends)
    const createHoop = (xPos: number, isFlipped: boolean) => {
      const hoopG = new THREE.Group();
      hoopG.rotation.y = isFlipped ? Math.PI : 0;
      hoopG.position.set(xPos, 0, 0);

      // Base padding
      const bG = new THREE.BoxGeometry(1.2, 1.2, 1.4);
      const bM = new THREE.MeshStandardMaterial({ color: 0x1e3a8a });
      const bMesh = new THREE.Mesh(bG, bM);
      bMesh.position.set(-1.8, 0.6, 0);
      hoopG.add(bMesh);

      // Steel arm
      const armG = new THREE.CylinderGeometry(0.12, 0.14, 4.4, 16);
      const armM = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
      const armMesh = new THREE.Mesh(armG, armM);
      armMesh.position.set(-0.9, 2.2, 0);
      armMesh.rotation.z = -0.45;
      hoopG.add(armMesh);

      // Glass Backboard
      const bbG = new THREE.BoxGeometry(0.06, 1.05, 1.8);
      const bbM = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.65,
        roughness: 0.1
      });
      const bb = new THREE.Mesh(bbG, bbM);
      bb.position.set(0, 3.25, 0);
      hoopG.add(bb);

      // Rim (3.05m regulation)
      const rimG = new THREE.TorusGeometry(0.24, 0.02, 12, 32);
      const rimM = new THREE.MeshStandardMaterial({ color: 0xff4500, metalness: 0.4 });
      const rim = new THREE.Mesh(rimG, rimM);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(0.38, 3.05, 0);
      hoopG.add(rim);

      // Net
      const netG = new THREE.CylinderGeometry(0.23, 0.15, 0.42, 16, 4, true);
      const netM = new THREE.MeshStandardMaterial({ color: 0xf8fafc, wireframe: true });
      const net = new THREE.Mesh(netG, netM);
      net.position.set(0.38, 2.84, 0);
      hoopG.add(net);

      return hoopG;
    };

    scene.add(createHoop(-12.5, false));
    scene.add(createHoop(12.5, true));

    // Cones container
    const coneGroup = new THREE.Group();
    scene.add(coneGroup);
    coneGroupRef.current = coneGroup;

    // Procedural Basketball
    const ballGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.5 });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.castShadow = !isSoftwareGl;
    ballMesh.position.set(-10, 0.32, 0);
    scene.add(ballMesh);
    ballMeshRef.current = ballMesh;

    // ARTICULATED ATHLETE MANNEQUIN (MUÑECO 3D ARTICULADO)
    const playerGroup = new THREE.Group();

    // Base glowing ring
    const ringG = new THREE.RingGeometry(0.4, 0.55, 32);
    const ringM = new THREE.MeshBasicMaterial({ color: 0x2563eb, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringG, ringM);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.03;
    playerGroup.add(ringMesh);

    // Torso (Jersey #7 Survivors)
    const torsoG = new THREE.CylinderGeometry(0.3, 0.28, 0.9, 16);
    const torsoM = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 }); // Royal Blue
    const torsoMesh = new THREE.Mesh(torsoG, torsoM);
    torsoMesh.position.y = 1.05;
    torsoMesh.castShadow = !isSoftwareGl;
    playerGroup.add(torsoMesh);
    torsoRef.current = torsoMesh;

    // Head with Headband
    const headG = new THREE.SphereGeometry(0.2, 16, 16);
    const headM = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    const headMesh = new THREE.Mesh(headG, headM);
    headMesh.position.y = 1.65;
    playerGroup.add(headMesh);

    const headbandG = new THREE.TorusGeometry(0.2, 0.03, 8, 24);
    const headbandM = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const headband = new THREE.Mesh(headbandG, headbandM);
    headband.rotation.x = Math.PI / 2;
    headband.position.y = 1.7;
    playerGroup.add(headband);

    // Left Arm (Articulated shoulder pivot)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.35, 1.4, 0);
    const armMeshG = new THREE.CylinderGeometry(0.08, 0.07, 0.6, 12);
    const armMeshM = new THREE.MeshStandardMaterial({ color: 0xd97706 });
    const leftArmMesh = new THREE.Mesh(armMeshG, armMeshM);
    leftArmMesh.position.y = -0.3;
    leftArmGroup.add(leftArmMesh);
    playerGroup.add(leftArmGroup);
    leftArmRef.current = leftArmGroup;

    // Right Arm (Articulated shoulder pivot)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.35, 1.4, 0);
    const rightArmMesh = new THREE.Mesh(armMeshG, armMeshM);
    rightArmMesh.position.y = -0.3;
    rightArmGroup.add(rightArmMesh);
    playerGroup.add(rightArmGroup);
    rightArmRef.current = rightArmGroup;

    // Left Leg
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.16, 0.6, 0);
    const legG = new THREE.CylinderGeometry(0.1, 0.08, 0.65, 12);
    const leftLegMesh = new THREE.Mesh(legG, armMeshM);
    leftLegMesh.position.y = -0.3;
    leftLegGroup.add(leftLegMesh);
    playerGroup.add(leftLegGroup);
    leftLegRef.current = leftLegGroup;

    // Right Leg
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.16, 0.6, 0);
    const rightLegMesh = new THREE.Mesh(legG, armMeshM);
    rightLegMesh.position.y = -0.3;
    rightLegGroup.add(rightLegMesh);
    playerGroup.add(rightLegGroup);
    rightLegRef.current = rightLegGroup;

    scene.add(playerGroup);
    playerAvatarRef.current = playerGroup;

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();

      // Smooth camera interpolation
      if (camera && controls) {
        camera.position.lerp(targetCamPosRef.current, 0.06);
        controls.target.lerp(targetLookAtRef.current, 0.06);
        controls.update();
      }

      // Drill Animation along Points according to Exercise Sequence
      const currentDrillNow = currentDrillRef.current;
      if (isPlayingRef.current && currentDrillNow.points.length > 1) {
        const speedMultiplier = currentDrillNow.id === 'tiro_aro' ? 0.38 : 0.45;
        animProgressRef.current += delta * speedMultiplier;

        if (animProgressRef.current >= currentDrillNow.points.length - 1) {
          animProgressRef.current = 0;
          soundEffects.playWhistle(0.12);
        }

        const pIndex = Math.floor(animProgressRef.current);
        const pNext = Math.min(pIndex + 1, currentDrillNow.points.length - 1);
        const subT = animProgressRef.current - pIndex;

        const p1 = currentDrillNow.points[pIndex];
        const p2 = currentDrillNow.points[pNext];

        if (p1 && p2) {
          const curX = THREE.MathUtils.lerp(p1.x, p2.x, subT);
          const curY = THREE.MathUtils.lerp(p1.y, p2.y, subT);
          const curZ = THREE.MathUtils.lerp(p1.z, p2.z, subT);

          // Update athlete mannequin position
          if (playerAvatarRef.current) {
            playerAvatarRef.current.position.set(curX, curY, curZ);

            // Compute direction to rotate avatar naturally
            const dirX = p2.x - p1.x;
            const dirZ = p2.z - p1.z;
            if (Math.abs(dirX) > 0.01 || Math.abs(dirZ) > 0.01) {
              const targetAngle = Math.atan2(dirX, dirZ);
              playerAvatarRef.current.rotation.y = THREE.MathUtils.lerp(
                playerAvatarRef.current.rotation.y,
                targetAngle,
                0.14
              );
            }

            // KINEMATICS ACCORDING TO ACTION
            const action = p1.action;
            const walkCycle = Math.sin(subT * Math.PI * 4);

            if (action === 'sprint' || action === 'run' || action === 'dribble') {
              // Running motion: arms and legs swing opposite
              if (leftArmRef.current) leftArmRef.current.rotation.x = walkCycle * 0.8;
              if (rightArmRef.current) rightArmRef.current.rotation.x = -walkCycle * 0.8;
              if (leftLegRef.current) leftLegRef.current.rotation.x = -walkCycle * 0.7;
              if (rightLegRef.current) rightLegRef.current.rotation.x = walkCycle * 0.7;
              if (torsoRef.current) torsoRef.current.rotation.x = 0.15; // forward lean
            } else if (action === 'slide') {
              // Defensive slide between cones: arms wide open, knees bent
              if (leftArmRef.current) {
                leftArmRef.current.rotation.z = -1.35;
                leftArmRef.current.rotation.x = 0.2;
              }
              if (rightArmRef.current) {
                rightArmRef.current.rotation.z = 1.35;
                rightArmRef.current.rotation.x = 0.2;
              }
              if (torsoRef.current) torsoRef.current.rotation.x = 0.35; // crouch
            } else if (action === 'shoot') {
              // Jump Shot: Body elevates, both arms raise high, right hand snaps wrist!
              if (leftArmRef.current) {
                leftArmRef.current.rotation.x = Math.PI * 0.75;
                leftArmRef.current.rotation.z = -0.35;
              }
              if (rightArmRef.current) {
                // Right arm extends up and snaps forward
                rightArmRef.current.rotation.x = Math.PI * 0.88;
                rightArmRef.current.rotation.z = 0.1;
              }
              if (torsoRef.current) torsoRef.current.rotation.x = -0.05;
            } else if (action === 'layup') {
              // Layup: Right arm reaches high towards backboard
              if (leftArmRef.current) {
                leftArmRef.current.rotation.x = 0.3;
                leftArmRef.current.rotation.z = -0.4;
              }
              if (rightArmRef.current) {
                rightArmRef.current.rotation.x = Math.PI * 0.92;
                rightArmRef.current.rotation.z = 0.15;
              }
              if (torsoRef.current) torsoRef.current.rotation.x = 0.1;
            } else if (action === 'touch') {
              // Touching suicide line: crouches and right arm touches floor!
              if (leftArmRef.current) leftArmRef.current.rotation.x = -0.3;
              if (rightArmRef.current) rightArmRef.current.rotation.x = 1.1;
              if (torsoRef.current) torsoRef.current.rotation.x = 0.7;
            } else {
              // Rest/standing
              if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
              if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
              if (torsoRef.current) torsoRef.current.rotation.x = 0;
            }
          }

          // BASKETBALL KINEMATICS: Dribble, Shoot, Layup, Flight to Hoop!
          if (ballMeshRef.current) {
            const rimTargetX = -12.12; // left rim center
            const rimTargetY = 3.05;
            const rimTargetZ = 0;

            if (p1.action === 'shoot') {
              // SHOOTING AT THE HOOP: The ball leaves player's hand and arcs into the rim!
              if (subT < 0.2) {
                // Gather in hands
                ballMeshRef.current.position.set(curX + 0.15, curY + 1.85, curZ);
              } else if (subT < 0.8) {
                // Parabolic trajectory to basket
                const flightT = (subT - 0.2) / 0.6;
                const bX = THREE.MathUtils.lerp(curX, rimTargetX, flightT);
                const bZ = THREE.MathUtils.lerp(curZ, rimTargetZ, flightT);
                const arcY = Math.sin(flightT * Math.PI) * 2.3;
                const bY = THREE.MathUtils.lerp(curY + 1.85, rimTargetY, flightT) + arcY;
                ballMeshRef.current.position.set(bX, bY, bZ);
                ballMeshRef.current.rotation.x -= delta * 12; // Backspin
              } else {
                // Ball goes through net and drops to hardwood!
                const dropT = (subT - 0.8) / 0.2;
                const dropY = Math.max(0.32, rimTargetY - dropT * 2.8);
                const bounce = dropT > 0.6 ? Math.abs(Math.sin((dropT - 0.6) * Math.PI * 4)) * 0.35 : 0;
                ballMeshRef.current.position.set(rimTargetX, dropY + bounce, rimTargetZ);
              }
            } else if (p1.action === 'layup') {
              // LAYUP OFF BACKBOARD INTO RIM
              if (subT < 0.55) {
                ballMeshRef.current.position.set(curX + 0.15, curY + 1.9, curZ);
              } else {
                const layupT = (subT - 0.55) / 0.45;
                const bX = THREE.MathUtils.lerp(curX, rimTargetX, layupT);
                const bY = Math.max(0.32, THREE.MathUtils.lerp(curY + 1.9, rimTargetY, layupT) - (layupT > 0.5 ? (layupT - 0.5) * 2.5 : 0));
                ballMeshRef.current.position.set(bX, bY, curZ);
              }
            } else if (p1.action === 'touch') {
              // Ball held on hip or left side while right hand touches line
              ballMeshRef.current.position.set(curX - 0.25, 0.45, curZ);
            } else {
              // Regular Dribble bounce on floor
              const bounceY = curY + Math.abs(Math.sin(subT * Math.PI * 4)) * 0.6 + 0.32;
              ballMeshRef.current.position.set(curX + 0.35, bounceY, curZ);
              ballMeshRef.current.rotation.x += delta * 6;
            }
          }

          setActiveActionLabel(p1.label || 'En acción');
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      courtGeo.dispose();
      courtMat.dispose();
      courtTex.dispose();
      ballGeo.dispose();
      ballMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a101f] flex flex-col">
      {/* 3D WebGL Canvas (100% Unobstructed full court view) */}
      <div 
        ref={mountRef} 
        className="w-full flex-1 relative cursor-grab active:cursor-grabbing touch-none"
      />

      {/* TOP UNIFIED SLIM TOOLBAR (Non-overlapping, strictly within margins) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20 pointer-events-auto">
        
        {/* Left: Volver al menú */}
        {onBackToHome && (
          <button
            onClick={() => {
              soundEffects.playBounce();
              onBackToHome();
            }}
            className="px-3 py-1.5 rounded-xl bg-white/95 text-slate-800 border border-slate-200 text-xs font-bold hover:bg-white flex items-center gap-1.5 shadow-md backdrop-blur-md active:scale-95 transition-all shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        )}

        {/* Center: Clean Live Action Pill */}
        <div className="bg-blue-600/95 backdrop-blur-md text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg border border-blue-400 flex items-center gap-1.5 truncate max-w-[220px] sm:max-w-sm">
          <Activity className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="truncate">{activeActionLabel}</span>
        </div>

        {/* Right: Controls (Play/Pause & Camera View) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              if (!isPlaying) soundEffects.playWhistle(0.2);
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/95 text-slate-800 border border-slate-200 text-xs font-bold hover:bg-white flex items-center gap-1 shadow-md backdrop-blur-md active:scale-95 transition-all"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-blue-600" /> : <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pausa' : 'Play'}</span>
          </button>

          <button
            onClick={() => setCameraPreset(activeCamPreset === 'general' ? 'rim' : 'general')}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md backdrop-blur-md border transition-all ${
              activeCamPreset === 'general'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-white/95 text-slate-800 border-slate-200'
            }`}
            title="Alternar entre Cancha Completa y Aro"
          >
            <Video className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">{activeCamPreset === 'general' ? 'Cancha Completa' : 'Aro'}</span>
          </button>
        </div>
      </div>

      {/* BOTTOM SLIM DOCK: Clean horizontal drill selector (Occupies only ~46px, zero obstruction!) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-full max-w-xl px-2.5 sm:px-4 z-20 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {allDrills.map((d) => {
            const isSelected = d.id === currentDrill.id;
            const icon = d.id === 'tiro_aro' ? '🏀' : d.id === 'zigzag_defensa' ? '🛡️' : d.id === 'suicidas' ? '⚡' : '🔥';
            const shortName = d.name.split('(')[0].replace('Survivors', '').trim();

            return (
              <button
                key={d.id}
                onClick={() => {
                  onSelectDrill(d);
                  soundEffects.playBounce();
                }}
                className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span>{icon}</span>
                <span>{shortName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
