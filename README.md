# mhchem for MathJax, 3.3

mhchem for MathJax is a 3rd-party extension for MathJax, for typesetting chemical equations.


## Usage

    \ce{CO2 + C -> 2 CO}


## Manual

[The manual (including a live test drive)](https://mhchem.github.io/MathJax-mhchem/)


## Using cdnjs

For information on how to load the extension and make the `\ce` command available,
see the [official MathJax docs](http://docs.mathjax.org/en/latest/configuration.html#using-in-line-configuration-options).
In short, use this config:

    MathJax.Ajax.config.path["mhchem"] =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax-mhchem/3.3.2";
    MathJax.Hub.Config({
      TeX: {
        extensions: ["[mhchem]/mhchem.js"]
      }
    });

## Changes of v3.0.x (when compared to v2.6.0 "legacy: true")

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
