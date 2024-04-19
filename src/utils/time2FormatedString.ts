/**
 * @param time number of seconds
 * @returns time string formated like h:mm:ss.d (hod, min, sec, decimal)
 */
export const time2FormatedString = (time: number): string => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time - hours * 3600) / 60)
    const seconds = (time - hours * 3600 - minutes * 60).toFixed(1)

    // Pad minutes and seconds with zeros if needed
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(4, '0');

    return `${hours}:${paddedMinutes}:${paddedSeconds}`
}
