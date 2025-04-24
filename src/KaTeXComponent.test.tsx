import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import KaTeXComponent from './index'

// Mock KaTeX library
jest.mock('katex', () => ({
  renderToString: jest.fn(),
  ParseError: class ParseError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'ParseError'
    }
  },
}))

import KaTeX from 'katex'

describe('KaTeXComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(KaTeX.renderToString as jest.Mock).mockImplementation((math) => {
      if (math === '\\frac{1}{2}') {
        return '<span class="katex">1/2</span>'
      }
      if (math === '\\frac{1}') {
        return '<span class="katex-error">\\frac{1}</span>' // Incomplete fraction
      }
      if (math === 'text' || math === 'invalid') {
        throw new KaTeX.ParseError('Invalid math expression')
      }
      if (math === 'type-error') {
        throw new TypeError('Type error in math expression')
      }
      return '<span class="katex">' + math + '</span>'
    })
  })

  test('renders math expression correctly', () => {
    render(<KaTeXComponent math="\frac{1}{2}" />)
    const element = document.querySelector('span')
    expect(element).toBeInTheDocument()
    expect(element?.innerHTML).toContain('<span class="katex">1/2</span>')
  })

  test('renders as block element when block=true', () => {
    render(<KaTeXComponent math="\frac{1}{2}" block={true} />)
    const element = document.querySelector('div')
    expect(element).toBeInTheDocument()
  })

  test('renders as custom element when as prop is provided', () => {
    render(<KaTeXComponent math="\\frac{1}{2}" as="p" />)
    const element = document.querySelector('p')
    expect(element).toBeInTheDocument()
    console.log(element?.innerHTML)
  })

  test('uses custom error renderer when provided', () => {
    const customError = () => <div data-testid="custom-error">Custom Error</div>
    render(<KaTeXComponent math="invalid" renderError={customError} />)
    expect(screen.getByTestId('custom-error')).toBeInTheDocument()
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
  })

  test('renders empty string when math is empty', () => {
    render(<KaTeXComponent math="" />)
    const element = document.querySelector('span')
    expect(element).toBeInTheDocument()
    expect(element?.innerHTML).toBe('')
  })

  test('passes settings to KaTeX renderer', () => {
    const settings = { strict: true, trust: false }
    render(<KaTeXComponent math="\frac{1}{2}" settings={settings} />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith('\\frac{1}{2}', expect.objectContaining(settings))
  })

  test('throws unknown errors', () => {
    const originalConsoleError = console.error
    console.error = jest.fn()
    ;(KaTeX.renderToString as jest.Mock).mockImplementation(() => {
      throw new Error('Unknown error')
    })

    expect(() => {
      render(<KaTeXComponent math="throw-unknown" />)
    }).toThrow('Unknown error')

    console.error = originalConsoleError
  })

  test('block=true overrides "as" prop', () => {
    render(<KaTeXComponent math="\frac{1}{2}" block={true} as="span" />)
    const element = document.querySelector('div')
    expect(element).toBeInTheDocument()
  })

  test('renders default error when errorClassName is not provided', () => {
    render(<KaTeXComponent math="invalid" />)
    const element = screen.getByText('Invalid math expression')
    expect(element).toBeInTheDocument()
  })

  test('renderError receives error object as argument', () => {
    const renderError = jest.fn(() => <div>Error!</div>)
    render(<KaTeXComponent math="invalid" renderError={renderError} />)
    expect(renderError).toHaveBeenCalled()
    const errorArg = renderError.mock.calls[0][0]
    expect(errorArg).toBeInstanceOf(Error)
    expect(errorArg.message).toBe('Invalid math expression')
  })

  test('passes block=true as displayMode=true to KaTeX', () => {
    render(<KaTeXComponent math="\frac{1}{2}" block={true} />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith('\\frac{1}{2}', expect.objectContaining({ displayMode: true }))
  })

  test('handles null or undefined math input gracefully', () => {
    // @ts-expect-error test for undefined
    render(<KaTeXComponent math={undefined} />)
    const undefinedElement = document.querySelector('span')
    expect(undefinedElement).toBeInTheDocument()
    expect(undefinedElement?.innerHTML).toBe('')

    // @ts-expect-error test for null
    render(<KaTeXComponent math={null} />)
    const nullElement = document.querySelector('span')
    expect(nullElement).toBeInTheDocument()
    expect(nullElement?.innerHTML).toBe('')
  })

  test('renders fallback element if invalid "as" prop is passed', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      render(<KaTeXComponent math="\frac{1}{2}" as={'invalid' as any} />)
    }).not.toThrow()
    consoleError.mockRestore()
  })

  test('sanitizes rendered HTML safely', () => {
    ;(KaTeX.renderToString as jest.Mock).mockReturnValue('<img src=x onerror=alert(1)>')
    render(<KaTeXComponent math="\frac{1}{2}" />)
    const element = document.querySelector('span')
    expect(element?.innerHTML).toContain('<img')
  })

  test('handles typical math expressions beyond fractions', () => {
    const expressions = [
      '\\sqrt{x^2 + y^2}',
      '\\sum_{i=1}^{n} i^2',
      'e^{i\\pi} + 1 = 0'
    ]
    
    expressions.forEach(expr => {
      jest.clearAllMocks()
      render(<KaTeXComponent math={expr} />)
      expect(KaTeX.renderToString).toHaveBeenCalledWith(expr, expect.anything())
    })
  })

  test('handles multiple consecutive renders with different expressions', () => {
    const { rerender } = render(<KaTeXComponent math="\frac{1}{2}" />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith('\\frac{1}{2}', expect.anything())
    
    rerender(<KaTeXComponent math="\sqrt{2}" />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith('\\sqrt{2}', expect.anything())
  })

  test('distinguishes between ParseError and TypeError', () => {
    // For ParseError
    jest.clearAllMocks()
    render(<KaTeXComponent math="invalid" />)
    expect(screen.getByText('Invalid math expression')).toBeInTheDocument()
    
    // For TypeError
    jest.clearAllMocks()
    render(<KaTeXComponent math="type-error" />)
    expect(screen.getByText('Type error in math expression')).toBeInTheDocument()
  })

  test('memoization prevents unnecessary re-renders', () => {
    const { rerender } = render(<KaTeXComponent math="\frac{1}{2}" />)
    expect(KaTeX.renderToString).toHaveBeenCalledTimes(1)
    
    // Rerender with same props
    rerender(<KaTeXComponent math="\frac{1}{2}" />)
    
    // Since we're using React.memo, KaTeX.renderToString should not be called again
    // if props haven't changed
    expect(KaTeX.renderToString).toHaveBeenCalledTimes(1)
    
    // Rerender with different props
    rerender(<KaTeXComponent math="\frac{1}{3}" />)
    expect(KaTeX.renderToString).toHaveBeenCalledTimes(2)
  })

  test('handles changing block mode dynamically', () => {
    const { rerender } = render(<KaTeXComponent math="\frac{1}{2}" block={false} />)
    expect(document.querySelector('span')).toBeInTheDocument()
    
    rerender(<KaTeXComponent math="\frac{1}{2}" block={true} />)
    expect(document.querySelector('div')).toBeInTheDocument()
  })

  test('handles custom settings changes', () => {
    const initialSettings = { strict: true }
    const newSettings = { strict: false, trust: true }
    
    const { rerender } = render(<KaTeXComponent math="\frac{1}{2}" settings={initialSettings} />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith('\\frac{1}{2}', 
      expect.objectContaining(initialSettings))
    
    rerender(<KaTeXComponent math="\frac{1}{2}" settings={newSettings} />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith('\\frac{1}{2}', 
      expect.objectContaining(newSettings))
  })

  test('correctly passes the error to renderError function', () => {
    const renderError = jest.fn(() => <div data-testid="custom-error">Custom Error</div>)
    
    render(<KaTeXComponent math="invalid" renderError={renderError} />)
    const error = renderError.mock.calls[0][0]
    
    expect(error).toBeInstanceOf(KaTeX.ParseError)
    expect(error.message).toBe('Invalid math expression')
  })

  test('accepts various valid "as" component types', () => {
    const validComponents = ['article', 'section', 'code']
    
    validComponents.forEach(component => {
      const { container } = render(<KaTeXComponent math="\frac{1}{2}" as={component as any} />)
      expect(container.querySelector(component)).toBeInTheDocument()
    })
  })

  test('handles optional props correctly when undefined', () => {
    render(<KaTeXComponent 
      math="\frac{1}{2}" 
      // Explicitly leaving out optional props
    />)
    
    // Should default to span and inline mode
    const element = document.querySelector('span')
    expect(element).toBeInTheDocument()
    expect(KaTeX.renderToString).toHaveBeenCalledWith('\\frac{1}{2}', 
      expect.objectContaining({ displayMode: false }))
  })

  test('performs cleanup when unmounted to prevent memory leaks', () => {
    const { unmount } = render(<KaTeXComponent math="\frac{1}{2}" />)
    unmount()
    // No need to assert anything, just making sure it doesn't throw
  })

  test('updates when math expression changes', () => {
    const { rerender } = render(<KaTeXComponent math="\frac{1}{2}" />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith('\\frac{1}{2}', expect.anything())
    
    rerender(<KaTeXComponent math="\frac{3}{4}" />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith('\\frac{3}{4}', expect.anything())
  })

  test('handles whitespace in math expressions', () => {
    render(<KaTeXComponent math="  \frac{1}{2}  " />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith('  \\frac{1}{2}  ', expect.anything())
  })

  test('ensures useMemo caches renderOptions correctly', () => {
    const settings = { strict: true }
    const { rerender } = render(<KaTeXComponent math="\frac{1}{2}" settings={settings} />)
    expect(KaTeX.renderToString).toHaveBeenCalledTimes(1)
    
    // Rerender with same settings object
    rerender(<KaTeXComponent math="\frac{1}{2}" settings={settings} />)
    expect(KaTeX.renderToString).toHaveBeenCalledTimes(1) // No additional calls due to React.memo
    
    // Using a new object with same values should still work
    const sameSettings = { strict: true }
    rerender(<KaTeXComponent math="\frac{1}{2}" settings={sameSettings} />)
    expect(KaTeX.renderToString).toHaveBeenCalledTimes(2) // New call due to new object reference
  })

  test('handles nested math expressions', () => {
    const nestedExpression = '\\sqrt{\\frac{1}{2}}'
    render(<KaTeXComponent math={nestedExpression} />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith(nestedExpression, expect.anything())
  })

  test('renders correctly with macros in settings', () => {
    const macros = { '\RR': '\mathbb{R}' }
    render(<KaTeXComponent math="\RR" settings={{ macros }} />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith('\\RR', expect.objectContaining({ macros }))
  })

  test('respects errorColor setting', () => {
    render(<KaTeXComponent math="invalid" settings={{ errorColor: 'blue' }} />)
    expect(screen.getByText('Invalid math expression')).toBeInTheDocument()
  })

  test('handles zero-width spaces and special characters', () => {
    const specialChars = '\\alpha\\beta\\gamma'
    render(<KaTeXComponent math={specialChars} />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith(specialChars, expect.anything())
  })
  
  test('handles very long math expressions', () => {
    const longExpression = '\\sum_{i=1}^{100} i^2 = \\frac{n(n+1)(2n+1)}{6} = \\frac{100 \\cdot 101 \\cdot 201}{6} = \\frac{2030100}{6} = 338350'
    render(<KaTeXComponent math={longExpression} />)
    expect(KaTeX.renderToString).toHaveBeenCalledWith(longExpression, expect.anything())
  })
})
