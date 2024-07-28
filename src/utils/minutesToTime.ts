export default (min: number, military = false) : string => {
    const hr = ~~(min / 60);
    const rmin = min % 60;

    const hr_format = military ? hr : hr % 12;
    return `${military ? hr_format : hr_format === 0 ? 12 : hr_format}:${rmin.toString().padStart(2, '0')}${military ? '' : ` ${hr > 11 ? 'PM' : 'AM'}`}`
}