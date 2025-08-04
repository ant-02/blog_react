import { format, parseISO } from "date-fns"

export const getDateByFormat = (dateString: string, fm: string) => {
    const date = parseISO(dateString)
    return format(date, fm)
}