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
    if (premiseTwo.length !== 3 && premiseTwo.length !== 4) {
        throw new Error("Minor premise is not valid (invalid word count).");
        return;
    }
    if (premiseOne.length === 3 && premiseTwo.length === 3) {
        throw new Error("Invalid syllogism (Two singular premises).");
        return;
    } 
}

const parser = (premise: string[]) => {
    if (premise.length === 0) {
        throw new Error("Something went wrong parsing.");
        return;
    }
    const argOne = premise[0]!;
    if (!quantityKey.includes(argOne) && premise.length !== 3) {
        throw new Error("Something went wrong parsing.");
        return;
    }
    
    let polarity: boolean = false;
    for (let i = 0; i < premise.length; i++) {
        if (!premise[0]) {
            continue;
        }
        const word = premise[0];
        if (affirmativeKey.includes(word)) {
            polarity = true;
            break;
        }
    }
    if (polarity === false) {
        throw new Error("Couldn't identify quality.")
        return;
    }
}