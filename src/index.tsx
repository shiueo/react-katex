import React, { ElementType, ReactElement, useEffect, useState, useMemo } from 'react'
import KaTeX, { ParseError, KatexOptions } from 'katex'
import './index.css'

type KatexProps = {
  math: string
  block?: boolean
  errorClassName?: string
  renderError?: (error: ParseError | TypeError) => ReactElement
  settings?: KatexOptions
  as?: ElementType
}

// Discriminated union type for better state management
type KatexState = { type: 'success'; innerHtml: string } | { type: 'error'; element: ReactElement | string }

const KaTeXComponent: React.FC<KatexProps> = ({
  math,
  block = false,
  errorClassName = 'katex-error',
  renderError,
  settings,
  as: Component = block ? 'div' : 'span',
}) => {
  // Cache rendering options with useMemo
  const renderOptions = useMemo(
    () => ({
      displayMode: block,
      throwOnError: !!renderError,
      ...settings,
    }),
    [block, renderError, settings]
  )

  // State with clear type definition
  const [state, setState] = useState<KatexState>({
    type: 'success',
    innerHtml: '',
  })

  useEffect(() => {
    // Early return for empty input
    if (!math) {
      setState({ type: 'success', innerHtml: '' })
      return
    }

    try {
      // Render math expression to HTML string
      const innerHtml = KaTeX.renderToString(math, renderOptions)
      setState({ type: 'success', innerHtml })
    } catch (error) {
      // Handle KaTeX parsing errors
      if (error instanceof ParseError || error instanceof TypeError) {
        if (renderError) {
          // Use custom error renderer if provided
          setState({ type: 'error', element: renderError(error) })
        } else {
          // Default error message
          const errorMessage = `<span class="${errorClassName}">${error.message}</span>`
          setState({ type: 'error', element: errorMessage })
        }
      } else {
        // unknown errors
        throw error
      }
    }
  }, [math, renderOptions, renderError, errorClassName])

  // Rendering logic
  if (state.type === 'error') {
    if (React.isValidElement(state.element)) {
      // Return custom error element
      return state.element
    }
    // Render error message
    return <Component dangerouslySetInnerHTML={{ __html: state.element as string }} />
  }

  // Render successful math expression
  return <Component dangerouslySetInnerHTML={{ __html: state.innerHtml }} />
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(KaTeXComponent)
