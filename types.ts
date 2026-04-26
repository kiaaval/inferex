
type propType = "A" | "E" | "I" | "O";
type role = "major" | "minor";
type quantity = "universal" | "particular" | "singular";
type quality = "affirmative" | "dissenting";
type propositionKey = "all-true" | "no-true" | "some-true" | "some-false" | "all-false" | "no-false";

type syllogism = {
    lineOne: string;
    lineTwo: string;
}

type proposition = {
    propType?: propType;
    role: role;
    quantity: quantity
    quality: quality;
    subject: string;
    predicate: string;
}


export type {proposition, syllogism, propType, propositionKey};