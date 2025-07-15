/**
 * Miden SDK utilities have been removed to avoid Node.js compatibility issues.
 * Address validation is now handled by the validation.util.ts file.
 *
 * If you need Miden SDK functionality in the future, consider:
 * 1. Using it only in client-side code
 * 2. Creating a separate service that handles Miden SDK operations
 * 3. Using WebAssembly bindings if available
 */

export const MIDEN_SDK_REMOVED = true;
