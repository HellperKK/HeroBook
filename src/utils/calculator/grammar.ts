// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-nocheck
function id(d: any[]): any { return d[0]; }
declare var openCur: any;
declare var closeCur: any;
declare var plus: any;
declare var minus: any;
declare var times: any;
declare var divide: any;
declare var power: any;
declare var ident: any;
declare var openPar: any;
declare var closePar: any;
declare var comma: any;
declare var decimal: any;
declare var ws: any;

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

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "main", "symbols": ["adsub"]},
    {"name": "adsub", "symbols": ["addition"], "postprocess": id},
    {"name": "adsub", "symbols": ["substraction"], "postprocess": id},
    {"name": "block", "symbols": [(lexer.has("openCur") ? {type: "openCur"} : openCur), "_", "main", "adsub", "_", (lexer.has("closeCur") ? {type: "closeCur"} : closeCur)], "postprocess": arr => ({type: "block", content: arr[2], returning: arr[3]})},
    {"name": "block", "symbols": [(lexer.has("openCur") ? {type: "openCur"} : openCur), "_", "main", "_", (lexer.has("closeCur") ? {type: "closeCur"} : closeCur)], "postprocess": arr => ({type: "block", content: arr[2], returning: unit})},
    {"name": "addition", "symbols": ["adsub", "_", (lexer.has("plus") ? {type: "plus"} : plus), "_", "muldiv"], "postprocess": arr => arr[0] + arr[4]},
    {"name": "addition", "symbols": ["muldiv"], "postprocess": id},
    {"name": "substraction", "symbols": ["adsub", "_", (lexer.has("minus") ? {type: "minus"} : minus), "_", "muldiv"], "postprocess": arr => arr[0] - arr[4]},
    {"name": "substraction", "symbols": ["muldiv"], "postprocess": id},
    {"name": "muldiv", "symbols": ["multiplication"], "postprocess": id},
    {"name": "muldiv", "symbols": ["division"], "postprocess": id},
    {"name": "multiplication", "symbols": ["muldiv", "_", (lexer.has("times") ? {type: "times"} : times), "_", "exponen"], "postprocess": arr => arr[0] * arr[4]},
    {"name": "multiplication", "symbols": ["exponen"], "postprocess": id},
    {"name": "division", "symbols": ["muldiv", "_", (lexer.has("divide") ? {type: "divide"} : divide), "_", "exponen"], "postprocess": arr => arr[0] / arr[4]},
    {"name": "division", "symbols": ["exponen"], "postprocess": id},
    {"name": "exponen", "symbols": ["funpar", "_", (lexer.has("power") ? {type: "power"} : power), "_", "exponen"], "postprocess": arr => arr[0] ** arr[4]},
    {"name": "exponen", "symbols": ["funcall"], "postprocess": id},
    {"name": "exponen", "symbols": ["parens"], "postprocess": id},
    {"name": "funpar", "symbols": ["funcall"], "postprocess": id},
    {"name": "funpar", "symbols": ["parens"], "postprocess": id},
    {"name": "funcall", "symbols": [(lexer.has("ident") ? {type: "ident"} : ident), (lexer.has("openPar") ? {type: "openPar"} : openPar), "_", "argslist", "_", (lexer.has("closePar") ? {type: "closePar"} : closePar)], "postprocess": arr => callFun(arr[0], arr[3])},
    {"name": "argslist", "symbols": ["argslist", "_", (lexer.has("comma") ? {type: "comma"} : comma), "_", "adsub"], "postprocess": arr => arr[0].concat(arr[4])},
    {"name": "argslist", "symbols": ["adsub"]},
    {"name": "argslist", "symbols": [], "postprocess": arr => []},
    {"name": "parens", "symbols": [(lexer.has("openPar") ? {type: "openPar"} : openPar), "_", "adsub", "_", (lexer.has("closePar") ? {type: "closePar"} : closePar)], "postprocess": arr => arr[2]},
    {"name": "parens", "symbols": ["decimal"], "postprocess": id},
    {"name": "decimal", "symbols": [(lexer.has("decimal") ? {type: "decimal"} : decimal)], "postprocess": arr => parseFloat(arr[0])},
    {"name": "decimal", "symbols": [(lexer.has("minus") ? {type: "minus"} : minus), (lexer.has("decimal") ? {type: "decimal"} : decimal)], "postprocess": arr => -parseFloat(arr[1])},
    {"name": "_$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(arr) { return null; }},
    {"name": "__", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function(arr) { return null; }}
  ],
  ParserStart: "main",
};

export default grammar;
