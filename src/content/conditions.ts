import { useCharactersStore } from "@/stores/characters";
import { useStatesStore } from "@/stores/states";
import { Character } from "@/types/Characters";
import { ConditionString } from "@/types/Condition";
import { State } from "@/types/States";
import * as yup from "yup";

export interface ConditionGroup {
    label: string;
    options: (ConditionGroup | ConditionValue)[];
}

export type ConditionValue<T extends yup.AnyObject = {}> = {
    label: string;
    condition_string: ConditionString;
    schema?: () => yup.ObjectSchema<T>;
};

const iscv = (c: ConditionValue | ConditionGroup): c is ConditionValue => "condition_string" in c;

// For editing a node
export const getConditionList = (state: State) => {
    const { states } = useStatesStore();
    const { characters } = useCharactersStore();

    // Encounter
    const encounter_conditions: ConditionGroup = {
        label: "Encounter",
        options: [
            {
                condition_string: "encounter.start",
                label: "Encounter Starts",
            },
            {
                condition_string: "encounter.end",
                label: "Encounter End",
            },
            {
                condition_string: "encounter.next",
                label: "Next Turn",
            },
            {
                condition_string: "encounter.prev",
                label: "Previous Turn",
            },
        ],
    };

    // Session
    const session_conditions: ConditionGroup = {
        label: "Session",
        options: [
            {
                condition_string: "session.start",
                label: "Session Starts",
            },
            {
                condition_string: "session.end",
                label: "Session Ends",
            },
            {
                condition_string: "session.shortr",
                label: "Short Rest",
            },
            {
                condition_string: "session.longr",
                label: "Long Rest",
            },
        ],
    };

    // Character
    const character_conditions: ConditionGroup = {
        label: "Character",
        // @ts-expect-error Overriden by the custom ['own']
        options: [{ name: "Own Character", id: "[own]" }, ...characters].map((c) => ({
            label: c.name,
            options: [
                {
                    condition_string: `character.${c.id}.enters`,
                    label: `${c.name} enters encounter`,
                },
                {
                    condition_string: `character.${c.id}.leave`,
                    label: `${c.name} leaves encounter`,
                },
                {
                    condition_string: `character.${c.id}.turn`,
                    label: `on ${c.name} turn`,
                },
            ],
        })),
    };

    // All characters that has this state
    const attached_characters = characters.filter((c) => state.isAttached(c));

    // Value
    const value_conditions: ConditionGroup = {
        label: "Value",
        // @ts-expect-error Overriden by the custom ['own']
        options: [{ name: "Own Character", id: "[own]" }, ...characters]
            .map((c) => {
                const attached_states = states.filter((s) =>
                    c instanceof Character
                        ? s.isAttached(c)
                        : attached_characters.some((c) => s.isAttached(c)),
                );

                return {
                    label: c.name,
                    // @ts-expect-error Overriden by the custom ['own']
                    options: attached_states.map((s) => ({
                        label: s.name,
                        condition_string: `value.${c.id}.${s.id}`,
                    })),
                    schema: () =>
                        yup.object({
                            type: yup.string().required("Please choose a trigger type"),
                            comparator: yup.mixed().oneOf([yup.string(), yup.number(), yup.bool()]),
                        }),
                } satisfies ConditionGroup;
            })
            .filter((c) => !!c.options.length),
    };

    return [encounter_conditions, session_conditions, character_conditions, value_conditions];
};

export const getConditionFromString = (str: ConditionString, state: State) => {
    const { characters: character_list } = useCharactersStore();
    const { states: state_list } = useStatesStore();

    const [type, first, second] = str.split(".");
    const list = getConditionList(state);
    const [encounters, sessions, characters, values] = list;

    switch (type) {
        case "encounter":
            return encounters.options.find(
                (g) => "condition_string" in g && g.condition_string === str,
            )! as ConditionValue;
        case "session":
            return sessions.options.find(
                (g) => "condition_string" in g && g.condition_string === str,
            ) as ConditionValue;
        case "character":
            const c_char = character_list.find((c) => String(c.id) === first);

            const c_cgroup = characters.options.find(
                (c) => !c_char || c.label === c_char.name,
            ) as ConditionGroup;
            if (!c_cgroup) return null;

            return c_cgroup.options.find(
                (g) => iscv(g) && g.condition_string === str,
            ) as ConditionValue;
        case "value":
            const v_char = character_list.find((c) => String(c.id) === first);

            const v_cgroup = values.options.find(
                (c) => !v_char || c.label === v_char.name,
            ) as ConditionGroup;

            console.log(v_cgroup);

            if (!v_cgroup) return null;

            const v_state = state_list.find((s) => String(s.id) === second);
            if (!v_state) return null;

            console.log(v_state);

            return v_cgroup.options.find(
                (g) => iscv(g) && g.label === v_state.name,
            ) as ConditionValue;
    }
    return null;
};
