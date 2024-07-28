import Dexie, { type EntityTable } from "dexie";
import { Character } from "../types/Characters";
import { State } from "../types/States";

const db = new Dexie("DNDHelper") as Dexie & {
    characters: EntityTable<Character, "id">;
    states: EntityTable<State, "id">;
};

db.version(1.1).stores({
    characters: "++id, name",
    states: "++id, name",
});

export { db };
