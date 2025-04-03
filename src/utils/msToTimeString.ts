export function msToTimeString(ms: number, abbreviate: boolean = false): string {
	const years: number = Math.floor(Math.abs(ms) / (1000 * 60 * 60 * 24 * 365));
	const months: number = Math.floor((Math.abs(ms) % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
	const weeks: number = Math.floor((Math.abs(ms) % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7));
	const days: number = Math.floor((Math.abs(ms) % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
	const hours: number = Math.floor((Math.abs(ms) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes: number = Math.floor((Math.abs(ms) % (1000 * 60 * 60)) / (1000 * 60));

	if (years > 0) return `${years}${abbreviate ? "y" : ` year${ years != 1 ? 's' : ''}`}`;
	if (months > 0) return `${months}${abbreviate ? "mo" : ` month${ months != 1 ? 's' : ''}`}`;
	if (weeks > 0) return `${weeks}${abbreviate ? "w" : ` week${ weeks != 1 ? 's' : ''}`}`;
	if (days > 0) return `${days}${abbreviate ? "d" : ` day${ days != 1 ? 's' : ''}`}`;
	if (hours > 0) return `${hours}${abbreviate ? "h" : ` hour${ hours != 1 ? 's' : ''}`}`;
	return `${minutes}${abbreviate ? "m" : ` minute${ minutes != 1 ? 's' : ''}`}`;
}