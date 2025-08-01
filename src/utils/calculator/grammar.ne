@preprocessor typescript

@{%
import moo from 'moo';
const funs = {
        factorial: x => {
                let acc = 1

                for (let i = 1; i <= x; i++) {
                        acc *= i
                }

                return acc
        },

        random: Math.random,
        abs: Math.abs,
        ceil: Math.ceil,
        floor: Math.floor,
        round: Math.round,
        sqrt: Math.sqrt,
        pow: Math.pow,
        log: Math.log,
        log10: Math.log10,
        randomRange: (min, max) => min + (Math.random() * (max - min))
}

const callFun = (name, args) => {
        if (!funs[name]) {
                throw `function ${name} does not exist`
        }

        return funs[name](...args)
}

const lexer = moo.compile({

  // tokens
  decimal: /\d+(?:\.\d+)?/,
  ident: /[A-Za-z][A-Za-z0-9]*/,
  
  // symbols
  plus: "+",
  minus: "-",
  power: "**",
  times: "*",
  divide: "/",
  modulo: "%",
  comma: ",",

  // group symbols
  openPar: /\(/,
  closePar: /\)/,

  // spaces
  ws: {match: /\s+/, lineBreaks: true}
});

const unit = {type: "unit", content: null}
%}

@lexer lexer

main -> adsub

adsub -> addition {% id %}
        | substraction {% id %}

block -> %openCur _ main adsub _ %closeCur {% arr => ({type: "block", content: arr[2], returning: arr[3]}) %}
        | %openCur _ main _ %closeCur {% arr => ({type: "block", content: arr[2], returning: unit}) %}

addition -> adsub _ %plus _ muldiv {% arr => arr[0] + arr[4] %}
       | muldiv {% id %}

substraction -> adsub _ %minus _ muldiv {% arr => arr[0] - arr[4] %}
       | muldiv {% id %}

muldiv -> multiplication {% id %}
        | division {% id %}

multiplication -> muldiv _ %times _ exponen {% arr => arr[0] * arr[4] %}
        | exponen {% id %}

division -> muldiv _ %divide _ exponen {% arr => arr[0] / arr[4] %}
        | exponen {% id %}

exponen -> funpar _ %power _ exponen {% arr => arr[0] ** arr[4] %}
         | funcall {% id %}
         | parens {% id %}

funpar -> funcall {% id %}
        | parens {% id %}  

funcall -> %ident %openPar _ argslist _ %closePar {% arr => callFun(arr[0], arr[3]) %}

argslist -> argslist _ %comma _ adsub {% arr => arr[0].concat(arr[4]) %}
        | adsub
        | null {% arr => [] %}   

parens -> %openPar _ adsub _ %closePar {% arr => arr[2] %}
        | decimal {% id %}

decimal -> %decimal {% arr => parseFloat(arr[0]) %}
        | %minus %decimal {% arr => -parseFloat(arr[1]) %}

_ -> %ws:? {% function(arr) { return null; } %}

__ -> %ws {% function(arr) { return null; } %}