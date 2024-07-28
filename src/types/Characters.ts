import { db } from "../db";
import deepUnref from "../utils/deepUnref";
import randomColor from "../utils/randomColor";
import { RequiredBy } from "../utils/types";

type CharacterParam = RequiredBy<Character, "name">;

export class Character {
    id: number;
    name: string;
    color: string;
    description?: string;
    image?: Blob;
    tags: string[];

    static db = db.characters;

    static add = async (params: CharacterParam) => {
        const c = new Character(params);
        const { id: _, ...rest } = c;
        const id = await this.db.add(rest);
        c.id = id;
        // Prevents refetching the DB
        return c;
    };

    /**Instantiate the data since only the properties are stored */
    static all = async () => await this.db.toArray();

    constructor({ id, name, color, description, image, tags }: CharacterParam) {
        this.id = id || -1;
        this.name = name;

        this.color = color || randomColor();
        this.description = description;
        this.image = image;
        this.tags = tags || [];
    }

    /**
     * When changing the values in here, you have to manually call this function to update it in IndexDB
     */
    async update() {
        const { id, ...rest } = this;
        await Character.db.update(id, deepUnref(rest));
    }

    async delete() {
        await Character.db.delete(this.id);
    }
}

db.characters.mapToClass(Character);
