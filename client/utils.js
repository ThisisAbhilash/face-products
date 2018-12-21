const MILLI_SECS_IN_A_DAY = 1000 * 24 * 3600;
export const url = 'http://localhost:3000';
export const SORT_ORDERS = {
    ASCENDING: 'asc'
}
export const SORT_FIELDS = {
    SIZE: 'size',
    PRICE: 'price',
    ID: 'id'
}
export const defaultConfig = {
    limit: 15,
    show_adv_after_every: 20
}
const dayDiffBetweenTwoDates = (inputDate1, inputDate2) => {
    let timeDiff = Math.abs((new Date(inputDate1)).getTime() - (new Date(inputDate2)).getTime());
    let dayDiff = Math.floor(timeDiff / MILLI_SECS_IN_A_DAY);

    return dayDiff;
}
export const getAddedDateText = addedDate => {
    let dayDiff = dayDiffBetweenTwoDates(addedDate, new Date());
    if(dayDiff < 7) {
        return dayDiff === 0 ? ` Added today.` : ` Added ${dayDiff} day${dayDiff > 1 ? 's':''} ago.`
    }
    return ` Added on ${addedDate}.`
}
export const generateUniqueRandom = (lowerRange, upperRange) => {
    let prevNumber;
    return function randomGenerator() {
        const randNumber = Math.floor(Math.random() * (upperRange - lowerRange + 1));
		prevNumber = randNumber === prevNumber ? randomGenerator() : randNumber;
		return prevNumber;
    }
}