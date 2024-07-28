export default (minutes: number) : string => {
    const hrs = ~~(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? ` ${hrs} hr${hrs > 1 ? 's' : ''}` : ''}${mins > 0 ? ` ${mins} mins` : ''}`
}