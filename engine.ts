import type { lines, proposition, propType, propositionKey, quantity, quality, termOrder, figureOrder, figure, mood, qualityText, qualityTextTypes } from "./types.js";

const propositionType: Record<propositionKey, propType> = {
    "all-true": "A",
    "no-true": "E",
    "some-true": "I",
    "some-false": "O",
    "all-false": "E",
    "no-false": "A",
    "singular-true": "A",
    "singular-false": "E"
}

const quantityPatternKey: Record<string, quantity> = {
    "all": "all",
    "every": "all",
    "each": "all",
    "no": "no",
    "none": "no",
    "some": "some",
    "few": "some",
    "least": "some"
}

const figureKey: Record<figureOrder, figure> = {
    "m-p,s-m": 1,
    "p-m,s-m": 2,
    "m-p,m-s": 3,
    "p-m,m-s": 4
}

const validMoods: mood[] = [
    "AA-1", "AA-3", "AA-4",
    "EA-1", "EA-2", "EA-3", "EA-4",
    "AI-1", "AI-3",
    "EI-1", "EI-2", "EI-3", "EI-4",
    "AE-2", "AE-4",
    "AO-2",
    "IA-3", "IA-4",
    "OA-3"
]

const concPropTypes: Partial<Record<mood, propositionKey>> = {
    "AA-1": "all-true",
    "AA-3": "some-true",
    "AA-4": "some-true",

    "EA-1": "no-false",
    "EA-2": "no-false",
    "EA-3": "some-false",
    "EA-4": "some-false",

    "AI-1": "some-true",
    "AI-3": "some-true",

    "EI-1": "some-false",
    "EI-2": "some-false",
    "EI-3": "some-false",
    "EI-4": "some-false",

    "AE-2": "no-false",
    "AE-4": "no-false",

    "AO-2": "some-false",

    "IA-3": "some-true",
    "IA-4": "some-true",

    "OA-3": "some-false"
}

const qualityTextKey: Record<qualityText, qualityTextTypes> = {
    "true-true": "is",
    "true-false":"are",
    "false-true": "is not",
    "false-false": "are not"
}
const affirmativeKey = ["is", "are"];
const negativeAddOn = "not";
const singleDissentingKey = ["isnt", "arent"];
const qualityPattern = ["is", "are", "isnt", "arent"]

const IGNORE = new Set(["a", "an", "the", "of", "single"])

const quantityPattern = ["all", "every", "each", "no", "none", "some", "few", "least"];

export const engine = (data: lines) => {
    const { lineOne, lineTwo } = data;

    const premiseOneCheck = lineOne.trim().split(/\s+/);
    const premiseTwoCheck = lineTwo.trim().split(/\s+/);

    //note to self: put premiseOneCheck and premiseTwoCheck in an array and run a for loop
    //for the array to run the code below?
    let premiseOne: proposition;
    let premiseTwo: proposition;
    try {
        premiseOne = parser(premiseOneCheck);
    } catch(e) {
        const detail = e instanceof Error
            ? e.message
            : "Unexpected parsing failure.";

        throw new Error(`Line one failed to parse: ${detail}`)
    }
    try {
        premiseTwo = parser(premiseTwoCheck);
    } catch(e) {
        const detail = e instanceof Error
            ? e.message
            : "Unexpected parsing failure.";

        throw new Error(`Line two failed to parse: ${detail}`)
    }

    const { mood, subject, predicate, singular }= syllogism(premiseOne, premiseTwo);
    const concPropType = concPropTypes[mood];
    if (!concPropType) {
        throw new Error("Something went wrong.");
    }

    const [quantity, quality] = concPropType.split('-') as [quantity, "true" | "false"];

    const qualityText = qualityTextKey[`${quality}-${singular}`];

    if (singular === true) {
        const conclusion = `${subject} ${qualityText} ${predicate}`;
        return conclusion;
    }

    const conclusion = `${quantity} ${subject} ${qualityText} ${predicate}`;
    return conclusion;

}

const parser = (premise: string[]): proposition => {
    let proptype: propType;
    let quality: quality | undefined;
    let quantity: quantity | undefined;
    let subject: string | undefined;
    let predicate: string | undefined;
    if (premise.length < 3) {
        throw new Error("Invalid sentence: premise must be at least 3 words.");
    }

    //cleaner
    for (let i = 0; i < premise.length; i++) {
        if (IGNORE.has(premise[i]!)) {
            premise.splice(i, 1);
            i -= 1;
            continue;
        }
        
        let repeatQuantifier = 0;
        for (const word of premise) {
            if (quantityPattern.includes(word)) {
                repeatQuantifier++;
            }
        }
        if (repeatQuantifier > 1) {
            throw new Error("Invalid premise: repeated quantifier term.");
        }
    }

    if (!premise.some(word => quantityPattern.includes(word))) {
        quantity = "singular";
    }

    //assigning
    for (let i = 0; i < premise.length; i++) {
        //assigning quantity
        if (quantityPattern.includes(premise[i]!)) {
            const cleaned = quantityPatternKey[premise[i]!];
            if (!cleaned) {
                throw new Error("Something went wrong parsing.");
            }
            quantity = cleaned;
            continue;
        }
        
        //assigning subject
        if (quantity !== undefined && subject === undefined) {
            subject = premise[i];
            continue;
        }

        //assigning quality
        if (quantity !== undefined && subject !== undefined && quality === undefined) {
            if (qualityPattern.includes(premise[i]!)) {
                if (singleDissentingKey.includes(premise[i]!)) {
                    quality = false;
                    continue;
                }

                if (affirmativeKey.includes(premise[i]!) && negativeAddOn === premise[i+1]) {
                    quality = false;
                    i += 1;
                    continue;
                }

                quality = true;
                continue;
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

    if (quantity === undefined || quality === undefined || subject === undefined || predicate === undefined) {
        throw new Error("Something went wrong parsing quantity and quality.");
    }
    const propTypeKey: propositionKey = `${quantity}-${quality}`;
    proptype = propositionType[propTypeKey];

        //note to self: delete OneDone, make a array variable in engine of type propostion
        //(or some other way to hold the 2 parsed premsises in engine, then send it into a
        //new function that figures out the middle term, suject, and predicate term for the
        //conclusion while also making sure the premises are given the correct roles of major
        //or minor and gives it back to the engine figure out the mood, figure, and to check
        //with that to see if the lines is valid.
    const cleanedPropostion: proposition = {
        propType: proptype,
        quantity: quantity,
        quality: quality,
        subject: subject,
        predicate: predicate,
    }
    return cleanedPropostion;
}

const syllogism = (
    premiseOne: proposition,
    premiseTwo: proposition
): { mood: mood; subject: string; predicate: string, singular: boolean } => {
    //In this func, find the middleterm first by seeing which word matches in both premises,
    //store the middleterm in a const, then store the premise one and two outer terms in
    //different consts, then based off that, figure out the order of the subject or predicate
    //and middle term in each premise and make a new const of a new type, term order that
    //looks like "p-m", "m-s", etc., and than the easy part, put the two new consts of type
    //termOrder in different orders of each other in a new const and send it off to a new
    //key search of figures to see which kind it is, than from there hold the value of the
    //figure in a new const with the key from the two termOrders sent(possible a another new type
    //to hold two termOrders for one syllogism possibility) and then make a new string by putting
    //together the proptypes of both premises and the recently discovered figure number into an
    //order like "AA-1", then send it off to a new list of valid combinations. There should be two
    //paths that both of which find the figure for the different order of syllogism and whichever one
    //is valid first or at all determines the correct major and minor premises which won't need to be
    //thought of since the syllogism would already be confirmed as valid or not. But it will matter to
    //send the correct outer terms to be the subject and predicate terms of the conclusion.
    const p1Terms = [premiseOne.subject, premiseOne.predicate];
    const p2Terms = [premiseTwo.subject, premiseTwo.predicate];

    const middleTerm = p1Terms.find(x => p2Terms.includes(x));
    if (!middleTerm) {
        throw new Error("Invalid syllogism: no middle term detected.");
    }

    let singular: boolean = false;
    if (premiseOne.quantity === "singular" || premiseTwo.quantity === "singular") {
        singular = true;
    }

    const p1Outer: string = middleTerm === premiseOne.subject ? premiseOne.predicate : premiseOne.subject;
    const p2Outer: string = middleTerm === premiseTwo.subject ? premiseTwo.predicate : premiseTwo.subject;
    const canPremiseOneBeMajor = premiseOne.quantity !== "singular" || premiseTwo.quantity === "singular";
    const canPremiseTwoBeMajor = premiseTwo.quantity !== "singular" || premiseOne.quantity === "singular";

    if (canPremiseOneBeMajor) {
        const probOnep1Order: termOrder = p1Terms[0] === middleTerm ? "m-p" : "p-m";
        const probOnep2Order: termOrder = p2Terms[0] === middleTerm ? "m-s" : "s-m";

        const probOneFigure: figure = figureKey[`${probOnep1Order},${probOnep2Order}`];

        const probOneMood: mood = `${premiseOne.propType}${premiseTwo.propType}-${probOneFigure}`;
        if (validMoods.includes(probOneMood)) {
            return { mood: probOneMood, subject: p2Outer, predicate: p1Outer, singular: singular };
        }
    }

    if (canPremiseTwoBeMajor) {
        const probTwop1Order: termOrder = p1Terms[0] === middleTerm ? "m-s" : "s-m";
        const probTwop2Order: termOrder = p2Terms[0] === middleTerm ? "m-p" : "p-m";

        const probTwoFigure: figure = figureKey[`${probTwop2Order},${probTwop1Order}`];

        const probTwoMood: mood = `${premiseTwo.propType}${premiseOne.propType}-${probTwoFigure}`;
        if (validMoods.includes(probTwoMood)) {
            return { mood: probTwoMood, subject: p1Outer, predicate: p2Outer, singular: singular };
        }
    }

    throw new Error("Syllogism is false.");
}
