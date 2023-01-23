function dateFilter(value, format='date'){
    if (!value){
        return ''
    }
    const options = {}
    if (format.includes('date')){
        options.day = '2-digit'
        options.month = 'short'
        options.year = 'numeric'
    }
    if (format.includes('time')){
        options.hour = '2-digit'
        options.minute = '2-digit'
        options.second = '2-digit'
        options.hour12 = false

    }
    return new Intl.DateTimeFormat('en-EN', options).format(new Date(value) )
}
function sizeFilter(value){
    return (value / 1024 / 1024).toFixed(2)
}

function audioLengthFilter(value){
    return new Date(value * 1000).toISOString().substr(11, 8)
}

function humanStatusFilter(status){
    const statuses = {
        "NEW": "New",
        "DOWNLOADING": "Downloading",
        "PUBLISHED": "Published",
        "ARCHIVED": "Archived",
        "ERROR": "Error"
    }
    return statuses[status] || status
}

function cutString (value, length) {
    let newValue = value.substr(0, length)
    if (newValue.length < value.length){
      newValue += "..."
    }
    return newValue
}

export {dateFilter, sizeFilter, audioLengthFilter, humanStatusFilter, cutString}
