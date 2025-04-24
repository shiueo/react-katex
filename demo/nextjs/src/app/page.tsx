import React from 'react'
import KaTeXComponent from 'react-katex'

const Home = () => {
  return (
    <div>
      <h1>KaTeX Demo</h1>
      <KaTeXComponent math="\\frac{a}{b}" />
    </div>
  )
}

export default Home
