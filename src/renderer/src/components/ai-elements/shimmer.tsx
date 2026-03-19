import type { MotionProps } from 'motion/react'
import type { ComponentType, CSSProperties, JSX } from 'react'

import { cn } from '../../lib/utils'
import { motion } from 'motion/react'
import { memo, useMemo } from 'react'

type MotionHTMLProps = MotionProps & Record<string, unknown>

type MotionTag = keyof JSX.IntrinsicElements
const motionIntrinsic = motion as unknown as Record<MotionTag, ComponentType<MotionHTMLProps>>

export interface TextShimmerProps {
  children: string
  as?: MotionTag
  className?: string
  duration?: number
  spread?: number
}

const ShimmerComponent = ({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2
}: TextShimmerProps) => {
  const MotionComponent = motionIntrinsic[Component] ?? motionIntrinsic.p

  const dynamicSpread = useMemo(() => (children?.length ?? 0) * spread, [children, spread])

  return (
    <MotionComponent
      animate={{ backgroundPosition: '0% center' }}
      className={cn(
        'relative inline-block bg-size-[250%_100%,auto] bg-clip-text text-transparent',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage:
            'var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))'
        } as CSSProperties
      }
      transition={{
        duration,
        ease: 'linear',
        repeat: Number.POSITIVE_INFINITY
      }}
    >
      {children}
    </MotionComponent>
  )
}

export const Shimmer = memo(ShimmerComponent)
