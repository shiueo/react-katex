import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import KaTeXComponent from './index';

// Since your actual component imports KaTeX, we need to mock it
jest.mock('katex', () => {
  // Create mock error classes that match the KaTeX error structure
  class MockParseError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ParseError';
    }
  }
  
  class MockTypeError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'TypeError';
    }
  }

  return {
    renderToString: jest.fn(),
    ParseError: MockParseError,
    TypeError: MockTypeError
  };
});

// Import the mocked module
import KaTeX from 'katex';

describe('KaTeXComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders math expression correctly', () => {
    const mockHtml = '<span class="katex">rendered math</span>';
    jest.mocked(KaTeX.renderToString).mockReturnValue(mockHtml);
    
    const { container } = render(<KaTeXComponent math="x^2" />);
    
    expect(KaTeX.renderToString).toHaveBeenCalledWith('x^2', expect.objectContaining({
      displayMode: false,
      errorColor: 'red',
      throwOnError: false
    }));
    expect(container.innerHTML).toContain(mockHtml);
    expect((container.firstChild as Element)?.tagName).toBe('SPAN');
  });

  it('renders in block mode with div element', () => {
    const mockHtml = '<div class="katex-display">rendered math</div>';
    jest.mocked(KaTeX.renderToString).mockReturnValue(mockHtml);
    
    const { container } = render(<KaTeXComponent math="x^2" block={true} />);
    
    expect(KaTeX.renderToString).toHaveBeenCalledWith('x^2', expect.objectContaining({
      displayMode: true
    }));
    expect((container.firstChild as Element)?.tagName).toBe('DIV');
  });

  it('uses custom component when "as" prop is provided', () => {
    const mockHtml = '<span class="katex">rendered math</span>';
    jest.mocked(KaTeX.renderToString).mockReturnValue(mockHtml);
    
    const { container } = render(<KaTeXComponent math="x^2" as="p" />);
    
    expect((container.firstChild as Element)?.tagName).toBe('P');
  });

  it('passes custom settings to KaTeX', () => {
    const customSettings = { macros: { '\\RR': '\\mathbb{R}' } };
    jest.mocked(KaTeX.renderToString).mockReturnValue('<span>rendered with custom settings</span>');
    
    render(<KaTeXComponent math="\RR" settings={customSettings} />);
    
    expect(KaTeX.renderToString).toHaveBeenCalledWith('\\RR', expect.objectContaining({
      macros: { '\\RR': '\\mathbb{R}' }
    }));
  });

  it('renders empty when math prop is empty', () => {
    const { container } = render(<KaTeXComponent math="" />);
    
    expect(KaTeX.renderToString).not.toHaveBeenCalled();
    expect(container.innerHTML).toBe('<span></span>');
  });

  it('handles KaTeX errors with default error display', () => {
    const errorMessage = 'KaTeX parse error: Invalid math syntax';
    const mockError = new KaTeX.ParseError(errorMessage);
    
    jest.mocked(KaTeX.renderToString).mockImplementation(() => {
      throw mockError;
    });
    
    const { container } = render(<KaTeXComponent math="\\invalid" />);
    
    expect(container.innerHTML).toContain(errorMessage);
  });

  it('uses custom error renderer when provided', () => {
    const mockError = new KaTeX.ParseError('Some error');
    
    jest.mocked(KaTeX.renderToString).mockImplementation(() => {
      throw mockError;
    });
    
    const customErrorRenderer = (error: any) => (
      <div data-testid="custom-error">Custom: {error.message}</div>
    );
    
    render(
      <KaTeXComponent 
        math="\\invalid" 
        renderError={customErrorRenderer}
      />
    );
    
    expect(screen.getByTestId('custom-error')).toBeInTheDocument();
    expect(screen.getByTestId('custom-error')).toHaveTextContent('Custom: Some error');
  });

  it('throws non-KaTeX errors', () => {
    const randomError = new Error('Unexpected error');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    jest.mocked(KaTeX.renderToString).mockImplementation(() => {
      throw randomError;
    });
    
    expect(() => {
      render(<KaTeXComponent math="x^2" />);
    }).toThrow('Unexpected error');
    
    consoleSpy.mockRestore();
  });

  it('sets throwOnError option when renderError is provided', () => {
    jest.mocked(KaTeX.renderToString).mockReturnValue('<span>rendered math</span>');
    
    render(<KaTeXComponent math="x^2" renderError={() => <div>Error</div>} />);
    
    expect(KaTeX.renderToString).toHaveBeenCalledWith('x^2', expect.objectContaining({
      throwOnError: true
    }));
  });

  it('memoizes rendering to prevent unnecessary updates', () => {
    jest.mocked(KaTeX.renderToString).mockReturnValue('<span>rendered math</span>');
    
    const { rerender } = render(<KaTeXComponent math="x^2" />);
    expect(KaTeX.renderToString).toHaveBeenCalledTimes(1);
    
    // Rerender with same props
    rerender(<KaTeXComponent math="x^2" />);
    
    // Should not call renderToString again with the same props
    expect(KaTeX.renderToString).toHaveBeenCalledTimes(1);
    
    // Change props
    rerender(<KaTeXComponent math="y^2" />);
    
    // Should call renderToString again with new props
    expect(KaTeX.renderToString).toHaveBeenCalledTimes(2);
  });
});