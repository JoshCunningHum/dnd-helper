import { RequiredBy } from "../utils/types";
import uuid from "../utils/uuid";

type SessionParmas = RequiredBy<Session, "name">;
export class Session {
    id: string;
    name: string;
    created: number;
    duration: number;
    description?: string;

    constructor({ name, created, duration, id, description }: SessionParmas) {
        this.id = id || uuid(16);

        this.name = name;
        this.created = created || Date.now();
        this.duration = duration || -1;
        this.description = description;
    }

    end() {
        this.duration = Date.now() - this.created;
    }

    continue() {
        this.duration = -1;
    }
}
