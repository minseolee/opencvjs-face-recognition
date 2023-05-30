const MASKING_LEAST = 150;
const MASKING_MOST = 240;

export function findMostFrequentNumber(array) {
    const frequency = {};
    let maxFrequency = 0;
    let mostFrequentNumber = null;

    for (let i = 0; i < array.length; i++) {
        let num = array[i];
        // if (!num
        //     || num >= MASKING_LEAST
        //     || num <= MASKING_MOST
        //  ) continue;
        if (!num) continue;

        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFrequency) {
            maxFrequency = frequency[num];
            mostFrequentNumber = num;
        }
    }


    return mostFrequentNumber;
}
