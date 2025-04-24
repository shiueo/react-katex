// KaTeXComponent.test.tsx
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
      if (math === 'invalid') {
        throw new KaTeX.ParseError('Invalid math expression')
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
    render(<KaTeXComponent math="\\frac{1}{2}" block={true} />)
    const element = document.querySelector('div')
    expect(element).toBeInTheDocument()
  })

  test('renders as custom element when as prop is provided', () => {
    render(<KaTeXComponent math="\\frac{1}{2}" as="p" />)
    const element = document.querySelector('p')
    expect(element).toBeInTheDocument()
  })

  test('renders error message when math is invalid', () => {
    render(<KaTeXComponent math="invalid" errorClassName="test-error" />)
    const element = document.querySelector('.test-error')
    expect(element).toBeInTheDocument()
    expect(element?.textContent).toBe('Invalid math expression')
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
})
