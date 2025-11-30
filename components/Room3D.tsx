import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { DesignPalette, RoomDimensions, RoomType, LightingConfig } from '../types';

interface Room3DProps {
  dimensions: RoomDimensions;
  palette: DesignPalette;
  roomType: RoomType;
  lighting?: LightingConfig;
}

// --- Primitive Furniture Components ---

interface BoxProps {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  castShadow?: boolean;
  receiveShadow?: boolean;
  opacity?: number;
  transparent?: boolean;
}

const Box = ({ position, args, color, castShadow = true, receiveShadow = true, opacity = 1, transparent = false }: BoxProps) => (
  <mesh position={position} castShadow={castShadow} receiveShadow={receiveShadow}>
    <boxGeometry args={args} />
    <meshStandardMaterial color={color} roughness={0.5} opacity={opacity} transparent={transparent} />
  </mesh>
);

const Sofa = ({ position, color, rotation = [0, 0, 0] }: { position: [number, number, number], color: string, rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation as any}>
    {/* Base/Seat */}
    <Box position={[0, 0.25, 0]} args={[2.2, 0.5, 0.8]} color={color} />
    {/* Backrest */}
    <Box position={[0, 0.75, -0.3]} args={[2.2, 0.5, 0.2]} color={color} />
    {/* Armrests */}
    <Box position={[-1.1, 0.4, 0]} args={[0.2, 0.4, 0.8]} color={color} />
    <Box position={[1.1, 0.4, 0]} args={[0.2, 0.4, 0.8]} color={color} />
  </group>
);

const CoffeeTable = ({ position, color }: { position: [number, number, number], color: string }) => (
  <group position={position}>
    <Box position={[0, 0.25, 0]} args={[1.0, 0.05, 0.6]} color={color} />
    {/* Legs */}
    <Box position={[-0.4, 0.125, -0.2]} args={[0.05, 0.25, 0.05]} color="#333" />
    <Box position={[0.4, 0.125, -0.2]} args={[0.05, 0.25, 0.05]} color="#333" />
    <Box position={[-0.4, 0.125, 0.2]} args={[0.05, 0.25, 0.05]} color="#333" />
    <Box position={[0.4, 0.125, 0.2]} args={[0.05, 0.25, 0.05]} color="#333" />
  </group>
);

const Bed = ({ position, color }: { position: [number, number, number], color: string }) => (
  <group position={position}>
    {/* Mattress */}
    <Box position={[0, 0.3, 0]} args={[1.6, 0.3, 2.0]} color="#fff" />
    {/* Frame */}
    <Box position={[0, 0.1, 0]} args={[1.65, 0.2, 2.05]} color={color} />
    {/* Headboard */}
    <Box position={[0, 0.6, -0.95]} args={[1.65, 0.8, 0.1]} color={color} />
  </group>
);

const Nightstand = ({ position, color, rotation = [0, 0, 0] }: { position: [number, number, number], color: string, rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation as any}>
    <Box position={[0, 0.25, 0]} args={[0.5, 0.5, 0.4]} color={color} />
  </group>
);

const Cabinet = ({ position, color, size = [0.6, 0.9, 0.6] }: { position: [number, number, number], color: string, size?: [number, number, number] }) => (
  <group position={position}>
    <Box position={[0, size[1]/2, 0]} args={size} color={color} />
    {/* Handle hint */}
    <Box position={[0, size[1] - 0.1, size[2]/2 + 0.01]} args={[0.1, 0.02, 0.01]} color="#999" />
  </group>
);

const Chair = ({ position, color, rotation = [0, 0, 0] }: { position: [number, number, number], color: string, rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation as any}>
    {/* Seat */}
    <Box position={[0, 0.45, 0]} args={[0.45, 0.05, 0.45]} color={color} />
    {/* Back */}
    <Box position={[0, 0.9, -0.2]} args={[0.45, 0.5, 0.05]} color={color} />
    {/* Legs */}
    <Box position={[-0.2, 0.225, -0.2]} args={[0.04, 0.45, 0.04]} color="#333" />
    <Box position={[0.2, 0.225, -0.2]} args={[0.04, 0.45, 0.04]} color="#333" />
    <Box position={[-0.2, 0.225, 0.2]} args={[0.04, 0.45, 0.04]} color="#333" />
    <Box position={[0.2, 0.225, 0.2]} args={[0.04, 0.45, 0.04]} color="#333" />
  </group>
);

const Desk = ({ position, color }: { position: [number, number, number], color: string }) => (
  <group position={position}>
    <Box position={[0, 0.73, 0]} args={[1.4, 0.04, 0.7]} color={color} />
    <Box position={[-0.6, 0.35, 0]} args={[0.1, 0.7, 0.6]} color={color} />
    <Box position={[0.6, 0.35, 0]} args={[0.1, 0.7, 0.6]} color={color} />
    {/* Back panel */}
    <Box position={[0, 0.5, -0.3]} args={[1.1, 0.4, 0.02]} color={color} />
  </group>
);

const Shower = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
     {/* Tray */}
     <Box position={[0, 0.05, 0]} args={[0.9, 0.1, 0.9]} color="#fff" />
     {/* Glass */}
     <Box position={[0, 1.05, 0.45]} args={[0.9, 2.0, 0.02]} color="#a5f3fc" opacity={0.3} transparent={true} />
     <Box position={[0.45, 1.05, 0]} args={[0.02, 2.0, 0.9]} color="#a5f3fc" opacity={0.3} transparent={true} />
  </group>
);

const Toilet = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
     <Box position={[0, 0.2, 0]} args={[0.35, 0.4, 0.5]} color="#fff" />
     <Box position={[0, 0.7, -0.2]} args={[0.35, 0.3, 0.15]} color="#fff" />
  </group>
);

const Vanity = ({ position, color }: { position: [number, number, number], color: string }) => (
  <group position={position}>
     <Box position={[0, 0.4, 0]} args={[0.8, 0.8, 0.5]} color={color} />
     <Box position={[0, 0.82, 0]} args={[0.85, 0.05, 0.55]} color="#fff" />
  </group>
);

export const Room3D: React.FC<Room3DProps> = ({ dimensions, palette, roomType, lighting = { intensity: 1.2, warmth: 0.1 } }) => {
  const { width, depth } = dimensions;

  // Calculate light color based on warmth (0 = white/cool, 1 = warm/orange)
  const getLightColor = (warmth: number) => {
    // Simple interpolation between white and orange
    const r = 255;
    const g = Math.floor(255 - (warmth * 60)); 
    const b = Math.floor(255 - (warmth * 100)); 
    return `rgb(${r},${g},${b})`;
  };

  const lightColor = getLightColor(lighting.warmth);

  // Room generation logic
  const renderRoomContent = () => {
    switch (roomType) {
      case RoomType.LIVING_ROOM:
        return (
          <>
            <Sofa position={[0, 0, -depth/4]} color={palette.primaryColor} />
            <CoffeeTable position={[0, 0, 0.5]} color={palette.secondaryColor} />
            <Cabinet position={[-width/3, 0, -depth/2 + 0.3]} color={palette.accentColor} />
            <Cabinet position={[width/3, 0, -depth/2 + 0.3]} color={palette.accentColor} />
          </>
        );
      case RoomType.BEDROOM:
        return (
          <>
            <Bed position={[0, 0, -depth/3]} color={palette.primaryColor} />
            <Nightstand position={[-1.1, 0, -depth/3 - 0.5]} color={palette.secondaryColor} />
            <Nightstand position={[1.1, 0, -depth/3 - 0.5]} color={palette.secondaryColor} />
            <Cabinet position={[width/3, 0, 0.5]} color={palette.accentColor} size={[0.8, 1.6, 0.5]} />
          </>
        );
      case RoomType.KITCHEN:
        return (
          <>
             {/* Back Wall Counters */}
            <Cabinet position={[0, 0, -depth/2 + 0.3]} color={palette.primaryColor} size={[width - 0.2, 0.9, 0.6]} />
            {/* Overhead cabinets */}
            <Cabinet position={[0, 1.5, -depth/2 + 0.3]} color={palette.secondaryColor} size={[width - 0.2, 0.6, 0.35]} />
            
            {/* Island logic: Only if width permits */}
            {width > 3.5 && (
               <Cabinet position={[0, 0, 0]} color={palette.accentColor} size={[2.0, 0.9, 0.8]} />
            )}
          </>
        );
      case RoomType.OFFICE:
        return (
          <>
            <Desk position={[0, 0, -depth/3]} color={palette.primaryColor} />
            <Chair position={[0, 0, 0]} color={palette.secondaryColor} rotation={[0, Math.PI, 0]} />
            <Cabinet position={[width/3, 0, -depth/2 + 0.3]} color={palette.accentColor} size={[0.8, 1.8, 0.4]} />
          </>
        );
      case RoomType.BATHROOM:
        return (
          <>
            <Shower position={[-width/3, 0, -depth/2 + 0.5]} />
            <Vanity position={[width/3, 0, -depth/2 + 0.3]} color={palette.primaryColor} />
            <Toilet position={[0, 0, -depth/2 + 0.3]} />
          </>
        );
      default: 
        return null;
    }
  };

  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [4, 5, 5], fov: 50 }}>
        <color attach="background" args={['#f8fafc']} />
        
        {/* Stage handles default lighting, but we can override or add to it. 
            We turn off Stage's preset lighting to use our own for control. */}
        <Stage environment="city" intensity={0.2} shadows={false} adjustCamera={false}>
            {/* Room Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
              <planeGeometry args={[width, depth]} />
              <meshStandardMaterial color={palette.floorColor} />
            </mesh>
            
            {/* Back Wall */}
            <mesh position={[0, 1.4, -depth/2]} receiveShadow>
                <boxGeometry args={[width, 2.8, 0.05]} />
                <meshStandardMaterial color={palette.wallColor} />
            </mesh>
            
            {/* Left Wall */}
            <mesh position={[-width/2, 1.4, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
                <boxGeometry args={[depth, 2.8, 0.05]} />
                <meshStandardMaterial color={palette.wallColor} />
            </mesh>
            
            {renderRoomContent()}
        </Stage>
        
        {/* Custom Lighting Controlled by Props */}
        <ambientLight intensity={lighting.intensity * 0.3} color={lightColor} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={lighting.intensity} 
          color={lightColor}
          castShadow 
        />
        
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
      </Canvas>
    </div>
  );
};