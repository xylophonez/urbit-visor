export function processName(shipName: string): string{
    if(shipName.length > 30){
        return `${shipName.substring(0,6)}_${shipName.slice(-6)}`
    } else{
        return shipName
    }
}

export function whatShip(shipName: string) : string{
    if (shipName.length > 30) return "comet" 
    if (shipName.length > 14) return "moon" 
    if (shipName.length > 7) return "planet"
    if (shipName.length > 4) return "star"
    else return "galaxy"
}

export const permDescriptions = {
    shipName: "The name (@p) of your Urbit ship/identity.",
    shipURL: "The URL of your running Urbit ship.",
    scry: "Reads data from your Urbit ship.",
    poke: "Sends data to your Urbit ship.",
    thread: "Issues spider threads in your Urbit ship.",
    subscribe: "Reads a continuous stream of data from your Urbit ship."
}
