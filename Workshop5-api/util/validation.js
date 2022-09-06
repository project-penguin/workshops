export function checkId(id) {
    return /^[a-fA-F0-9]{24}$/.test(id)
}