function containsValidSQLCharacters(str) {
    for (let char of str) {
        if (/[a-zA-Z0-9()]/.test(char)) {
            return true;
        }
    }
    return false;
}

function getSqlSentences(filename) {
    const fs = require("fs");
    const flags = require("./flags.js");

    const sqlScript = fs.readFileSync(filename, "utf8").replaceAll("%DBNAME%", flags.TestDBName);

    let lines = [];

    sqlScript.split(/[\r\n]+/).forEach((str) => {
        str = str.split("--")[0];
        str = str.split("#")[0];

        if (!containsValidSQLCharacters(str)) {
            return;
        }

        lines.push(str);
    });

    let sqlSentences = [];

    lines
        .join("\n")
        .split(";")
        .forEach((str) => {
            if (!containsValidSQLCharacters(str)) {
                return;
            }

            sqlSentences.push(`${str};`.replace(/[\r\n]+/g, ""));
        });

    return sqlSentences;
}

module.exports = { getSqlSentences };
