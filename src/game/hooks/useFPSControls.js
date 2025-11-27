/*
  useFPSControls
  ---------------------------------------------
  A custom React Three Fiber hook that adds basic
  FPS-style movement to the active camera using the
  W/A/S/D keys.
 
  HOW THE HOOK WORKS (step-by-step):
 
  1. Accessing the Camera
     ---------------------
     R3F's useThree() gives us the current scene's camera.
     All movement updates are applied directly to camera.position.
 
       const { camera } = useThree();
 
 
  2. Tracking Key States with useRef
     --------------------------------
     keysRef holds an object (e.g. { w: true, a: false, ... })
     indicating which keys are currently pressed.
 
     Why useRef instead of useState?
     - useState would trigger re-renders every time a key changes.
     - Movement needs to run every frame without re-render overhead.
     - useRef updates instantly and is readable inside useFrame().
 
       const keysRef = useRef({});
 
 
  3. Keyboard Event Listeners (useEffect)
     -------------------------------------
     We attach keydown/keyup listeners once when the hook mounts.
     On each key event:
       - the key is converted to lowercase (consistent)
       - the ref is updated (true for pressed, false for released)
 
     Arrow keys and space have preventDefault() to stop the page
     from scrolling when moving.
 
     Listeners are cleaned up to avoid memory leaks.
 
       window.addEventListener("keydown", down);
       window.addEventListener("keyup", up);
 
 
  4. Movement Logic (useFrame)
     --------------------------
     useFrame runs once per rendered frame (like requestAnimationFrame),
     making it perfect for real-time movement.
 
     MOVEMENT CALCULATION:
     ---------------------
     - We fetch the camera’s current forward direction using:
         camera.getWorldDirection(vector)
     - Then we zero out the Y axis (forward.y = 0) so the player
       doesn't move up/down when looking around.
     - This gives a "flat" forward direction along the ground.
 
     RIGHT VECTOR:
     - The right direction is calculated using a cross product:
 
         right = forward x up
 
     This gives a vector pointing directly to the player’s right.
 
     NORMALIZATION:
     - Both vectors are normalized to always have a length of 1.
 
     MOVING THE CAMERA:
     - Movement speed is multiplied by `delta` to make movement
       frame-rate independent (always the same speed on all devices).
 
       moveSpeed = speed * delta
 
     - W → move forward
     - S → move backward
     - A → strafe left
     - D → strafe right
 
       camera.position.addScaledVector(forward, moveSpeed);
 
 
  5. Why Movement Uses Vectors (not manual x/z updates)
     ---------------------------------------------------
     Camera movement depends on the direction the player is facing.
     Updating camera.position.x/z manually would not follow the
     camera's rotation.
 
     Using vectors ensures:
     - forward movement moves "forward" no matter the rotation
     - strafing always moves sideways relative to the camera direction
 
 
  6. Configurable Speed
     -------------------
     The hook accepts a speed option:
 
       useFPSControls({ speed: 8 })
 
     Speed is interpreted as "units per second".
 
 
  WHAT THIS HOOK PROVIDES:
     - Smooth WASD movement
     - Camera-facing movement direction
     - No re-renders on key press
     - Frame-based updates for game-like feel
     - Clean event listener lifecycle
 
  WHAT IT DOES NOT HANDLE (but can be added):
     - Mouse look (PointerLockControls)
     - Jumping / gravity
     - Collision detection
     - Sprinting / crouching
 
 */




import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function useFPSControls({ speed = 5 } = {}) {
  const { camera } = useThree();
  const keysRef = useRef({});

  useEffect(() => {
    const down = (e) => {
      // optionally prevent arrows/space default scrolling
      if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const up = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((state, delta) => {
    const keys = keysRef.current;

    // get forward/right vectors relative to camera (flat, y=0)
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize(); // right vector

    const moveSpeed = speed * delta; // units per second

    if (keys["w"]) camera.position.addScaledVector(forward, moveSpeed);
    if (keys["s"]) camera.position.addScaledVector(forward, -moveSpeed);
    if (keys["a"]) camera.position.addScaledVector(right, -moveSpeed);
    if (keys["d"]) camera.position.addScaledVector(right, moveSpeed);
  });

  return null;
}
