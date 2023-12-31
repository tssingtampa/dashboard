/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */
function peg$subclass(child, parent) {
  function ctor() {
    this.constructor = child;
  }
  ctor.prototype = parent.prototype;
  // eslint-disable-next-line new-cap
  child.prototype = new ctor();
}

function pegSyntaxError(message, expected, found, location) {
  this.message = message;
  this.expected = expected;
  this.found = found;
  this.location = location;
  this.name = 'SyntaxError';

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(this, pegSyntaxError);
  }
}

peg$subclass(pegSyntaxError, Error);

pegSyntaxError.buildMessage = function (expected, found) {
  const DESCRIBE_EXPECTATION_FNS = {
    literal: function (expectation) {
      return '"' + literalEscape(expectation.text) + '"';
    },

    class: function (expectation) {
      let escapedParts = '';
      let i;

      for (i = 0; i < expectation.parts.length; i++) {
        escapedParts +=
          expectation.parts[i] instanceof Array
            ? classEscape(expectation.parts[i][0]) + '-' + classEscape(expectation.parts[i][1])
            : classEscape(expectation.parts[i]);
      }

      return '[' + (expectation.inverted ? '^' : '') + escapedParts + ']';
    },

    // eslint-disable-next-line no-unused-vars
    any: function (expectation) {
      return 'any character';
    },

    // eslint-disable-next-line no-unused-vars
    end: function (expectation) {
      return 'end of input';
    },

    other: function (expectation) {
      return expectation.description;
    },
  };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g, function (ch) {
        return '\\x0' + hex(ch);
      })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
        return '\\x' + hex(ch);
      });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g, '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g, function (ch) {
        return '\\x0' + hex(ch);
      })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
        return '\\x' + hex(ch);
      });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    const descriptions = new Array(expected.length);
    let i;
    let j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + ' or ' + descriptions[1];

      default:
        return (
          descriptions.slice(0, -1).join(', ') + ', or ' + descriptions[descriptions.length - 1]
        );
    }
  }

  function describeFound(found) {
    return found ? '"' + literalEscape(found) + '"' : 'end of input';
  }

  return 'Expected ' + describeExpected(expected) + ' but ' + describeFound(found) + ' found.';
};

function pegParse(input, options) {
  options = options !== void 0 ? options : {};

  const peg$FAILED = {};

  const peg$startRuleFunctions = { Exps: peg$parseExps };
  let peg$startRuleFunction = peg$parseExps;

  const peg$c0 = function (e) {
    return e.map((x) => x[0]);
  };
  const peg$c1 = '${';
  const peg$c2 = peg$literalExpectation('${', false);
  const peg$c3 = '}';
  const peg$c4 = peg$literalExpectation('}', false);
  const peg$c5 = function (varCont) {
    return {
      type: 'var',
      content: {
        name: varCont[0][0].content,
        default: varCont[0][1] ? varCont[0][1].content : null,
      },
    };
  };
  const peg$c6 = function (varCont) {
    return { type: 'varname', content: varCont.map((c) => c.char || c).join('') };
  };
  const peg$c7 = ':';
  const peg$c8 = peg$literalExpectation(':', false);
  const peg$c9 = function (defCont) {
    return { type: 'vardefault', content: defCont.join('') };
  };
  const peg$c10 = /^[^}:\\\r\n]/;
  const peg$c11 = peg$classExpectation(['}', ':', '\\', '\r', '\n'], true, false);
  const peg$c12 = '\\';
  const peg$c13 = peg$literalExpectation('\\', false);
  const peg$c14 = function () {
    return { type: 'char', char: '\\' };
  };
  const peg$c15 = function () {
    return { type: 'char', char: '\x7d' };
  };
  const peg$c16 = function (sequence) {
    return sequence.char;
  };
  const peg$c17 = /^[^}\\\r\n]/;
  const peg$c18 = peg$classExpectation(['}', '\\', '\r', '\n'], true, false);
  const peg$c19 = function (nonVarCont) {
    return { type: 'nonvar', content: nonVarCont.map((c) => c.char || c).join('') };
  };
  const peg$c20 = /^[^$]/;
  const peg$c21 = peg$classExpectation(['$'], true, false);
  const peg$c22 = '$';
  const peg$c23 = peg$literalExpectation('$', false);
  const peg$c24 = /^[^{]/;
  const peg$c25 = peg$classExpectation(['{'], true, false);
  const peg$c26 = peg$otherExpectation('whitespace');
  const peg$c27 = /^[ \t\n\r]/;
  const peg$c28 = peg$classExpectation([' ', '\t', '\n', '\r'], false, false);

  let peg$currPos = 0;
  let peg$savedPos = 0;
  const peg$posDetailsCache = [{ line: 1, column: 1 }];
  let peg$maxFailPos = 0;
  let peg$maxFailExpected = [];
  let peg$silentFails = 0;

  let peg$result;

  if ('startRule' in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error('Can\'t start parsing from rule "' + options.startRule + '".');
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  // eslint-disable-next-line no-unused-vars
  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }
  // eslint-disable-next-line no-unused-vars
  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }
  // eslint-disable-next-line no-unused-vars
  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }
  // eslint-disable-next-line no-unused-vars
  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: 'literal', text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: 'class', parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  // eslint-disable-next-line no-unused-vars
  function peg$anyExpectation() {
    return { type: 'any' };
  }

  function peg$endExpectation() {
    return { type: 'end' };
  }

  function peg$otherExpectation(description) {
    return { type: 'other', description: description };
  }

  function peg$computePosDetails(pos) {
    let details = peg$posDetailsCache[pos];
    let p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column,
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    const startPosDetails = peg$computePosDetails(startPos);
    const endPosDetails = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column,
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column,
      },
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    // eslint-disable-next-line new-cap
    return new pegSyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    // eslint-disable-next-line new-cap
    return new pegSyntaxError(
      pegSyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parseExps() {
    let s0;
    let s1;
    let s2;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parseExp();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseExp();
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c0(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseExp() {
    let s0;
    let s1;

    s0 = [];
    s1 = peg$parseVar();
    if (s1 !== peg$FAILED) {
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseVar();
      }
    } else {
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = [];
      s1 = peg$parseNonVar();
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          s1 = peg$parseNonVar();
        }
      } else {
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parseVar() {
    let s0;
    let s1;
    let s2;
    let s3;
    let s4;
    let s5;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c1) {
      s1 = peg$c1;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c2);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parseVarInner();
        if (s4 !== peg$FAILED) {
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseVarInner();
          }
        } else {
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 125) {
              s5 = peg$c3;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c4);
              }
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c5(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseVarInner() {
    let s0;
    let s1;
    let s2;

    s0 = peg$currPos;
    s1 = peg$parseVarName();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseVarDefault();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseVarName() {
    let s0;
    let s1;
    let s2;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parseVarNameChar();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseVarNameChar();
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c6(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseVarDefault() {
    let s0;
    let s1;
    let s2;
    let s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 58) {
      s1 = peg$c7;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c8);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseVarDefaultChar();
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseVarDefaultChar();
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c9(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseVarNameChar() {
    let s0;
    let s1;
    let s2;
    let s3;

    if (peg$c10.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c11);
      }
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseEscape();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 92) {
          s3 = peg$c12;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c13);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s2;
          s3 = peg$c14();
        }
        s2 = s3;
        if (s2 === peg$FAILED) {
          s2 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 125) {
            s3 = peg$c3;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c4);
            }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c15();
          }
          s2 = s3;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c16(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parseVarDefaultChar() {
    let s0;
    let s1;
    let s2;
    let s3;

    if (peg$c17.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c18);
      }
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseEscape();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 92) {
          s3 = peg$c12;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c13);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s2;
          s3 = peg$c14();
        }
        s2 = s3;
        if (s2 === peg$FAILED) {
          s2 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 125) {
            s3 = peg$c3;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c4);
            }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c15();
          }
          s2 = s3;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c16(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parseNonVar() {
    let s0;
    let s1;
    let s2;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parseNonVarCont();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseNonVarCont();
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c19(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseNonVarCont() {
    let s0;

    s0 = peg$parseDollarNotVarStart();
    if (s0 === peg$FAILED) {
      s0 = peg$parseNotDollar();
    }

    return s0;
  }

  function peg$parseNotDollar() {
    let s0;

    if (peg$c20.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c21);
      }
    }

    return s0;
  }

  function peg$parseDollarNotVarStart() {
    let s0;
    let s1;
    let s2;
    let s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 36) {
      s1 = peg$c22;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c23);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (peg$c24.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c25);
        }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c24.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c25);
            }
          }
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parse_() {
    let s0;
    let s1;

    peg$silentFails++;
    // eslint-disable-next-line prefer-const
    s0 = [];
    if (peg$c27.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c28);
      }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      if (peg$c27.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c28);
        }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c26);
      }
    }

    return s0;
  }

  function peg$parseEscape() {
    let s0;

    if (input.charCodeAt(peg$currPos) === 92) {
      s0 = peg$c12;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c13);
      }
    }

    return s0;
  }

  // eslint-disable-next-line prefer-const
  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

export default {
  SyntaxError: pegSyntaxError,
  parse: pegParse,
};
