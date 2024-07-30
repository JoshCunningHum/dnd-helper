import { db } from "../db";
import deepUnref from "../utils/deepUnref";
import { RequiredBy } from "../utils/types";
import { Character } from "./Characters";
import { Trigger } from "./Triggers";

type StateParam = RequiredBy<State, "name" | "attached" | "data">;

export enum StateType {
    Number,
    Boolean,
    String,
}

export type StateData =
    | {
          type: StateType.Number;
          initial?: number;
          min?: number;
          max?: number;
      }
    | {
          type: StateType.Boolean;
          initial?: boolean;
      }
    | {
          type: StateType.String;
          initial?: string;
          min?: number;
          max?: number;
      };

export class State {
    id: number;
    name: string;
    attached: string[] | Character; // string for tags, number for character IDs
    triggers: Trigger[];
    data: StateData;

    static db = db.states;

    static add = async (params: StateParam) => {
        const s = new State(params);
        const { id: _, attached, ...rest } = s;
        const id = await this.db.add({
            ...rest,
            //@ts-expect-error Serializing converts reference to serializable data
            attached: Array.isArray(attached) ? attached : attached.id,
        });
        s.id = id;
        return s;
    };

    static all = async (characters: Character[]) => {
        const arr = await this.db.toArray();

        // * Deletes all states with non-existing attached characters
        const toBeDeleted: State[] = [];

        const res = arr
            .map((c) => {
                if (!Array.isArray(c.attached)) {
                    //@ts-expect-error
                    const id = c.attached as number;
                    const char = characters.find((ch) => ch.id === id);
                    if (!char) {
                        toBeDeleted.push(c);
                        return null;
                    } else c.attached = char;
                }
                return c;
            })
            .filter((c) => !!c);

        await Promise.all(toBeDeleted.map(async (s) => await s.delete()));

        return res;
    };

    constructor({ id, name, attached, data, triggers }: StateParam) {
        this.id = id || -1;
        this.name = name;
        this.attached = attached;
        this.data = data;

        this.triggers = triggers || [];
    }

    /* TODO: Verify if all triggers are applicable to the attached 
        - For character attached (on state.attached/condition.args etc), check if character exists
        - For state attached, check if state exists
    */

    async update() {
        const { id, attached, ...rest } = this;
        await State.db.update(
            id,
            //@ts-expect-error Serializing converts reference to serializable data
            deepUnref({
                ...rest,
                attached: Array.isArray(attached) ? attached : attached.id,
            }),
        );
    }

    async delete() {
        await State.db.delete(this.id);
    }
}

type StateInstanceParam = RequiredBy<StateInstance, "state">;

// This is created/instantiated when doing Encounters/Sessions
export class StateInstance {
    id: number;
    state: State;
    #value: any;

    constructor({ state, id }: StateInstanceParam) {
        this.id = id || -1;

        // Add the Event Listeners
        this.state = state;
    }
}

db.states.mapToClass(State);
