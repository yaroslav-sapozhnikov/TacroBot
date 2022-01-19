export class Parser {

    public static dateParser (dateString: string): Date {

        let date: Date = null;

        try {

            const dateArray: number[] = dateString.split('.').reverse().map(c => parseInt(c))
            date = new Date(dateArray[0], dateArray[1], dateArray[2])

        } finally {}

        return date;
    }


    public static instagramParser (instagram: string): string {

        if (instagram[0] != '@') {
            instagram = '@' + instagram
        }

        return instagram;
    }

}