import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const BurgerModel = () => {
  const { scene } = useGLTF("/burger_low_poly/burger.gltf");
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return <primitive object={clonedScene} />;
};

const Burger = ({ position, speed, initialRotation, onFall }) => {
  const ref = useRef();

  useFrame((state, delta) => {
    if (ref.current) {
      // Apply falling motion
      ref.current.position.y -= speed * delta;

      // Apply rotation (randomized axis with initial rotation)
      ref.current.rotation.x += delta * initialRotation.x;
      ref.current.rotation.y += delta * initialRotation.y;
      ref.current.rotation.z += delta * initialRotation.z;

      // Check if the burger has fallen out of view
      if (ref.current.position.y < -25) {
        onFall();
      }
    }
  });

  return (
    <group ref={ref} position={position}>
      <BurgerModel />
    </group>
  );
};

function App() {
  const [burgers, setBurgers] = useState([]);

  const generateId = () => `${Date.now()}-${Math.random()}`;

  const getRandomPosition = () => {
    return [
      (Math.random() - 0.5) * 50,
      Math.random() * 10 + 20,
      (Math.random() - 0.5) * 50,
    ];
  };

  const getRandomRotation = () => {
    return {
      x: Math.random() * 0.5,
      y: Math.random() * 0.5,
      z: Math.random() * 0.5,
    };
  };

  const spawnBurger = () => {
    const newBurger = {
      id: generateId(),
      position: getRandomPosition(),
      speed: Math.random() * 4 + 1,
      initialRotation: getRandomRotation(),
    };
    setBurgers((prev) => [...prev, newBurger]);
  };

  const removeBurger = (id) => {
    setBurgers((prev) => prev.filter((burger) => burger.id !== id));
    spawnBurger();
  };

  useEffect(() => {
    const initialBurgers = Array.from({ length: 100 }, () => ({
      id: generateId(),
      position: getRandomPosition(),
      speed: Math.random() * 4 + 1,
      initialRotation: getRandomRotation(),
    }));
    setBurgers(initialBurgers);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 25, 40], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 30, 10]} intensity={1} castShadow />
          {burgers.map((burger) => (
            <Burger
              key={burger.id}
              position={burger.position}
              speed={burger.speed}
              initialRotation={burger.initialRotation}
              onFall={() => removeBurger(burger.id)}
            />
          ))}
        </Suspense>
      </Canvas>
      {/* Bottom-left link */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <a
          href="https://sketchfab.com/3d-models/burger-low-poly-bc88f1776b2c4893b487c78fa312b0fe"
          style={{ color: "white", textDecoration: "none" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          3D Model
        </a>
      </div>
    </div>
  );
}

export default App;
