
export function Singleton<T>() {
    let instance: T | null = null;

    return class {
        static getInstance(...args: any[]): T {
            if (!instance) {
                instance = new (this as any)(...args) as T;
            }
            return instance;
        }
    };
}

