import nearley from "nearley";
import grammar from "./grammar";

export function calculate(expression: string) {
	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

	const trees = parser.feed(expression);
	const results = trees.results;

	if (results.length === 0) {
		throw new Error("no result");
	}

	return results[0][0];
}
