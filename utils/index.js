exports.omit = (obj, keys) => {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
        if (!keys.includes(key)) {
            newObj[key] = value;
        }
    }
    return newObj;
}

exports.isUrl = (string) => {
    const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;

    const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
    const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
    if (typeof string !== 'string') {
        return false;
    }

    const match = string.match(protocolAndDomainRE);
    if (!match) {
        return false;
    }

    const everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
        return false;
    }

    if (localhostDomainRE.test(everythingAfterProtocol) ||
        nonLocalhostDomainRE.test(everythingAfterProtocol)) {
        return true;
    }

    return false;
}