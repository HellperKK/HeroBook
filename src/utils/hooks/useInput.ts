import { useEffect } from "react";

export function useInput(callback:(e:KeyboardEvent) => void, deps?:unknown[]) {
    function handleInput(e:KeyboardEvent) {
        callback(e);
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        document.addEventListener("keydown", handleInput);
        return () => document.removeEventListener("keydown", handleInput);
    }, deps ?? []);
}