/**
 * The icon component name validation
 *
 * Begins with a letter, followed by letters, digits, or hyphens
 */
export function isValidComponentName(name) {
    return /^[a-zA-Z][a-zA-Z0-9-]*$/.test(name);
}
export function isVariantComponent(name) { }
