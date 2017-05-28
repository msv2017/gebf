module.exports = function (lang, testFunc, testPoints, testResults, err, max) {

	if (!err)
		err = 10e-5;

	if (!max)
		max = 10;

	function build(arr) {
		var text = lang.entry;
		var re = /\<\S+?\>/;
		var i = 0;
		var level = 0;
		var choices = [];
		while (i < arr.length) {
			var token = re.exec(text);
			if (!token) break;
			token = token[0];
			if (token == lang.entry) {
				level++;
			}
			choices.push(lang[token].length);
			var rule = lang[token][arr[i] % lang[token].length];
			text = text.replace(token, rule);
			i++;
		}
		return { text, level, choices };
	}

	var func_args = Object.keys(lang.bindings);
	func_args.push("x");
	func_args.push("");

	function compile(arr) {
		try {
			func_args[func_args.length - 1] = "return " + build(arr).text;
			return Function.prototype.constructor.apply(null, func_args)
		} catch (err) {
			return null;
		}
	}

	var dev_args = Object.keys(lang.bindings).map(k => lang.bindings[k]);
	dev_args.push(0);

	function dev(f) {
		if (f) {
			var r = 0;
			for (var i = 0; i < dev.points.length; i++) {
				dev_args[dev_args.length - 1] = dev.points[i];
				var y = f.apply(null, dev_args);
				if (!isFinite(y))
					return Infinity;
				r = r + Math.abs(y - dev.results[i]);
			}

			return r / dev.points.length;
		}

		return Infinity;
	}

	dev.points = testPoints;
	dev.results = testResults;

	var solutions = [];
	var stack = [[]];

	function bf() {
		var arr = stack.pop();
		var f = compile(arr);
		if (f) {
			if (dev(f) < err) {
				solutions.push(arr);
			}
			return;
		}

		if (arr.length == max) {
			return;
		}

		arr.push(0);
		var n = build(arr).choices[arr.length - 1];
		for (var i = 0; i < n; i++) {
			arr[arr.length - 1] = i;
			stack.push(arr.slice());
		}
	}

	while (stack.length) {
		bf();
	}

	return solutions.map(build).map(x => x.text);
}





