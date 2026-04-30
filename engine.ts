import type { syllogism, proposition, propType, propositionKey, quantity, quality, quantityKey } from "./types.js";

const propositionType: Record<propositionKey, propType> = {
    "all-true": "A",
    "no-true": "E",
    "some-true": "I",
    "some-false": "O",
    "all-false": "E",
    "no-false": "A"
}

const quantityPatternKey: Record<string, quantityKey> = {
    "all": "all",
    "every": "all",
    "each": "all",
    "no": "no",
    "none": "no",
    "some": "some",
    "few": "some",
    "least": "some"
}
const quantityKey = ["all", "some", "no"];
const affirmativeKey = ["is", "are"];
const negativeAddOn = "not";
const singleDissentingKey = ["isnt", "arent"];
const qualityPattern = ["is", "are", "isnt", "arent"]

const IGNORE = new Set(["a", "an", "the", "of", "single"])

const postitiveUniversalPattern = ["all", "every", "each"];
const negativeUniversalPattern = ["no", "none"];
const particularPattern = ["some", "few", "least"];
const universalPattern = ["all", "every", "each", "no", "none"];
const quantityPattern = ["all", "every", "each", "no", "none", "some", "few", "least"];

const engine = (data: syllogism) => {
    const { lineOne, lineTwo } = data;

    const premiseOne = lineOne.trim().split(/\s+/);
    const premiseTwo = lineTwo.trim().split(/\s+/);
}

const parser = (premise: string[]) => {
    let proptype: propType;
    let quality: quality | undefined;
    let quantity: quantity | undefined;
    let subject: string | undefined;
    let predicate: string | undefined;
    let quantityIndex: number;
    let subjectIndex: number[] = [];
    let qualityIndex: number[] = [];
    let predicateIndex: number[] = [];
    let cleanPremise: string[] = [];
    if (premise.length < 3) {
        throw new Error("Invalid sentence: premise must be at least 3 words.");
        return;
    }

    //cleaner
    for (let i = 0; i < premise.length; i++) {
        if (IGNORE.has(premise[i]!)) {
            premise.splice(i, 1);
            i -= 1;
            continue;
        }
        
        let repeatQuantifier = 0;
        for (let k = 0; k < quantityPattern.length; k++) {
            const repeatQuantifierTerm = premise.filter(x => x === quantityPattern[k]).length;
            if (repeatQuantifierTerm > 1) {
                throw new Error("Invalid premise: repeated quantifier term.");
                return;
            }
            repeatQuantifier += 1;
        }
        if (repeatQuantifier > 1) {
            throw new Error("Invalid premise: repeated quantifier term.");
            return;
        } else if (repeatQuantifier === 0) {
            quantity = "singular";
        }
        
    }

    //assigning
    for (let i = 0; i < premise.length; i++) {
        //assigning quantity
        if (universalPattern.includes(premise[i]!)) {
            quantity = "universal";
            const cleaned = quantityPatternKey[premise[i]!];
            if (!cleaned) {
                throw new Error("Something went wrong parsing.");
                return;
            }
            cleanPremise.push(cleaned);
            continue;
        } else if (particularPattern.includes(premise[i]!)) {
            quantity = "particular";
            const cleaned = quantityPatternKey[premise[i]!];
            if (!cleaned) {
                throw new Error("Something went wrong parsing.");
                return;
            }
            cleanPremise.push(cleaned);
            continue;
        }
        
        //assigning subject
        if (quantity !== undefined && quality === undefined) {
            subject = premise[i];
            continue;
        }

        //assigning quality
        if (quantity !== undefined && subject !== undefined && predicate === undefined) {
            if (qualityPattern.includes(premise[i]!)) {
                if (singleDissentingKey.includes(premise[i]!) || (affirmativeKey.includes(premise[i]!) && negativeAddOn === premise[i+1])) {
                    quality = false;
                    continue;
                } else {
                    quality = true;
                    continue;
                }
            } else {
                subject += ` ${premise[i]}`;
                continue;
            }
        }

        //assigning predicate
        if (quantity !== undefined && subject !== undefined && quality !== undefined) {
            if (predicate !== undefined) {
                predicate += ` ${premise[i]}`;
                continue;
            }
            predicate = premise[i];
            continue;
        }
    }

    
}
