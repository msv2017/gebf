# gebf

This node.js module is created to study potential behind grammar evolution.

In a nutshell, it is a brute-force generator with predefined grammar that produces expressions using javascript test function.

## Installation

	npm install gebf

## Usage

Define a grammar:

	var lang = {...};

One need a test function, points and results as follows:

	var testFunc = x => x + x;
	var testPoints = [1, 2, ..., N];
	var testResults = testPoints.map(x => testFunc(x));

And call the method:

	var gebf = require('gebf');
	var result = gebf(lang, testFuncc, testPoints, testResults);

Note that at this point `gebf` supports only one-argument test functions.

## How to define a grammar properly

**Grammar definition**

A text wrapped with `<` and `>` is considered as a token and terminal otherwise.

Tokens are expandable grammar expressions and terminals are not.

Terminals can be binded to actual javascript functions with `bindings` key.

	var lang = {
		entry: '<entry>', // always must be defined
		'<entry>': ['<sub1>', ... ,'<subN>'], // token and its sub-tokens
		'<sub1>' : [...],
		...
		'<subN>' : [...],
		bindings: {
			sin: Math.sin,
			cos: Math.cos,
		}
	};

**Example**

	var lang = {
		entry: '<expr>',
		'<expr>: [
			'<expr> <op> <expr>',
			'x',
			'1'
		],
		'<op>': ['+', '-'],
	};

Can produce infinite expressions as follows:

			1 + x
			x - 1
			x - 1 + x
			x + x + 1 + 1
and so on

## Actual example

The following code defines grammar that produces expressions with the very same output for given test formula.

	var lang = {
		entry: "<expr>",
		"<expr>": [
			"<expr> <op> <expr>",
			"<fn>(<expr>)",
			"<var>",
			"<const>"
		],
		"<op>": ["+", "-", "*", "/"],
		"<fn>": ["sin", "cos",],
		"<var>": ["x",],
		"<const>": ["1", "2"],
		bindings: {
			sin: Math.sin,
			cos: Math.cos,
		}
	};

    // we are going to prove that given grammar can produce a formula sin(2*x)
	var testFunc = x => 2 * Math.sin(x) * Math.cos(x); 
	var testPoints = [-1, -.9, -.8, -.76, -.72, -.68, -.64, -.4, -.2, 0, .2, .4, .63, .72, .81, .9, .93, .96, .99, 1];
	var testResults = testPoints.map(x => testFunc(x));

	var gebf = require('gebf');

	var result = gebf(lang, testFunc, testPoints, testResults);

	console.log(result);

After a while, it produces the following result:

    [ 'sin(2 * x)', 'sin(x * 2)', 'sin(x + x)' ]
    
## Notes

Behind the curtain the algorithm uses integer array to represent complete grammar expression.

By default the maximum length for expression is 10.

For simple grammar it is more than enough. But if it is not, just pass one more parameter to the call like this:

    gebf(lang, testFunc, testPoints, testResults, N);

where N is max length of expression

Unfortunately, due to brute-force approach it is not recommended.
