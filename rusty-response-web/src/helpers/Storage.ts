class Storage {
    set<T = any> (key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value))
    }

    get<T = any> (key: string): T | null {
        const storage = localStorage.getItem(key);
        return storage ? JSON.parse(storage) : null;
    }

    remove (key: string) {
        localStorage.removeItem(key);
    }
}
export default new Storage();