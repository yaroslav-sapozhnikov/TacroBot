import validator from 'validator';
import {Parser} from "../pasrser/Parser";

export class RegisterValidator {

    public static nameValidator (name: string): boolean {

        return validator.isAlpha(name, "ru-RU");

    }


    public static dateValidator (dateString: string): boolean {

        // First check for the pattern
        if(!/^\d{1,2}.\d{1,2}.\d{4}$/.test(dateString))
            return false;

        // Parse the date parts to integers
        let parts = dateString.split(".");
        let day = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10);
        let year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        let monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        // Adjust for leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];

    }


    public static statusValidator (status: string): boolean {

        return status == 'Пересажен' || status == 'Ожидает';

    }

    public static organValidator (organ: string): boolean {

        return organ == 'Сердце' || organ == 'Легкие' || organ == 'Почка' || organ == 'Печень';

    }


    public static instagramValidator (instagram: string): boolean {

        // return validator.isAlpha(instagram);
        return true;

    }

}