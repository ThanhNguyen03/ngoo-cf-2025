'use client'

import { cn } from '@/utils'
import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  FC,
  forwardRef,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import * as THREE from 'three'

type TCursor = {
  x: number
  y: number
}

type TDraggableBottleProps = {
  url: string
  speed?: number
  delta?: TCursor
  isRotate?: boolean
}

const DraggableBottle = forwardRef<THREE.Group, TDraggableBottleProps>(
  ({ url, isRotate, speed = 0.1, delta }, ref) => {
    const { scene } = useGLTF(url)
    const cloned = useMemo(() => scene.clone(), [scene])

    const groupRef = useRef<THREE.Group>(null)
    const velocity = useRef<TCursor>({ x: 0, y: 0 })
    const animating = useRef<boolean>(false)
    const targetRotation = useRef<number>(0)

    useEffect(() => {
      if (typeof ref === 'function') {
        ref(groupRef.current)
      } else if (ref) {
        ;(ref as React.RefObject<THREE.Group | null>).current = groupRef.current
      }
    }, [ref])

    useEffect(() => {
      if (isRotate && groupRef.current) {
        animating.current = true
        targetRotation.current = groupRef.current.rotation.y + Math.PI * 2
      }
    }, [isRotate])

    useFrame(() => {
      const group = groupRef.current
      if (!group) {
        return
      }

      // Animate
      if (animating.current) {
        group.rotation.y += speed
        if (group.rotation.y >= targetRotation.current) {
          group.rotation.y = targetRotation.current % (Math.PI * 2)
          animating.current = false
        }
      }

      // Add drag delta into velocity
      if (delta && !animating.current) {
        velocity.current.x += delta.x
        velocity.current.y += delta.y
        delta.x = 0
        delta.y = 0
      }

      // Apply velocity to rotation
      if (!animating.current) {
        group.rotation.y += velocity.current.x
        group.rotation.x += velocity.current.y
      }

      // Clamp rotation X (up/down tilt)
      group.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, group.rotation.x),
      )

      // Apply damping (ease out)
      velocity.current.x *= 0.8
      velocity.current.y *= 0.4
    })

    return (
      <group ref={groupRef} rotation={[0, -Math.PI / 2, 0]}>
        <primitive
          object={cloned}
          scale={2}
          position={[0, 0, 0]}
          rotation={[0.4, 0, 0]}
        />
      </group>
    )
  },
)

DraggableBottle.displayName = 'DraggableBottle'

type TBottle3DProps = {
  glbUrl: string
  className?: string
  isRotate?: boolean
}

const Bottle3D: FC<TBottle3DProps> = ({ glbUrl, className, isRotate }) => {
  const bottleRef = useRef<THREE.Group>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [lastPos, setLastPos] = useState<TCursor>({ x: 0, y: 0 })
  const deltaRef = useRef<TCursor>({ x: 0, y: 0 })

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) {
      return
    }
    const deltaX = e.clientX - lastPos.x
    const deltaY = e.clientY - lastPos.y
    deltaRef.current.x += deltaX * 0.01
    deltaRef.current.y += deltaY * 0.01
    setLastPos({ x: e.clientX, y: e.clientY })
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    setLastPos({ x: e.clientX, y: e.clientY })
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  return (
    <div className={cn('size-[400px]', className)}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        shadows
        className={cn(
          'pointer-events-none size-full cursor-grab',
          isDragging && 'cursor-grabbing',
        )}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerUp}
      >
        <ambientLight intensity={1} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={3}
          castShadow
          color='white'
        />
        <Suspense fallback={null}>
          <DraggableBottle
            url={glbUrl}
            isRotate={isRotate}
            ref={bottleRef}
            delta={deltaRef.current}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Bottle3D
