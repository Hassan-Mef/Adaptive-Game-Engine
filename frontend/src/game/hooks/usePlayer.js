import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Raycaster } from "three";

// Player physics constants
const PLAYER_HEIGHT = 3.5; // eye height
const MOVE_SPEED = 6; // walking speed
const JUMP_FORCE = 9; // jump velocity
const GRAVITY = 18; // gravity strength

export default function usePlayer() {
  const { camera, scene } = useThree();

  // Track player velocity
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const direction = new THREE.Vector3();

  // Track key states
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
  });

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.code === "Space") keys.current.space = true;
    };

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
      if (e.code === "Space") {
        keys.current.space = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const raycaster = new THREE.Raycaster();

  useFrame((_, delta) => {
    // We will fill this during steps 2–6:
    // - gravity

    // 1. apply gravity to velocity.y
    //velocity.current.y -= GRAVITY * delta;

    // 2. Move the camera by vertical velocity
    camera.position.y += velocity.current.y * delta;

    // 3. Ground detection

    // Raycast downward from camera
    raycaster.set(
      new THREE.Vector3(
        camera.position.x,
        camera.position.y,
        camera.position.z
      ),
      new THREE.Vector3(0, -1, 0)
    );

    // Get only ground mesh
    const ground = scene.getObjectByName("ground");

    let groundY = null;
    if (ground) {
      const hits = raycaster.intersectObject(ground);
      if (hits.length > 0) {
        groundY = hits[0].point.y;
      }
    }

    if (groundY !== null) {
      const playerFootY = camera.position.y - PLAYER_HEIGHT;

      if (playerFootY < groundY) {
        camera.position.y = groundY + PLAYER_HEIGHT;
        velocity.current.y = 0;
      }
    }

    // 4. HOritozontal movement
    const moveDir = direction; // reuse vector
    moveDir.set(0, 0, 0);

    // WASD
    if (keys.current.w) moveDir.z += 1;
    if (keys.current.s) moveDir.z -= 1;
    if (keys.current.a) moveDir.x -= 1;
    if (keys.current.d) moveDir.x += 1;

    // normalize direction
    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
    }

    // convert local moveDIr to world space
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0; // ignore vertical component
    cameraDirection.normalize();

    //camera right vector
    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(cameraDirection, camera.up).normalize();

    // Convert local movement to world movement
    const worldMove = new THREE.Vector3()
      .addScaledVector(cameraDirection, moveDir.z)
      .addScaledVector(cameraRight, moveDir.x);

    // acceleration
    const ACCEL = MOVE_SPEED * 6;
    velocity.current.x = THREE.MathUtils.lerp(
      velocity.current.x,
      worldMove.x * MOVE_SPEED,
      ACCEL * delta
    );
    velocity.current.z = THREE.MathUtils.lerp(
      velocity.current.z,
      worldMove.z * MOVE_SPEED,
      ACCEL * delta
    );

    // apply horizontal velocity
    camera.position.x += velocity.current.x * delta;
    camera.position.z += velocity.current.z * delta;

    // 5. Jumping

    const isOnGround = velocity.current.y === 0;

    if (isOnGround && keys.current.space) {
      velocity.current.y = JUMP_FORCE;
    }

    // movement Range:
    const MIN_X = -82;
    const MAX_X =  82;
    const MIN_Z = -81;
    const MAX_Z =  88;

    // Clamp the position
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, MIN_X, MAX_X);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, MIN_Z, MAX_Z);
  });

  return null; // Hook doesn't render anything
}
