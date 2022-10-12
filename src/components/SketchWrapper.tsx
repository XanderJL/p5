import { Box } from '@chakra-ui/react'
import { SketchProps } from '@react-p5/core'
import useGetOs from 'hooks/useGetOs'
import dynamic from 'next/dynamic'
import { RENDERER } from 'p5'
import { ComponentClass, FC, useRef } from 'react'
import {
  ColorValue,
  KeyPressed,
  MouseClicked,
  P5,
  P5Function,
  Setup,
  WindowResized,
} from 'types/CustomP5'
import {
  keyPressedDefaults,
  setupDefaults,
  windowResizedDefaults,
} from 'util/defaults'

import UI, { UIValue } from './UI'

export interface SketchWrapperProps
  extends Omit<SketchProps, 'keyPressed' | 'mouseClicked' | 'setup'> {
  setup?: Setup
  keyPressed?: KeyPressed
  mouseClicked?: MouseClicked
  windowResized?: WindowResized
  suffix?: string | number
  padding?: number[]
  width?: number
  height?: number
  dimensions?: number[]
  renderer?: RENDERER
  background?: ColorValue
  pixelDensity?: number
  seed?: number
  renderSVG?: boolean
  enableUI?: boolean
  UIValues?: UIValue[]
  noLoop?: boolean
}

const Sketch = dynamic<SketchWrapperProps>(
  () =>
    import('@react-p5/core').then(mod => {
      require('p5.js-svg')

      return mod.default
    }) as Promise<ComponentClass<SketchWrapperProps, any>>,
  {
    ssr: false,
  }
)

const SketchWrapper: FC<SketchWrapperProps> = ({
  setup,
  draw,
  windowResized,
  keyPressed,
  mouseClicked,
  suffix,
  padding,
  width,
  height,
  dimensions,
  renderer,
  background,
  pixelDensity,
  seed,
  renderSVG,
  enableUI,
  UIValues,
  noLoop = false,
  ...rest
}) => {
  const os = useGetOs()
  const uiRef = useRef<HTMLDivElement>(null)

  const defaultSetup: Setup = (p5, canvasParentRef) => {
    setupDefaults({
      p5,
      canvasParentRef,
      width,
      height,
      dimensions,
      background,
      padding,
      renderer,
      renderSVG,
      seed,
      pixelDensity,
    })
    setup && setup(p5, canvasParentRef)
  }

  const defaultDraw: P5Function = p5 => {
    if (typeof seed !== 'undefined') {
      p5.noiseSeed(seed)
      p5.randomSeed(seed)
    }

    noLoop && p5.noLoop()

    draw && draw(p5)
  }

  const defaultWindowResized = (p5: P5) => {
    windowResizedDefaults({
      p5,
      width,
      height,
      dimensions,
      padding,
      background,
      seed,
      noLoop,
    })

    windowResized && windowResized(p5)
  }

  const date = new Date().toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const fileName = date + (suffix ? `-${suffix}` : '')

  const defaultKeyPressed: KeyPressed = (p5, event) => {
    keyPressedDefaults({
      p5,
      event,
      os,
      fileName,
      seed,
      width,
      dimensions,
      background,
      renderSVG,
      noLoop,
    })

    keyPressed && keyPressed(p5, event)
  }

  return (
    <>
      {UIValues?.length && <UI ref={uiRef} values={UIValues} noLoop={noLoop} />}
      <Box
        css={{
          '.canvas-wrapper': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            minHeight: '100vh',
          },
          '.p5Canvas': {
            boxShadow: '1px 3px 6px -1px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Sketch
          className='canvas-wrapper'
          setup={defaultSetup}
          draw={defaultDraw}
          windowResized={defaultWindowResized}
          keyPressed={defaultKeyPressed}
          noLoop={noLoop}
          {...rest}
        />
      </Box>
    </>
  )
}

export default SketchWrapper
