export function cleanDecimals(num: number): string {
	const checkZeros = /([1-9])0+[1-9]$/;

	if (checkZeros.test(num.toString())) {
		return num.toString().replace(checkZeros, "$1");
	}

	return num.toString();
}
