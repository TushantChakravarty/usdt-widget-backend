

export function responseMapping(code, msg) {
    return {
        code: code,
        message: msg,
    }
}

export function responseMappingError(code, msg) {
    return {
        code: code,
        error: msg,
    }
}

export function responseMappingWithData(code, msg, data) {
    return {
        code: code,
        message: msg,
        data: data
    }
}



