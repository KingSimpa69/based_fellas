const formatETH = (ethValue) => {
    const ethString = ethValue.toString();

    // Find the index of the decimal point
    const decimalIndex = ethString.indexOf('.');

    // If there is no decimal point, return the original string
    if (decimalIndex === -1) {
        return ethString;
    }

    // Find the index of the first non-zero digit after the decimal point
    const firstNonZeroDigitIndex = ethString.substring(decimalIndex + 1).search(/[1-9]/);

    // If there are no non-zero digits after the decimal point, return the original string
    if (firstNonZeroDigitIndex === -1) {
        return ethString.substring(0, decimalIndex);
    }

    // Construct the formatted string up to the desired decimal place
    const formattedEth = ethString.substring(0, decimalIndex + firstNonZeroDigitIndex + 3);

    return formattedEth;
}

export default formatETH
