import { db } from "../db";
import { EventEmitter, RequiredBy } from "../utils/types";

type StateParam = RequiredBy<State, "name">;

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

export class State extends EventEmitter {
    id: number;
    name: string;

    static db = db.states;

    constructor({ id, name }: StateParam) {
        super();
        this.id = id || -1;
        this.name = name;
    }
}

db.states.mapToClass(State);
