export const extractWords = (text: string) => {
    const words = text.match(/\b\w+\b/g);
    const stopWordsSet = new Set([
        "the",
        "and",
        "is",
        "in",
        "on",
        "at",
        "of",
        "a",
        "to",
        "for",
        "with",
        "as",
        "by",
        "this",
        "that",
        "it",
        "they",
        "their",
        "them",
        "his",
        "her",
        "he",
        "she",
        "i",
        "you",
        "we",
        "us",
        "me",
        "my",
        "your",
        "its",
        "our",
        "those",
        "these",
        "who",
        "whom",
        "which",
        "what",
        "when",
        "where",
        "why",
        "how",
        "some",
        "any",
        "no",
        "all",
        "both",
        "each",
        "few",
        "many",
        "much",
        "neither",
        "either",
        "none",
    ]);

    return words
        ? words.filter((word) => {
            const notStopWord = !stopWordsSet.has(word.toLowerCase());
            const notCapitalized = word[0] !== word[0].toUpperCase();
            const isLongEnough = word.length > 3 && word.length <= 12;
            return notStopWord && notCapitalized && isLongEnough;
        })
        : [];
};

export const countWordFrequencies = (words: string[]) => {
    const wordCounts: { [key: string]: number } = {};
    words.forEach((word) => {
        wordCounts[word.toUpperCase()] = (wordCounts[word.toUpperCase()] || 0) + 1;
    });
    return wordCounts;
};

export const getTopWords = (
    wordCounts: { [key: string]: number },
    count: number
) => {
    const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
    const topWords = sortedWords.slice(0, count);
    const lastFrequency = topWords[topWords.length - 1][1];
    const extraWords = sortedWords
        .slice(count)
        .filter((word) => word[1] === lastFrequency);
    if (extraWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * extraWords.length);
        topWords[topWords.length - 1] = extraWords[randomIndex];
    }

    return topWords.map((word) => word[0]);
};