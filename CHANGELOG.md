# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-04-24

### Changed
- Readme updated.


## [1.0.1] - 2025-04-24

### Changed
- Removed accidentally included `demo` folder from the published package.
- Optimized `package.json` by specifying only essential files in the `files` field, significantly reducing the package size.


## [1.0.0] - 2025-04-24

### Added
- Initial release of `@shiueo/react-katex`.
- Basic rendering of KaTeX math expressions.
- Support for inline (`span`) and block (`div`) math.
- Optional settings via `KaTeXOptions`.


## [Unreleased]

### Added
- Support for `as` prop to customize rendered element.
- Error rendering via `renderError` prop.

### Changed
- Internal refactoring of component to use discriminated union state.
- Switched to `useMemo` for render options optimization.