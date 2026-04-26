import type { syllogism, proposition, propType, propositionKey } from "./types.js";

const propositionType: Record<propositionKey, propType> = {
    "all-true": "A",
    "no-true": "E",
    "some-true": "I",
    "some-false": "O",
    "all-false": "E",
    "no-false": "A"
}

const quantityKey = ["all", "some", "no"];
const affirmativeKey = ["is", "are"];
const dissentingKey = ["isnt", "arent"];


const engine = (data: syllogism) => {
    const { lineOne, lineTwo } = data;

    const premiseOne = lineOne.trim().split(/\s+/);
    const premiseTwo = lineTwo.trim().split(/\s+/);

    if (premiseOne.length !== 3 && premiseOne.length !== 4) {
        throw new Error("Major premise is not valid (invalid word count).");
        return;
    }
    if (premiseOne.length !== 3 && premiseOne.length !== 4) {
        throw new Error("Minor premise is not valid (invalid word count).");
        return;
    }
    if (premiseOne.length === 3 && premiseOne.length === 3) {
        throw new Error("Invalid syllogism (Two singular premises).");
        return;
    } 
}

const parser = (premise: string[]) => {
    if (!premise[0] || !premise[2]) {
        throw new Error("Something went wrong type parsing.");
        return;
    }
    const quantifier = premise[0];
    const qualitifier = premise[2];
    if (!quantityKey.includes(quantifier)) {
        throw new Error("First word is not 'all', 'some', or 'no'.");
        return;
    }
    if (!affirmativeKey.includes(qualitifier) && !dissentingKey.includes(qualitifier)) {
        throw new Error("Invalid qualitifier");
        return;
    }

    const quality: boolean = affirmativeKey.includes(qualitifier);

    const propKey = `${premise[0]}-${quality}`;

    const proptype = propKey;
}