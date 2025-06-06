# @shiueo/react-katex

A React component for rendering LaTeX math expressions using KaTeX.

[![NPM Version](https://img.shields.io/npm/v/@shiueo/react-katex)](https://www.npmjs.com/package/@shiueo/react-katex)
[![Build Status](https://img.shields.io/github/actions/workflow/status/shiueo/react-katex/build-test.yml?branch=main)](https://github.com/shiueo/react-katex/actions?query=branch%3Amain)


## Installation

To install the package, run:

```bash
npm install @shiueo/react-katex
```

## Usage
```tsx
// Import KaTeX CSS once in your project, before using this component
import 'katex/dist/katex.min.css'

import KaTeXComponent from '@shiueo/react-katex';
```
Then use the component in your application:
```tsx
<KaTeXComponent block={true} math="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
```
### Advanced Usage
The component accepts several props to customize its behavior:

- `math: string` The LaTeX string to render.

- `block?: boolean` A boolean indicating whether to render as a block-level element (default: false).

- `renderError?: (error: ParseError | TypeError) => ReactElement`: A function to handle errors during parsing (optional).

- `settings?: KatexOptions`: Custom settings for KaTeX rendering (optional).

- `as?: ElementType`: The component type to render (default: span for inline, div for block-level).

> 💡 **Example usage:** See [nextjs/page.tsx](./demo/nextjs/src/app/page.tsx) for comprehensive examples.  

### Features
- Optimized rendering: The component now utilizes useMemo to cache rendering options, improving performance by preventing unnecessary recalculations on each render.

## Changelog
See [CHANGELOG.md](./CHANGELOG.md) for a list of changes and version history.

## License
MIT License. See [LICENSE](./LICENSE) for more details.