'use client'
import React from 'react'
import KaTeXComponent from '@shiueo/react-katex'
import 'katex/dist/katex.min.css'

const Home = () => {
  return (
    <div className='text-lg mx-auto max-w-4xl py-12'>
      <h1 className="text-2xl font-bold mb-6">@shiueo/react-katex Demo</h1>

      <div className="space-y-8">

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
          <h2>10. Error Example (Custom Error Color)</h2>
          <KaTeXComponent block={true} settings={{ errorColor: '#f46525' }} math="\frac{1" />
        </div>

        <div>
          <h2>11. Invalid Math Expression (Text)</h2>
          <KaTeXComponent math="text" />
        </div>

        <div>
          <h2>12. XSS Attempt</h2>
          <KaTeXComponent block={true} math='<script>alert("XSS")</script>' />
        </div>

        <div>
          <h2>13. Blackboard Bold</h2>
          <KaTeXComponent math="\mathbb{R}" />
          <KaTeXComponent math="\mathbb{N}" />
          <KaTeXComponent math="\mathbb{Z}" />
          <KaTeXComponent math="\mathbb{C}" />
        </div>

        <div>
          <h2>14. Subscripts and Superscripts</h2>
          <KaTeXComponent block={true} math="x_i^2 + y_j^3" />
        </div>

        <div>
          <h2>15. Greek Letters</h2>
          <KaTeXComponent block={true} math="\alpha + \beta = \gamma" />
        </div>

        <div>
          <h2>16. Binomial Coefficients</h2>
          <KaTeXComponent block={true} math="\binom{n}{k}" />
        </div>

        <div>
          <h2>17. Text in Math Mode</h2>
          <KaTeXComponent block={true} math="\text{This is inside math mode}" />
        </div>

        <div>
          <h2>18. Multiline Equations</h2>
          <KaTeXComponent block={true} math={String.raw`
\begin{aligned}
a &= b + c \\
d &= e + f
\end{aligned}
`} />
        </div>

        <div>
          <h2>19. Piecewise Function</h2>
          <KaTeXComponent block={true} math={String.raw`
f(x) = \begin{cases}
x^2 & \text{if } x \ge 0 \\
-x & \text{if } x < 0
\end{cases}
`} />
        </div>

        <div>
          <h2>20. Arrows</h2>
          <KaTeXComponent block={true} math="A \rightarrow B \Rightarrow C \leftrightarrow D" />
        </div>

        <div>
          <h2>21. Summation and Products</h2>
          <KaTeXComponent block={true} math="\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}" />
          <KaTeXComponent block={true} math="\prod_{i=1}^{n} i = n!" />
        </div>

        <div>
          <h2>22. Over/Underbraces</h2>
          <KaTeXComponent block={true} math="\overbrace{1+2+\cdots+n}^{\text{n terms}}" />
          <KaTeXComponent block={true} math="\underbrace{a+b+\cdots+z}_{26 \text{ letters}}" />
        </div>

        <div>
          <h2>23. Accents and Vectors</h2>
          <KaTeXComponent block={true} math="\vec{v} = \hat{i} + \hat{j} + \hat{k}" />
          <KaTeXComponent block={true} math="\dot{x}, \ddot{x}, \bar{y}, \tilde{z}" />
        </div>

        <div>
          <h2>24. Colored Math</h2>
          <KaTeXComponent block={true} math="\color{blue}{x^2} + \color{red}{y^2} = \color{green}{z^2}" />
        </div>

        <div>
          <h2>25. Bracket Sizing</h2>
          <KaTeXComponent block={true} math="\left( \frac{a}{b} \right)" />
        </div>

      </div>
    </div>
  )
}

export default Home
