import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

interface TheaterStageCanvasProps {
  progressRef: React.MutableRefObject<number>;
  outroProgressRef: React.MutableRefObject<number>;
  curtainIntroProgress: number;
}

const _camTargetPos = new THREE.Vector3();
const _camCurrentPos = new THREE.Vector3(0, 2.5, 11.4);
const _lookTarget = new THREE.Vector3(0, 1.45, 0);
const _lookCurrent = new THREE.Vector3(0, 1.45, 0);
const _dummy = new THREE.Object3D();
const _keyColor = new THREE.Color();

function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#2b1b12";
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 8; i++) {
      const y = i * 64;
      ctx.fillStyle = i % 2 === 0 ? "#24160e" : "#311f15";
      ctx.fillRect(0, y, 512, 62);
      ctx.fillStyle = "rgba(8,4,2,0.55)";
      ctx.fillRect(0, y + 62, 512, 2);
      for (let g = 0; g < 18; g++) {
        ctx.strokeStyle = "rgba(255, 210, 165, 0.04)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y + Math.random() * 60);
        ctx.bezierCurveTo(
          170,
          y + Math.random() * 60,
          340,
          y + Math.random() * 60,
          512,
          y + Math.random() * 60
        );
        ctx.stroke();
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 3);
  return tex;
}

function createVelvetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, "#5c0913");
    grad.addColorStop(0.25, "#9e1422");
    grad.addColorStop(0.5, "#6c0b16");
    grad.addColorStop(0.75, "#a61828");
    grad.addColorStop(1, "#5c0913");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 600; i++) {
      ctx.fillStyle = "rgba(255,255,255,0.025)";
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 1, 3);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1);
  return tex;
}

function createRadialShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
    g.addColorStop(0, "rgba(0,0,0,0.78)");
    g.addColorStop(0.55, "rgba(0,0,0,0.32)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  }
  return new THREE.CanvasTexture(canvas);
}

function createCrtScreenCanvas(): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  texture: THREE.CanvasTexture;
} {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return { canvas, ctx, texture };
}

function createPleatedCurtainGeometry(width: number, height: number): THREE.PlaneGeometry {
  const geo = new THREE.PlaneGeometry(width, height, 48, 24);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const normX = (x + width / 2) / width;
    const wave = Math.sin(normX * Math.PI * 12) * 0.22;
    const drape = Math.sin(((y + height / 2) / height) * Math.PI) * 0.06;
    pos.setZ(i, wave + drape);
  }
  geo.computeVertexNormals();
  return geo;
}

export default function TheaterStageCanvas({
  progressRef,
  outroProgressRef,
  curtainIntroProgress,
}: TheaterStageCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef(curtainIntroProgress);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    introRef.current = curtainIntroProgress;
  }, [curtainIntroProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const probe = document.createElement("canvas").getContext("webgl2");
      if (!probe) return true;
      const ext = probe.getExtension("WEBGL_debug_renderer_info");
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
      const gpu = String(probe.getParameter(param));
      probe.getExtension("WEBGL_lose_context")?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: "high-performance",
      });
    } catch {
      setContextLost(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070709);
    scene.fog = new THREE.FogExp2(0x070709, 0.048);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.08, 60);
    camera.position.copy(_camCurrentPos);

    // Three-point theatrical studio lighting rig (<= 3 shadow casters)
    const hemiLight = new THREE.HemisphereLight(0x6e82b5, 0x160c0f, 0.55);
    scene.add(hemiLight);

    const spotLight = new THREE.SpotLight(0xffdfb0, 42, 26, Math.PI / 4.8, 0.65, 1.4);
    spotLight.position.set(0, 7.2, 4.4);
    spotLight.target.position.set(0, 1.2, 0);
    spotLight.castShadow = !isSoftwareGl;
    spotLight.shadow.mapSize.set(1024, 1024);
    spotLight.shadow.bias = -0.0004;
    spotLight.shadow.normalBias = 0.02;
    scene.add(spotLight);
    scene.add(spotLight.target);

    const keyDir = new THREE.DirectionalLight(0xffcb8c, 1.45);
    keyDir.position.set(5, 6.5, 6);
    scene.add(keyDir);

    const rimLight = new THREE.DirectionalLight(0xa3b8ff, 0.75);
    rimLight.position.set(-4.5, 4.2, -3.5);
    scene.add(rimLight);

    // Procedural Textures
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const woodTex = createWoodTexture();
    woodTex.anisotropy = maxAniso;
    const velvetTex = createVelvetTexture();
    velvetTex.anisotropy = maxAniso;
    const shadowTex = createRadialShadowTexture();
    const crtScreen = createCrtScreenCanvas();
    crtScreen.texture.anisotropy = maxAniso;

    // 1. Theater Stage & Proscenium Group
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const stageDeck = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.6, 10),
      new THREE.MeshStandardMaterial({
        map: woodTex,
        roughness: 0.68,
        metalness: 0.08,
      })
    );
    stageDeck.position.set(0, -0.3, -1);
    stageDeck.receiveShadow = true;
    stageGroup.add(stageDeck);

    const apronTrim = new THREE.Mesh(
      new THREE.BoxGeometry(16.05, 0.12, 0.14),
      new THREE.MeshStandardMaterial({ color: 0xc9963b, roughness: 0.32, metalness: 0.85 })
    );
    apronTrim.position.set(0, -0.02, 4.02);
    stageGroup.add(apronTrim);

    const backdropMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 12),
      new THREE.MeshStandardMaterial({ color: 0x09090d, roughness: 0.95, metalness: 0 })
    );
    backdropMesh.position.set(0, 4.5, -5.5);
    stageGroup.add(backdropMesh);

    const footlightMat = new THREE.MeshStandardMaterial({
      color: 0x26211d,
      roughness: 0.45,
      metalness: 0.75,
    });
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xffd27d,
      emissive: 0xffb347,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });
    for (let i = -3; i <= 3; i++) {
      const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.18, 12), footlightMat);
      housing.rotation.x = Math.PI / 3;
      housing.position.set(i * 1.65, 0.08, 3.72);
      stageGroup.add(housing);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), bulbMat);
      bulb.position.set(i * 1.65, 0.1, 3.66);
      stageGroup.add(bulb);
    }

    // 2. Retro 1980s CRT Computer on Vintage Desk (Composite 11-Part Group)
    const pcEnsemble = new THREE.Group();
    pcEnsemble.position.set(0, 0, -0.2);
    scene.add(pcEnsemble);

    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 2.2),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.65,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, 0.015, 0);
    pcEnsemble.add(contactShadow);

    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x3b2416,
      roughness: 0.46,
      metalness: 0.05,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd9a03b,
      roughness: 0.28,
      metalness: 0.9,
    });
    const retroPlasticMat = new THREE.MeshStandardMaterial({
      color: 0xd9d2c0,
      roughness: 0.58,
      metalness: 0.06,
    });
    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x1d1e22,
      roughness: 0.42,
      metalness: 0.25,
    });

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.09, 1.35), walnutMat);
    deskTop.position.set(0, 0.84, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    pcEnsemble.add(deskTop);

    const legOffsets = [
      [-1.02, -0.54],
      [1.02, -0.54],
      [-1.02, 0.54],
      [1.02, 0.54],
    ];
    for (const [lx, lz] of legOffsets) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.026, 0.8, 12), walnutMat);
      leg.position.set(lx, 0.4, lz);
      leg.castShadow = true;
      pcEnsemble.add(leg);

      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.029, 0.032, 0.07, 12), brassMat);
      foot.position.set(lx, 0.035, lz);
      pcEnsemble.add(foot);
    }

    const cpuShape = new THREE.Shape();
    cpuShape.moveTo(-0.62, 0);
    cpuShape.lineTo(0.62, 0);
    cpuShape.lineTo(0.62, 0.21);
    cpuShape.lineTo(-0.62, 0.21);
    cpuShape.closePath();
    const cpuGeo = new THREE.ExtrudeGeometry(cpuShape, {
      depth: 0.82,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.015,
      bevelSegments: 2,
    });
    cpuGeo.translate(0, 0, -0.41);
    const cpuMesh = new THREE.Mesh(cpuGeo, retroPlasticMat);
    cpuMesh.position.set(0, 0.89, -0.05);
    cpuMesh.castShadow = true;
    cpuMesh.receiveShadow = true;
    pcEnsemble.add(cpuMesh);

    for (const fx of [0.16, 0.43]) {
      const bay = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.065, 0.03), darkTrimMat);
      bay.position.set(fx, 1.0, 0.375);
      pcEnsemble.add(bay);
    }
    const powerLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.018, 0.02),
      new THREE.MeshStandardMaterial({
        color: 0xff9f1c,
        emissive: 0xff8800,
        emissiveIntensity: 1.8,
      })
    );
    powerLed.position.set(-0.48, 0.96, 0.375);
    pcEnsemble.add(powerLed);

    const neckPoints = [
      new THREE.Vector2(0.0, 0),
      new THREE.Vector2(0.32, 0),
      new THREE.Vector2(0.28, 0.04),
      new THREE.Vector2(0.18, 0.09),
      new THREE.Vector2(0.24, 0.13),
      new THREE.Vector2(0.0, 0.13),
    ];
    const neckMesh = new THREE.Mesh(new THREE.LatheGeometry(neckPoints, 24), darkTrimMat);
    neckMesh.position.set(0, 1.11, -0.05);
    pcEnsemble.add(neckMesh);

    const crtRear = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.62, 0.46), retroPlasticMat);
    crtRear.position.set(0, 1.56, -0.14);
    crtRear.castShadow = true;
    pcEnsemble.add(crtRear);

    const bezelShape = new THREE.Shape();
    bezelShape.moveTo(-0.48, -0.38);
    bezelShape.lineTo(0.48, -0.38);
    bezelShape.lineTo(0.48, 0.38);
    bezelShape.lineTo(-0.48, 0.38);
    bezelShape.closePath();

    const bezelHole = new THREE.Path();
    bezelHole.moveTo(-0.37, -0.28);
    bezelHole.lineTo(0.37, -0.28);
    bezelHole.lineTo(0.37, 0.28);
    bezelHole.lineTo(-0.37, 0.28);
    bezelHole.closePath();
    bezelShape.holes.push(bezelHole);

    const bezelGeo = new THREE.ExtrudeGeometry(bezelShape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, retroPlasticMat);
    bezelMesh.position.set(0, 1.56, 0.08);
    bezelMesh.castShadow = true;
    pcEnsemble.add(bezelMesh);

    const screenMat = new THREE.MeshStandardMaterial({
      map: crtScreen.texture,
      emissiveMap: crtScreen.texture,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.9,
      roughness: 0.14,
      metalness: 0.15,
    });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.57), screenMat);
    screenMesh.position.set(0, 1.56, 0.16);
    pcEnsemble.add(screenMesh);

    const kbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.045, 0.32), retroPlasticMat);
    kbMesh.position.set(0, 0.91, 0.51);
    kbMesh.rotation.x = 0.09;
    kbMesh.castShadow = true;
    pcEnsemble.add(kbMesh);

    const keyGeo = new THREE.BoxGeometry(0.052, 0.024, 0.052);
    const keyMat = new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.05 });
    const keysInstanced = new THREE.InstancedMesh(keyGeo, keyMat, 42);
    let keyIdx = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 14; c++) {
        _dummy.position.set(-0.41 + c * 0.063, 0.942 - r * 0.006, 0.43 + r * 0.068);
        _dummy.rotation.set(0.09, 0, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        keysInstanced.setMatrixAt(keyIdx, _dummy.matrix);
        const isModifier = c === 0 || c === 13;
        _keyColor.setHex(isModifier ? 0x6f695d : 0xebe5d5);
        keysInstanced.setColorAt(keyIdx, _keyColor);
        keyIdx++;
      }
    }
    keysInstanced.instanceMatrix.needsUpdate = true;
    if (keysInstanced.instanceColor) keysInstanced.instanceColor.needsUpdate = true;
    keysInstanced.computeBoundingSphere();
    pcEnsemble.add(keysInstanced);

    const cablePts: THREE.Vector3[] = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      cablePts.push(
        new THREE.Vector3(
          -0.38 + Math.sin(t * Math.PI * 6) * 0.03,
          0.91 + Math.cos(t * Math.PI * 6) * 0.015,
          0.36 - t * 0.16
        )
      );
    }
    const cableGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cablePts), 32, 0.01, 8, false);
    const cableMesh = new THREE.Mesh(cableGeo, darkTrimMat);
    pcEnsemble.add(cableMesh);

    const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.048, 0.02), brassMat);
    plaque.position.set(0, 0.84, 0.68);
    pcEnsemble.add(plaque);

    // 3. Crimson Velvet Theater Curtains (Pleated + Animated)
    const curtainMat = new THREE.MeshPhysicalMaterial({
      map: velvetTex,
      color: 0x991220,
      roughness: 0.82,
      metalness: 0.02,
      sheen: 1.0,
      sheenRoughness: 0.42,
      sheenColor: new THREE.Color(0xff5a68),
      side: THREE.DoubleSide,
    });

    const curtainGeo = createPleatedCurtainGeometry(5.6, 6.2);
    const leftCurtain = new THREE.Mesh(curtainGeo, curtainMat);
    leftCurtain.position.set(-2.7, 2.95, 2.3);
    leftCurtain.castShadow = !isSoftwareGl;
    scene.add(leftCurtain);

    const rightCurtain = new THREE.Mesh(curtainGeo, curtainMat);
    rightCurtain.position.set(2.7, 2.95, 2.3);
    rightCurtain.castShadow = !isSoftwareGl;
    scene.add(rightCurtain);

    const valance = new THREE.Mesh(createPleatedCurtainGeometry(12.8, 1.1), curtainMat);
    valance.position.set(0, 5.45, 2.55);
    scene.add(valance);

    const curtainRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 13.4, 16),
      brassMat
    );
    curtainRod.rotation.z = Math.PI / 2;
    curtainRod.position.set(0, 5.95, 2.55);
    scene.add(curtainRod);

    // 4. Floating Stage Dust Motes
    const dustCount = 120;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 8;
      dustPositions[i * 3 + 1] = Math.random() * 5 + 0.3;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffe4b5,
      size: 0.032,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let lastTime = performance.now();
    let smoothedCurtainOpen = 0;
    let crtBlinkAccum = 0;

    function updateCrtCanvas(p: number, op: number, timeSec: number) {
      const ctx = crtScreen.ctx;
      if (!ctx) return;
      ctx.fillStyle = "#030504";
      ctx.fillRect(0, 0, 512, 384);

      ctx.fillStyle = "rgba(74, 222, 128, 0.04)";
      for (let y = 0; y < 384; y += 6) {
        ctx.fillRect(0, y, 512, 2);
      }

      if (op > 0.5) {
        // Closing 404 fading into standby on monitor as camera pulls back
        ctx.fillStyle = "rgba(74, 222, 128, 0.72)";
        ctx.font = "22px monospace";
        ctx.fillText("ERROR 404", 46, 92);
        ctx.fillStyle = "rgba(229, 169, 59, 0.8)";
        ctx.font = "16px monospace";
        ctx.fillText("MAS DIAPOSITIVAS NO ENCONTRADAS", 46, 130);
      } else if (p > 0.14 && p < 0.39) {
        const alpha = Math.min(1, (p - 0.14) / 0.12);
        ctx.fillStyle = `rgba(74, 222, 128, ${alpha * 0.78})`;
        ctx.font = "22px monospace";
        ctx.fillText("C:\\GRADO10> _", 46, 86);
        if (Math.floor(timeSec * 2) % 2 === 0 && p > 0.25) {
          ctx.fillStyle = `rgba(229, 169, 59, ${alpha * 0.85})`;
          ctx.fillText("BUSCANDO ARCHIVO...", 46, 126);
        }
      }
      crtScreen.texture.needsUpdate = true;
    }

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = now / 1000;

      const p = progressRef.current;
      const op = outroProgressRef.current;

      let targetOpen = 1;
      let dollyT = 0;
      let blackoutFactor = 1;

      if (op > 0.01) {
        // Closing Act: pull back from monitor & close crimson curtains & fade lights to black
        const pullBackT = THREE.MathUtils.clamp((op - 0.56) / 0.28, 0, 1);
        const easedPull = pullBackT * pullBackT * (3 - 2 * pullBackT);
        dollyT = 1 - easedPull;

        const closeT = THREE.MathUtils.clamp((op - 0.64) / 0.26, 0, 1);
        const easedClose = closeT * closeT * (3 - 2 * closeT);
        targetOpen = 1 - easedClose;

        const fadeT = THREE.MathUtils.clamp((op - 0.86) / 0.12, 0, 1);
        blackoutFactor = 1 - fadeT;
      } else {
        // Opening Act: curtains part and camera dollies in toward CRT screen
        const autoOpen = introRef.current * 0.56;
        const scrollOpen = Math.min(1, p / 0.22) * 0.44;
        targetOpen = Math.min(1, autoOpen + scrollOpen);

        const rawDolly = THREE.MathUtils.clamp(p / 0.44, 0, 1);
        dollyT = rawDolly * rawDolly * (3 - 2 * rawDolly);
      }

      const dampFactor = 1 - Math.exp(-5.0 * dt);
      smoothedCurtainOpen = THREE.MathUtils.lerp(smoothedCurtainOpen, targetOpen, dampFactor);

      const curtainShift = smoothedCurtainOpen * 3.75;
      const curtainCompress = 1 - smoothedCurtainOpen * 0.42;
      leftCurtain.position.x = -2.7 - curtainShift;
      rightCurtain.position.x = 2.7 + curtainShift;
      leftCurtain.scale.x = curtainCompress;
      rightCurtain.scale.x = curtainCompress;

      const sway = Math.sin(elapsed * 1.1) * 0.022 * (0.2 + smoothedCurtainOpen * 0.8);
      leftCurtain.rotation.y = sway;
      rightCurtain.rotation.y = -sway;

      _camTargetPos.set(
        Math.sin(elapsed * 0.4) * 0.04 * (1 - dollyT),
        THREE.MathUtils.lerp(2.5, 1.56, dollyT),
        THREE.MathUtils.lerp(11.4, 0.22, dollyT)
      );
      _lookTarget.set(0, THREE.MathUtils.lerp(1.45, 1.56, dollyT), -0.04);

      const camDamp = 1 - Math.exp(-6.5 * dt);
      _camCurrentPos.lerp(_camTargetPos, camDamp);
      _lookCurrent.lerp(_lookTarget, camDamp);

      camera.position.copy(_camCurrentPos);
      camera.lookAt(_lookCurrent);

      const targetFov = THREE.MathUtils.lerp(44, 34, dollyT);
      if (Math.abs(camera.fov - targetFov) > 0.05) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, camDamp);
        camera.updateProjectionMatrix();
      }

      // Dim theater exposure smoothly to total black at end of closing curtain
      renderer.toneMappingExposure = 1.08 * blackoutFactor;
      spotLight.intensity = 42 * blackoutFactor;
      bulbMat.emissiveIntensity = 2.2 * blackoutFactor;

      dustPoints.rotation.y = elapsed * 0.015;
      dustPoints.position.y = Math.sin(elapsed * 0.5) * 0.08;

      crtBlinkAccum += dt;
      if (crtBlinkAccum > 0.08) {
        crtBlinkAccum = 0;
        updateCrtCanvas(p, op, elapsed);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    tick();

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh || (obj as THREE.Points).isPoints) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material?.dispose();
        }
      });
      woodTex.dispose();
      velvetTex.dispose();
      shadowTex.dispose();
      crtScreen.texture.dispose();
      scene.environment?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [progressRef, outroProgressRef]);

  if (contextLost) {
    return (
      <div className="fixed inset-0 bg-[#070709] flex items-center justify-center text-center px-6">
        <div className="max-w-md space-y-3 border border-white/10 p-6 bg-[#0F1014]">
          <p className="font-mono text-xs text-[#E5A93B] tracking-widest">PROYECCIÓN 3D EN PAUSA</p>
          <p className="text-sm text-[#EAE4D7]/80">
            El navegador suspendió el contexto gráfico. Puedes continuar navegando los capítulos de la exposición.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className="fixed inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}
