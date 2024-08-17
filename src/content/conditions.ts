import { ConditionString } from "@/types/Condition";
import * as yup from "yup";

export interface ConditionGroup {
    label: string;
    options: (ConditionGroup | ConditionValue)[];
}

export type ConditionValue<T extends yup.AnyObject = {}> =
    | {
          label: string;
          condition_string: ConditionString;
      }
    | {
          label: string;
          schema: () => yup.ObjectSchema<T>;
          condition_string: ConditionString | ((data: T) => ConditionString);
      };
