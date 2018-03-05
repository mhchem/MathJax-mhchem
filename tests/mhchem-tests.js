// call with
//   npm test
// wich will invoke the script listed in package.json
//   node node_modules/tape/bin/tape tests/*.js
// which will invoke
//   node tests/mhchem-tests.js
//
// in order to use unpacked file
//   node tests/mhchem-tests.js unpacked

var tape = require('tape');
var vm = require('vm');
var fs = require('fs');
var unpacked = (process.argv[2] == 'unpacked' ? true : false);

/// create dummy MathJax object
var context = {
  MathJax: {
    Extension: [],
    Hub: {
      Register: { StartupHook: function(a,b){ b(); } },
      Startup: { signal: { Post: function(){} } }
    },
    Ajax: { loadComplete: function(){} },
    InputJax: { TeX: {
      Definitions: { Add: function(){} },
      Parse: { Augment: function(){} }
    } },
    Object: { Subclass: function(a){ return a; } }
  }
};

/// load mhchem parser into dummy MathJax
if (unpacked) {
  vm.runInNewContext(fs.readFileSync('./unpacked/mhchem.js'), context);
} else {
  vm.runInNewContext(fs.readFileSync('./mhchem.js'), context);
}
var CE = context.MathJax.Extension['TeX/mhchem'].CE;
var ce = function(a) {
  CE.Init(a);
  return CE.Parse();
}
var pu = function(a) {
  CE.Init(a);
  return CE.Parse('pu');
}

/// create tests
function testCe(input, expected) {
  tape(input, function(t) {
    t.equal(ce(input), expected);
    t.end();
  });
}
function testPu(input, expected) {
  tape(input, function(t) {
    t.equal(pu(input), expected);
    t.end();
  });
}

///
/// test cases from documentation
///

/// Chemical Equations
testCe('CO2 + C -> 2 CO', '{\\mathrm{CO}{\\vphantom{X}}_{\\smash[t]{2}} {}+{} \\mathrm{C} {}\\mathrel{\\longrightarrow}{} 2\\,\\mathrm{CO}}');
testCe('Hg^2+ ->[I-] HgI2 ->[I-] [Hg^{II}I4]^2-', '{\\mathrm{Hg}{\\vphantom{X}}^{2+} {}\\mathrel{\\xrightarrow{\\mathrm{I}{\\vphantom{X}}^{-}}}{} \\mathrm{HgI}{\\vphantom{X}}_{\\smash[t]{2}} {}\\mathrel{\\xrightarrow{\\mathrm{I}{\\vphantom{X}}^{-}}}{} [\\mathrm{Hg}{\\vphantom{X}}^{\\mathrm{II}}\\mathrm{I}{\\vphantom{X}}_{\\smash[t]{4}}]{\\vphantom{X}}^{2-}}');

/// Chemical formulae
testCe('H2O', '{\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');
testCe('Sb2O3', '{\\mathrm{Sb}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}{\\vphantom{X}}_{\\smash[t]{3}}}');

/// Charges
testCe('H+', '{\\mathrm{H}{\\vphantom{X}}^{+}}');
testCe('CrO4^2-', '{\\mathrm{CrO}{\\vphantom{X}}_{\\smash[t]{4}}{\\vphantom{X}}^{2-}}');
testCe('[AgCl2]-', '{[\\mathrm{AgCl}{\\vphantom{X}}_{\\smash[t]{2}}]{\\vphantom{X}}^{-}}');
testCe('Y^99+', '{\\mathrm{Y}{\\vphantom{X}}^{99+}}');
testCe('Y^{99+}', '{\\mathrm{Y}{\\vphantom{X}}^{99+}}');

/// Stoichiometric Numbers
testCe('2 H2O', '{2\\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');
testCe('2H2O', '{2\\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');
testCe('0.5 H2O', '{0.5\\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');
testCe('1/2 H2O', '{\\mathchoice{\\textstyle\\frac{1}{2}}{\\frac{1}{2}}{\\frac{1}{2}}{\\frac{1}{2}}\\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');
testCe('(1/2) H2O', '{(1/2)\\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');
testCe('$n$ H2O', '{n \\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');
testCe('n H2O', '{n\\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');
testCe('nH2O', '{n\\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');
testCe('n/2 H2O', '{\\mathchoice{\\textstyle\\frac{n}{2}}{\\frac{n}{2}}{\\frac{n}{2}}{\\frac{n}{2}}\\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');

/// Isotopes
testCe('^{227}_{90}Th+', '{{\\vphantom{X}}^{\\hphantom{227}}_{\\hphantom{90}}{\\vphantom{X}}^{\\smash[t]{\\vphantom{2}}\\llap{227}}_{\\vphantom{2}\\llap{\\smash[t]{90}}}\\mathrm{Th}{\\vphantom{X}}^{+}}');
testCe('^227_90Th+', '{{\\vphantom{X}}^{\\hphantom{227}}_{\\hphantom{90}}{\\vphantom{X}}^{\\smash[t]{\\vphantom{2}}\\llap{227}}_{\\vphantom{2}\\llap{\\smash[t]{90}}}\\mathrm{Th}{\\vphantom{X}}^{+}}');
testCe('^{0}_{-1}n^{-}', '{{\\vphantom{X}}^{\\hphantom{0}}_{\\hphantom{-1}}{\\vphantom{X}}^{\\smash[t]{\\vphantom{2}}\\llap{0}}_{\\vphantom{2}\\llap{\\smash[t]{-1}}}\\mathrm{n}{\\vphantom{X}}^{-}}');
testCe('^0_-1n-', '{{\\vphantom{X}}^{\\hphantom{0}}_{\\hphantom{-1}}{\\vphantom{X}}^{\\smash[t]{\\vphantom{2}}\\llap{0}}_{\\vphantom{2}\\llap{\\smash[t]{-1}}}\\mathrm{n}{\\vphantom{X}}^{-}}');
testCe('H{}^3HO', '{\\mathrm{H}{\\vphantom{X}}^{\\hphantom{3}}_{\\hphantom{}}{\\vphantom{X}}^{\\smash[t]{\\vphantom{2}}\\llap{3}}_{\\vphantom{2}\\llap{\\smash[t]{}}}\\mathrm{HO}}');
testCe('H^3HO', '{\\mathrm{H}{\\vphantom{X}}^{\\hphantom{3}}_{\\hphantom{}}{\\vphantom{X}}^{\\smash[t]{\\vphantom{2}}\\llap{3}}_{\\vphantom{2}\\llap{\\smash[t]{}}}\\mathrm{HO}}');

/// Reaction Arrows
testCe('A -> B', '{\\mathrm{A} {}\\mathrel{\\longrightarrow}{} \\mathrm{B}}');
testCe('A <- B', '{\\mathrm{A} {}\\mathrel{\\longleftarrow}{} \\mathrm{B}}');
testCe('A <-> B', '{\\mathrm{A} {}\\mathrel{\\longleftrightarrow}{} \\mathrm{B}}');
testCe('A <--> B', '{\\mathrm{A} {}\\mathrel{\\longleftrightarrows}{} \\mathrm{B}}');
testCe('A <=> B', '{\\mathrm{A} {}\\mathrel{\\longrightleftharpoons}{} \\mathrm{B}}');
testCe('A <=>> B', '{\\mathrm{A} {}\\mathrel{\\longRightleftharpoons}{} \\mathrm{B}}');
testCe('A <<=> B', '{\\mathrm{A} {}\\mathrel{\\longLeftrightharpoons}{} \\mathrm{B}}');
testCe('A ->[H2O] B', '{\\mathrm{A} {}\\mathrel{\\xrightarrow{\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}}{} \\mathrm{B}}');
testCe('A ->[{text above}][{text below}] B', '{\\mathrm{A} {}\\mathrel{\\xrightarrow[{{\\text{text below}}}]{{\\text{text above}}}}{} \\mathrm{B}}');
testCe('A ->[$x$][$x_i$] B', '{\\mathrm{A} {}\\mathrel{\\xrightarrow[{x_i }]{x }}{} \\mathrm{B}}');

/// Parentheses, Brackets, Braces
testCe('(NH4)2S', '{(\\mathrm{NH}{\\vphantom{X}}_{\\smash[t]{4}}){\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{S}}');
testCe('[\\{(X2)3\\}2]^3+', '{[\\{(\\mathrm{X}{\\vphantom{X}}_{\\smash[t]{2}}){\\vphantom{X}}_{\\smash[t]{3}}\\}{\\vphantom{X}}_{\\smash[t]{2}}]{\\vphantom{X}}^{3+}}');
testCe('CH4 + 2 $\\left( \\ce{O2 + 79/21 N2} \\right)$', '{\\mathrm{CH}{\\vphantom{X}}_{\\smash[t]{4}} {}+{} 2\\,\\left(  \\mathrm{O}{\\vphantom{X}}_{\\smash[t]{2}} {}+{} \\mathchoice{\\textstyle\\frac{79}{21}}{\\frac{79}{21}}{\\frac{79}{21}}{\\frac{79}{21}}\\,\\mathrm{N}{\\vphantom{X}}_{\\smash[t]{2}} \\right) }');

/// States of Aggregation
testCe('H2(aq)', '{\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mskip2mu (\\mathrm{aq})}');
testCe('CO3^2-_{(aq)}', '{\\mathrm{CO}{\\vphantom{X}}_{\\smash[t]{3}}{\\vphantom{X}}^{2-}{\\vphantom{X}}_{\\smash[t]{\\mskip1mu (\\mathrm{aq})}}}');
testCe('CO3^2-{}_{(aq)}', '{\\mathrm{CO}{\\vphantom{X}}_{\\smash[t]{3}}{\\vphantom{X}}^{2-}{\\vphantom{X}}_{\\smash[t]{\\mskip1mu (\\mathrm{aq})}}}');
testCe('NaOH(aq,$\\infty$)', '{\\mathrm{NaOH}\\mskip2mu (\\mathrm{aq},\\infty )}');

/// Crystal Systems
testCe('ZnS ($c$)', '{\\mathrm{ZnS}\\mskip2mu (c )}');
testCe('ZnS (\\ca$c$)', '{\\mathrm{ZnS}\\mskip2mu ({\\sim}c )}');

/// Variables like __*x*, *n*, 2*n*+1__
testCe('NO_x', '{\\mathrm{NO}{\\vphantom{X}}_{\\smash[t]{x }}}');
testCe('Fe^n+', '{\\mathrm{Fe}{\\vphantom{X}}^{n +}}');
testCe('x Na(NH4)HPO4 ->[\Delta] (NaPO3)_x + x NH3 ^ + x H2O', '{x\\,\\mathrm{Na}(\\mathrm{NH}{\\vphantom{X}}_{\\smash[t]{4}})\\mathrm{HPO}{\\vphantom{X}}_{\\smash[t]{4}} {}\\mathrel{\\xrightarrow{\\mathrm{Delta}}}{} (\\mathrm{NaPO}{\\vphantom{X}}_{\\smash[t]{3}}){\\vphantom{X}}_{\\smash[t]{x }} {}+{} x\\,\\mathrm{NH}{\\vphantom{X}}_{\\smash[t]{3}} \\uparrow{}  {}+{} x\\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');

/// Greek Characters
testCe('\mu-Cl', '{\\mathrm{mu}{-}\\mathrm{Cl}}');
testCe('[Pt(\\eta^2-C2H4)Cl3]-', '{[\\mathrm{Pt}(\\mathrm{\\eta}{\\vphantom{X}}^{2}\\text{-}\\mathrm{C}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{4}})\\mathrm{Cl}{\\vphantom{X}}_{\\smash[t]{3}}]{\\vphantom{X}}^{-}}');
testCe('\\beta +', '{\\mathrm{\\beta }{\\vphantom{X}}^{+}}');
testCe('^40_18Ar + \\gamma{} + \\nu_e', '{{\\vphantom{X}}^{\\hphantom{40}}_{\\hphantom{18}}{\\vphantom{X}}^{\\smash[t]{\\vphantom{2}}\\llap{40}}_{\\vphantom{2}\\llap{\\smash[t]{18}}}\\mathrm{Ar} {}+{} \\mathrm{\\gamma{}} {}+{} \\mathrm{\\nu}{\\vphantom{X}}_{\\smash[t]{e }}}');

/// (Italic) Math
testCe('NaOH(aq,$\\infty$)', '{\\mathrm{NaOH}\\mskip2mu (\\mathrm{aq},\\infty )}');
testCe('Fe(CN)_{$\\frac{6}{2}$}', '{\\mathrm{Fe}(\\mathrm{CN}){\\vphantom{X}}_{\\smash[t]{\\frac{6}{2} }}}');
testCe('X_{$i$}^{$x$}', '{\\mathrm{X}{\\vphantom{X}}_{\\smash[t]{i }}{\\vphantom{X}}^{x }}');
testCe('X_$i$^$x$', '{\\mathrm{X}{\\vphantom{X}}_{\\smash[t]{i }}{\\vphantom{X}}^{x }}');

/// Italic Text
testCe('$cis${-}[PtCl2(NH3)2]', '{cis {\\text{-}}[\\mathrm{PtCl}{\\vphantom{X}}_{\\smash[t]{2}}(\\mathrm{NH}{\\vphantom{X}}_{\\smash[t]{3}}){\\vphantom{X}}_{\\smash[t]{2}}]}');
testCe('CuS($hP12$)', '{\\mathrm{CuS}(hP12 )}');

/// Upright Text, Escape Parsing
testCe('{Gluconic Acid} + H2O2', '{{\\text{Gluconic Acid}} {}+{} \\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}{\\vphantom{X}}_{\\smash[t]{2}}}');
testCe('X_{{red}}', '{\\mathrm{X}{\\vphantom{X}}_{\\smash[t]{\\text{red}}}}');
testCe('{(+)}_589{-}[Co(en)3]Cl3', '{{\\text{(+)}}{\\vphantom{X}}_{\\smash[t]{589}}{\\text{-}}[\\mathrm{Co}(\\mathrm{en}){\\vphantom{X}}_{\\smash[t]{3}}]\\mathrm{Cl}{\\vphantom{X}}_{\\smash[t]{3}}}');

/// Bonds
testCe('C6H5-CHO', '{\\mathrm{C}{\\vphantom{X}}_{\\smash[t]{6}}\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{5}}{-}\\mathrm{CHO}}');
testCe('A-B=C#D', '{\\mathrm{A}{-}\\mathrm{B}{=}\\mathrm{C}{\\equiv}\\mathrm{D}}');
testCe('A\\bond{-}B\\bond{=}C\\bond{#}D', '{\\mathrm{A}{-}\\mathrm{B}{=}\\mathrm{C}{\\equiv}\\mathrm{D}}');
testCe('A\\bond{1}B\\bond{2}C\\bond{3}D', '{\\mathrm{A}{-}\\mathrm{B}{=}\\mathrm{C}{\\equiv}\\mathrm{D}}');
testCe('A\\bond{~}B\\bond{~-}C', '{\\mathrm{A}{\\tripledash}\\mathrm{B}{\\rlap{\\lower.1em{-}}\\raise.1em{\\tripledash}}\\mathrm{C}}');
testCe('A\\bond{~--}B\\bond{~=}C\\bond{-~-}D', '{\\mathrm{A}{\\rlap{\\lower.2em{-}}\\rlap{\\raise.2em{\\tripledash}}-}\\mathrm{B}{\\rlap{\\lower.2em{-}}\\rlap{\\raise.2em{\\tripledash}}-}\\mathrm{C}{\\rlap{\\lower.2em{-}}\\rlap{\\raise.2em{-}}\\tripledash}\\mathrm{D}}');
testCe('A\\bond{...}B\\bond{....}C', '{\\mathrm{A}{{\\cdot}{\\cdot}{\\cdot}}\\mathrm{B}{{\\cdot}{\\cdot}{\\cdot}{\\cdot}}\\mathrm{C}}');
testCe('A\\bond{->}B\\bond{<-}C', '{\\mathrm{A}{\\rightarrow}\\mathrm{B}{\\leftarrow}\\mathrm{C}}');

/// Addition Compounds
testCe('KCr(SO4)2*12H2O', '{\\mathrm{KCr}(\\mathrm{SO}{\\vphantom{X}}_{\\smash[t]{4}}){\\vphantom{X}}_{\\smash[t]{2}}\\,{\\cdot}\\,12\\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');
testCe('KCr(SO4)2.12H2O', '{\\mathrm{KCr}(\\mathrm{SO}{\\vphantom{X}}_{\\smash[t]{4}}){\\vphantom{X}}_{\\smash[t]{2}}\\,{\\cdot}\\,12\\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');
testCe('KCr(SO4)2 * 12 H2O', '{\\mathrm{KCr}(\\mathrm{SO}{\\vphantom{X}}_{\\smash[t]{4}}){\\vphantom{X}}_{\\smash[t]{2}}\\,{\\cdot}\\,12\\,\\mathrm{H}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}}');

/// Oxidation States
testCe('Fe^{II}Fe^{III}2O4', '{\\mathrm{Fe}{\\vphantom{X}}^{\\mathrm{II}}\\mathrm{Fe}{\\vphantom{X}}^{\\mathrm{III}}{\\vphantom{X}}_{\\smash[t]{2}}\\mathrm{O}{\\vphantom{X}}_{\\smash[t]{4}}}');

/// Unpaired Electrons, Radical Dots
testCe('OCO^{.-}', '{\\mathrm{OCO}{\\vphantom{X}}^{\\mkern1mu \\bullet\\mkern1mu -}}');
testCe('NO^{(2.)-}', '{\\mathrm{NO}{\\vphantom{X}}^{(2\\mkern1mu \\bullet\\mkern1mu )-}}');

/// Kröger-Vink Notation
testCe('Li^x_{Li,1-2x}Mg^._{Li,x}$V$\'_{Li,x}Cl^x_{Cl}', '{\\mathrm{Li}{\\vphantom{X}}^{{\\times}}_{\\smash[t]{\\mathrm{Li}{,}\\mkern1mu 1-2x }}\\mathrm{Mg}{\\vphantom{X}}^{\\mkern1mu \\bullet\\mkern1mu }_{\\smash[t]{\\mathrm{Li}{,}\\mkern1mu x }}V {\\vphantom{X}}^{\\prime }_{\\smash[t]{\\mathrm{Li}{,}\\mkern1mu x }}\\mathrm{Cl}{\\vphantom{X}}^{{\\times}}_{\\smash[t]{\\mathrm{Cl}}}}');
testCe('O\'\'_{i,x}', '{\\mathrm{O}{\\vphantom{X}}^{\\prime \\prime }_{\\smash[t]{\\mathrm{i}{,}\\mkern1mu x }}}');
testCe('M^{..}_i', '{\\mathrm{M}{\\vphantom{X}}^{\\mkern1mu \\bullet\\mkern1mu \\mkern1mu \\bullet\\mkern1mu }_{\\smash[t]{\\mathrm{i}}}}');
testCe('$V$^{4\'}_{Ti}', '{V {\\vphantom{X}}^{4\\prime }_{\\smash[t]{\\mathrm{Ti}}}}');
testCe('V_{V,1}C_{C,0.8}$V$_{C,0.2}', '{\\mathrm{V}{\\vphantom{X}}_{\\smash[t]{\\mathrm{V}{,}\\mkern1mu 1}}\\mathrm{C}{\\vphantom{X}}_{\\smash[t]{\\mathrm{C}{,}\\mkern1mu 0.8}}V {\\vphantom{X}}_{\\smash[t]{\\mathrm{C}{,}\\mkern1mu 0.2}}}');

/// Equation Operators
testCe('A + B', '{\\mathrm{A} {}+{} \\mathrm{B}}');
testCe('A - B', '{\\mathrm{A} {}-{} \\mathrm{B}}');
testCe('A = B', '{\\mathrm{A} {}={} \\mathrm{B}}');
testCe('A \\pm B', '{\\mathrm{A} {}\\pm{} \\mathrm{B}}');

/// Precipitate and Gas
testCe('SO4^2- + Ba^2+ -> BaSO4 v', '{\\mathrm{SO}{\\vphantom{X}}_{\\smash[t]{4}}{\\vphantom{X}}^{2-} {}+{} \\mathrm{Ba}{\\vphantom{X}}^{2+} {}\\mathrel{\\longrightarrow}{} \\mathrm{BaSO}{\\vphantom{X}}_{\\smash[t]{4}} \\downarrow{} }');
testCe('A v B (v) -> B ^ B (^)', '{\\mathrm{A} \\downarrow{} ~\\mathrm{B} \\downarrow{}  {}\\mathrel{\\longrightarrow}{} \\mathrm{B} \\uparrow{} ~\\mathrm{B} \\uparrow{} }');

/// Other Symbols and Shortcuts
testCe('NO^*', '{\\mathrm{NO}{\\vphantom{X}}^{*}}');
testCe('1s^2-N', '{1\\mathrm{s}{\\vphantom{X}}^{2}\\text{-}\\mathrm{N}}');
testCe('n-Pr', '{n \\text{-}\\mathrm{Pr}}');
testCe('iPr', '{\\mathrm{iPr}}');
testCe('\\ca Fe', '{{\\sim}\\mathrm{Fe}}');
testCe('A, B, C; F', '{\\mathrm{A}{,}\\mkern6mu \\mathrm{B}{,}\\mkern6mu \\mathrm{C}{;}\\mkern6mu \\mathrm{F}}');
testCe('{and others}', '{{\\text{and others}}}');

/// Complex Examples
testCe('Zn^2+  <=>[+ 2OH-][+ 2H+]  $\\underset{\\text{amphoteres Hydroxid}}{\\ce{Zn(OH)2 v}}$  <=>[+ 2OH-][+ 2H+]  $\\underset{\\text{Hydroxozikat}}{\\ce{[Zn(OH)4]^2-}}$', '{\\mathrm{Zn}{\\vphantom{X}}^{2+} {}\\mathrel{\\underset{\\lower6mu{ {}+{} 2\\,\\mathrm{H}{\\vphantom{X}}^{+}}}{\\overset{ {}+{} 2\\,\\mathrm{OH}{\\vphantom{X}}^{-}}{\\longrightleftharpoons}}}{} \\underset{\\text{amphoteres Hydroxid}}{\\ce{Zn(OH)2 v}}  {}\\mathrel{\\underset{\\lower6mu{ {}+{} 2\\,\\mathrm{H}{\\vphantom{X}}^{+}}}{\\overset{ {}+{} 2\\,\\mathrm{OH}{\\vphantom{X}}^{-}}{\\longrightleftharpoons}}}{} \\underset{\\text{Hydroxozikat}}{\\ce{[Zn(OH)4]^2-}} }');
testCe('$K = \\frac{[\\ce{Hg^2+}][\\ce{Hg}]}{[\\ce{Hg2^2+}]}$', '{K = \\frac{[\\ce{Hg^2+}][\\ce{Hg}]}{[\\ce{Hg2^2+}]} }');
testCe('$K = \\ce{\\frac{[Hg^2+][Hg]}{[Hg2^2+]}}$', '{K =  \\frac{[\\mathrm{Hg}{\\vphantom{X}}^{2+}][\\mathrm{Hg}]}{[\\mathrm{Hg}{\\vphantom{X}}_{\\smash[t]{2}}{\\vphantom{X}}^{2+}]}}');
testCe('Hg^2+ ->[I-]  $\\underset{\\mathrm{red}}{\\ce{HgI2}}$  ->[I-]  $\\underset{\\mathrm{red}}{\\ce{[Hg^{II}I4]^2-}}$', '{\\mathrm{Hg}{\\vphantom{X}}^{2+} {}\\mathrel{\\xrightarrow{\\mathrm{I}{\\vphantom{X}}^{-}}}{} \\underset{\\mathrm{red}}{\\ce{HgI2}}  {}\\mathrel{\\xrightarrow{\\mathrm{I}{\\vphantom{X}}^{-}}}{} \\underset{\\mathrm{red}}{\\ce{[Hg^{II}I4]^2-}} }');

/// \pu
testPu('123 kJ', '{123~\\mathrm{kJ}}');
testPu('123 mm2', '{123~\\mathrm{mm^{2}}}');
testPu('123 J s', '{123~\\mathrm{J}\\mkern3mu \\mathrm{s}}');
testPu('123 J*s', '{123~\\mathrm{J}\\mkern1mu{\\cdot}\\mkern1mu \\mathrm{s}}');
testPu('123 kJ/mol', '{123~\\mathrm{kJ}/\\mathrm{mol}}');
testPu('123 kJ//mol', '{123~\\mathchoice{\\textstyle\\frac{\\mathrm{kJ}}{\\mathrm{mol}}}{\\frac{\\mathrm{kJ}}{\\mathrm{mol}}}{\\frac{\\mathrm{kJ}}{\\mathrm{mol}}}{\\frac{\\mathrm{kJ}}{\\mathrm{mol}}}}');
testPu('123 kJ mol^-1', '{123~\\mathrm{kJ}\\mkern3mu \\mathrm{mol^{-1}}}');
testPu('123 kJ*mol-1', '{123~\\mathrm{kJ}\\mkern1mu{\\cdot}\\mkern1mu \\mathrm{mol^{-1}}}');
testPu('123 kJ.mol-1', '{123~\\mathrm{kJ}\\mkern1mu{\\cdot}\\mkern1mu \\mathrm{mol^{-1}}}');
testPu('1.2e3 kJ', '{1.2\\cdot 10^{3}~\\mathrm{kJ}}');
testPu('1,2e3 kJ', '{1{,}2\\cdot 10^{3}~\\mathrm{kJ}}');
testPu('1.2E3 kJ', '{1.2\\times 10^{3}~\\mathrm{kJ}}');
testPu('1,2E3 kJ', '{1{,}2\\times 10^{3}~\\mathrm{kJ}}');
testPu('1234', '{1234}');
testPu('12345', '{12\\mkern2mu 345}');
testPu('1\u00B0C', '{1~\\mathrm{{}^{\\circ}C}}');
testPu('23.4782(32) m', '{23.4782(32)~\\mathrm{m}}');
testPu('8.00001 \\pm 0.00005 nm', '{8.000\\mkern2mu 01 {}\\pm{} 0.000\\mkern2mu 05~\\mathrm{nm}}');
testPu('.25', '{.25}');
testPu('1 mol ', '{1~\\mathrm{mol}~}');
testPu('123 l//100km', '{123~\\mathchoice{\\textstyle\\frac{\\mathrm{l}}{100~\\mathrm{km}}}{\\frac{\\mathrm{l}}{100~\\mathrm{km}}}{\\frac{\\mathrm{l}}{100~\\mathrm{km}}}{\\frac{\\mathrm{l}}{100~\\mathrm{km}}}}');

