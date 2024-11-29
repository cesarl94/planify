function getMySQLDateFormat(date = new Date()) {
    const pad = (num) => num.toString().padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function isValidBcryptHash(hash) {
    const bcryptRegex = /^\$2[ayb]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/;
    return bcryptRegex.test(hash);
}

module.exports = { getMySQLDateFormat, isValidBcryptHash };
