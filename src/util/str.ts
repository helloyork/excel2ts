
export function sanitizeString(input: string) {
    return input.replace(/[^a-zA-Z0-9]/g, '');
}

