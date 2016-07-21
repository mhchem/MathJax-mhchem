# MathJax/mhchem Extension

mhchem is a 3rd-party extension to MathJax for typesetting chemical equations.


## Usage

    \ce{CO2 + C -> 2 CO}


## Manual

[The manual (including a live test drive)](https://mhchem.github.io/MathJax-mhchem/)


## Using the MathJax CDN

The easiest way to use mhchem 3.0.1 is to wait a few weeks for MathJax 2.7.0 and then follow the—then updated—instructions at the [official MathJax Documentation](http://docs.mathjax.org/en/latest/tex.html#mhchem)


## Changes (when compared to 2.6.0)

- Complete rewrite of syntax parser
- Staggered layout for charges (IUPAC style)
- Improved spacing and space handling: 1/2 X^{2-} v, $n-1$ H^3HO(g), ^{22,98}_{11}Na, ...
- Decimal amounts: 0.5 H2O, 0,5 H2O
- Advanced charge/bond/hyphen distinction: OH-(aq), \mu-Cl, -H- ...
- Decimal and negative superscripts/subscripts: ^0_-1n-, ^{22.98}_{11}Na
- Superscript electrons: OCO^{.-}
- IUPAC fraction style: (1/2)H2O
- Auto-italic variables: n H2O, nH2O, NO_x, but pH
- Improved scanning: Fe^n+, X_\alpha, NO_$x$, $\alpha$$a$, ...
- Some unicode input, e.g. arrows
- {text} text escape
- \bond{3}
- Arrow arguments now parsed as \ce: A ->[H2O] B, A ->[$x$] B
- <--> arrow
- More opeators: A + B = C - D, \pm
- Recursion works (\ce inside \ce)
- Removed hardly used synonyms \cf, \cee and command \hyphen
- Excited state: X^*
- Ellipsis vs bond: A...A, B...B, ...
- Punctuation: , ;
- Dissociation constant: pKa
- Orbitals: sp^2, s^{0.5}p^3-N
- Kroeger-Vink notation
- Better-looking Fast-HTML rendering: \ce{A + _{a}X}
- Many other things
- Side-effects for non-standard input


## GitHub Contributions

The [MathJax third party extension repository](https://github.com/mathjax/MathJax-third-party-extensions) is just a mirror. If you want to contribute (open an issue, for instance), please do it at https://github.com/mhchem/MathJax-mhchem/
