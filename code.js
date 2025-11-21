const fs = require('fs');

/**
 * Decodes a value from a given base to a BigInt.
 * equivalent to parseInt(value, base) but for BigInts.
 * * @param {string} valueStr - The string representation of the value.
 * @param {number} base - The base of the number system.
 * @returns {BigInt} - The decoded integer.
 */
function decodeValue(valueStr, base) {
    const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = 0n;
    let b = BigInt(base);
    
    // Clean string (remove potential whitespace)
    valueStr = valueStr.trim().toLowerCase();

    for (let char of valueStr) {
        const val = BigInt(digits.indexOf(char));
        if (val < 0n || val >= b) {
            throw new Error(`Invalid character '${char}' for base ${base}`);
        }
        result = result * b + val;
    }
    return result;
}

/**
 * Solves for the constant term 'c' of the polynomial using Lagrange Interpolation.
 * We need to find f(0).
 * * Formula: L(0) = Σ ( y_j * Π ( -x_m / (x_j - x_m) ) )
 * * @param {Object} data - The JSON input object.
 * @returns {BigInt} - The constant term (secret).
 */
function findSecret(data) {
    const n = data.keys.n;
    const k = data.keys.k;

    let points = [];

    // 1. Parse and Decode Input
    // Iterate over the keys in the JSON
    for (let key in data) {
        if (key === 'keys') continue; // Skip the config object

        const x = BigInt(key); // The key itself is the x-coordinate
        const base = parseInt(data[key].base);
        const valueStr = data[key].value;
        
        const y = decodeValue(valueStr, base); // Decode y based on its base
        
        points.push({ x, y });
    }

    // 2. Select the first k points (any k points are sufficient)
    // We sort them just to be deterministic, though not strictly necessary mathematically
    points.sort((a, b) => (a.x < b.x ? -1 : 1));
    const selectedPoints = points.slice(0, k);

    if (selectedPoints.length < k) {
        throw new Error("Not enough points provided to solve the polynomial.");
    }

    // 3. Lagrange Interpolation at x = 0
    // Since we are working with BigInts, we cannot divide step-by-step (no decimals).
    // We will treat the calculation as a sum of fractions: Sum(num_i / den_i)
    // Then compute the final result as a single large division.
    
    let finalNum = 0n;
    let finalDen = 1n;

    // Although we could use a common denominator strategy, given the specific constraints 
    // of this problem (Shamir's Secret Sharing usually results in an integer), 
    // and calculating massive common denominators can be slow,
    // we will perform the calculation term by term using a fraction arithmetic approach.
    
    for (let i = 0; i < k; i++) {
        let xi = selectedPoints[i].x;
        let yi = selectedPoints[i].y;

        let num = yi;
        let den = 1n;

        for (let j = 0; j < k; j++) {
            if (i === j) continue;

            let xj = selectedPoints[j].x;

            // Term: (0 - xj) / (xi - xj)
            // numerator part: -xj
            // denominator part: xi - xj
            
            num = num * (0n - xj);
            den = den * (xi - xj);
        }
        
        // We now have a fraction (num / den) for this term.
        // We add it to our running total (finalNum / finalDen).
        // Formula: a/b + c/d = (ad + bc) / bd
        
        finalNum = finalNum * den + num * finalDen;
        finalDen = finalDen * den;
    }

    // 4. Calculate Final Result
    // The result is guaranteed to be an integer based on the problem description.
    const secret = finalNum / finalDen;

    return secret;
}

// --- Main Execution ---

// 1. Define Test Cases
const testCase1 = {
    "keys": { "n": 4, "k": 3 },
    "1": { "base": "10", "value": "4" },
    "2": { "base": "2", "value": "111" },
    "3": { "base": "10", "value": "12" },
    "6": { "base": "4", "value": "213" }
};

const testCase2 = {
    "keys": { "n": 10, "k": 7 },
    "1": { "base": "6", "value": "13444211440455345511" },
    "2": { "base": "15", "value": "aed7015a346d635" },
    "3": { "base": "15", "value": "6aeeb69631c227c" },
    "4": { "base": "16", "value": "e1b5e05623d881f" },
    "5": { "base": "8", "value": "316034514573652620673" },
    "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
    "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },
    "8": { "base": "6", "value": "20220554335330240002224253" },
    "9": { "base": "12", "value": "45153788322a1255483" },
    "10": { "base": "7", "value": "1101613130313526312514143" }
};

console.log("--------------------------------------------------");
console.log("Calculating Test Case 1 (Sample)...");
try {
    const result1 = findSecret(testCase1);
    console.log("Secret 1:", result1.toString());
} catch (e) {
    console.error(e);
}

console.log("--------------------------------------------------");
console.log("Calculating Test Case 2 (Submission)...");
try {
    const result2 = findSecret(testCase2);
    console.log("Secret 2:", result2.toString());
} catch (e) {
    console.error(e);
}
console.log("--------------------------------------------------");
