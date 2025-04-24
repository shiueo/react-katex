import KaTeXComponent from 'react-katex'

const App = () => {
  return (
    <div className='text-lg mx-auto max-w-4xl'>
      <h1>KaTeX Demo</h1>

      <div className="space-y-4">
        <div>
          <h2>1. Basic Fractions and Integrals</h2>
          <KaTeXComponent block={true} math="\frac{a}{b} \int_1^2 x \, dx" />
        </div>

        <div>
          <h2>2. Derivatives</h2>
          <KaTeXComponent block={true} math="\frac{d}{dx} e^{x^2}" />
          <KaTeXComponent block={true} math="\frac{d}{dx} \sin(x^2 + 1)" />
        </div>

        <div>
          <h2>3. Quadratic Equation</h2>
          <KaTeXComponent block={true} math="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
        </div>

        <div>
          <h2>4. Matrix Example</h2>
          <KaTeXComponent block={true} math="\begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}" />
        </div>

        <div>
          <h2>5. Fourier Series</h2>
          <KaTeXComponent block={true} math="f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \left( a_n \cos(nx) + b_n \sin(nx) \right)" />
        </div>

        <div>
          <h2>6. Limit Example</h2>
          <KaTeXComponent block={true} math="\lim_{x \to 0} \frac{\sin(x)}{x} = 1" />
        </div>

        <div>
          <h2>7. Euler's Formula</h2>
          <KaTeXComponent block={true} math="e^{i\pi} + 1 = 0" />
        </div>

        <div>
          <h2>8. Complex Numbers</h2>
          <KaTeXComponent block={true} math="z = a + bi" />
        </div>

        <div>
          <h2>9. Error Example (Incomplete Fraction)</h2>
          <KaTeXComponent block={true} math="\frac{1" />
        </div>

        <div>
          <h2>10. Error Example (Custom Error Color for Incomplete Fraction)</h2>
          <KaTeXComponent block={true} settings={{ errorColor: '#f46525' }} math="\frac{1" />
        </div>

        <div>
          <h2>11. Error Example (Invalid Math Expression (Text))</h2>
          <KaTeXComponent math="text" />
        </div>
      </div>
    </div>
  )
}

export default App
