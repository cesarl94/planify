// Check if a string contains numbers
function containsNumbers(inputString) {
    // Regular expression to search for any number in the string
    const regex = /\d/;

    // The test() method returns true if it finds a number, false if not
    return regex.test(inputString);
}

// Verify that an email address has the correct format
function validateEmail(email) {
    if (email.length < 5) {
        return {
            valid: false,
            error: "The email address must be at least 5 characters long",
        };
    }

    if (email.length > 250) {
        return {
            valid: false,
            error: "The email address is too long",
        };
    }

    const atCount = (email.match(/@/g) || []).length;
    if (atCount != 1) {
        return {
            valid: false,
            error: "The email address must contain an at symbol (@)",
        };
    }

    const parts = email.split("@");

    const user = parts[0];
    if (user.length < 1) {
        return {
            valid: false,
            error: "The email address must have a user",
        };
    }
    const domain = parts[1];
    if (domain.length < 1) {
        return {
            valid: false,
            error: "The email address must have a domain",
        };
    }
    const domainDotsCount = (email.match(/\./g) || []).length;
    if (domainDotsCount == 0) {
        return {
            valid: false,
            error: "The domain must have a top-level domain, after a dot (.)",
        };
    }

    const domainParts = domain.split(".");

    const domainFirstPart = domainParts[0];
    if (domainFirstPart.length == 0) {
        return {
            valid: false,
            error: "The email address must have a domain",
        };
    }

    const domainFirstLevel = domainParts[1];
    if (domainFirstLevel.length == 0) {
        return {
            valid: false,
            error: "The domain must have a top-level domain, after a dot (.)",
        };
    }

    // No error message is sent if validation passes
    return { valid: true };
}

// Verify that a text field does not contain numbers and has at least 3 characters
function validateName(element, minLength = 3, maxLength = 50, allowedNumbers = false) {
    if (!allowedNumbers && containsNumbers(element)) {
        return {
            valid: false,
            error: `Field ${element} must not contain numbers`,
        };
    } else if (element.length < minLength) {
        return {
            valid: false,
            error: `Field ${element} must have at least ${minLength} characters`,
        };
    } else if (element.length > maxLength) {
        return {
            valid: false,
            error: `Field ${element} value is too long`,
        };
    }
    return {
        valid: true,
    };
}

function sortByProp(objectsArray, propName) {
    return objectsArray.sort((a, b) => a[propName] - b[propName]);
}

function parseSecureInt(input) {
    // It checks if input is a string that contains only digits
    if (/^-?\d+$/.test(input)) {
        return parseInt(input, 10); // It transforms the string in an integer
    }
    return NaN; // If isn't valid, it returns NaN
}

module.exports = { containsNumbers, validateEmail, validateName, sortByProp, parseSecureInt };
