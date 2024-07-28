export default (enumObj: object): string[] => {
	return Object.keys(enumObj).filter((key) => isNaN(Number(key)));
};
