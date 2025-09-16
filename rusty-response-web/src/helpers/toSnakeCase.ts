const toSnakeCase = (str: string) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export default toSnakeCase