export default function dateFilter(value, format='date'){
    console.log(value, format)
    const options = {}
    if (format.includes('date')){
        options.day = '2-digit'
        options.month = 'long'
        options.year = 'numeric'
    }
    if (format.includes('time')){
        options.hour = '2-digit'
        options.minute = '2-digit'
        options.second = '2-digit'
    }

    return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value) )
}