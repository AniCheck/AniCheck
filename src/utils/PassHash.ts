import { pbkdf2Sync, randomBytes } from 'crypto';

export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const iterations = 100_000;
    const hash = pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');

    // Format: pbkdf2$100000$salt$hash
    return `pbkdf2$${iterations}$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
    const [algorithm, iterationsStr, salt, originalHash] = stored.split('$');
    if (algorithm !== 'pbkdf2') return false;

    const iterations = parseInt(iterationsStr, 10);
    const hash = pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
    return hash === originalHash;
}