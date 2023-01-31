import { formatBalance } from "@polkadot/util";

export const formatAd3Amount = (amount: string) => {
  const amountWithUnit = formatBalance(amount, { withUnit: false, decimals: 18 });
  const [price, unit] = amountWithUnit.split(' ');
  return `${parseFloat(price).toFixed(2)}${unit ? ` ${unit}` : ''}`;
}

export function inputFloatStringToAmount(value?: string, decimals: number = 18): string {
  if (!value) {
    return '';
  };
  if (value.indexOf('.') === -1) {
    return BigInt(value.padEnd(value.length + decimals, '0')).toString();
  }

  let [intPart, floatPart] = value.split('.');
  if (intPart.length === 1 && intPart === '0') {
    intPart = '';
  }
  if (floatPart.length < decimals) {
    return BigInt(intPart + floatPart.padEnd(decimals, '0')).toString();
  }
  return BigInt(intPart + floatPart.substring(0, decimals)).toString();
}

export const amountToFloatString = (value: string | bigint, decimals: number = 18): string => {
	let Value = value;
	if (!Value) {
		return '0';
	};
	if (typeof (Value) !== 'string') {
		Value = value.toString();

	}
	if (Value === '0') {
		return '0';
	}
	if (Value.length <= decimals) {
		let floatPart = Value.padStart(decimals, '0');
		const zeroIndex = floatPart.search(/([0]+)$/);
		if (zeroIndex > -1) {
			floatPart = floatPart.substring(0, zeroIndex);
		}
		if (floatPart.length > 0) {
			floatPart = '0.' + floatPart;
		} else {
			floatPart = '0';
		}
		return floatPart;
	}
	const intPart = Value.substring(0, Value.length - decimals);
	let floatPart = Value.substring(Value.length - decimals);
	const zeroIndex = floatPart.search(/([0]+)$/);
	if (zeroIndex > -1) {
		floatPart = floatPart.substring(0, zeroIndex);
	}
	if (floatPart.length === 0) {
		return intPart;
	}
	return intPart + '.' + floatPart;
}

