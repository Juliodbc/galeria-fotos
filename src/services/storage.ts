import { Preferences } from '@capacitor/preferences';
export interface User { name: string; email: string; password: string }
export interface Photo { id: string; dataUrl: string; createdAt: string }
const USER = 'foco:user'; const SESSION = 'foco:session';
export async function register(user: User) { await Preferences.set({ key: USER, value: JSON.stringify(user) }); }
export async function login(email: string, password: string) { const value = (await Preferences.get({ key: USER })).value; const user = value ? JSON.parse(value) as User : null; if (!user || user.email.toLowerCase() !== email.toLowerCase() || user.password !== password) return false; await Preferences.set({ key: SESSION, value: user.email }); return true; }
export async function logout() { await Preferences.remove({ key: SESSION }); }
export async function isAuthenticated() { return Boolean((await Preferences.get({ key: SESSION })).value); }
async function photoKey() { return `foco:photos:${(await Preferences.get({ key: SESSION })).value ?? 'none'}`; }
export async function getPhotos(): Promise<Photo[]> { const value = (await Preferences.get({ key: await photoKey() })).value; return value ? JSON.parse(value) as Photo[] : []; }
export async function addPhoto(dataUrl: string) { const photos = await getPhotos(); photos.unshift({ id: crypto.randomUUID(), dataUrl, createdAt: new Date().toISOString() }); await Preferences.set({ key: await photoKey(), value: JSON.stringify(photos) }); return photos; }
export async function removePhoto(id: string) { const photos = (await getPhotos()).filter(p => p.id !== id); await Preferences.set({ key: await photoKey(), value: JSON.stringify(photos) }); return photos; }
