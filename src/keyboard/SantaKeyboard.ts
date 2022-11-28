import {Keyboard, KeyboardBuilder} from "vk-io";

export class SantaKeyboard {

    public static mainKeyboard (isRegistered: boolean): KeyboardBuilder {

        const date: Date = new Date();
        const is5DecPassed: boolean = date.getDate() >= 5 && date.getMonth() != 11

        if (is5DecPassed && isRegistered)
            return Keyboard.builder()
                .textButton({
                    label: 'Моя анкета',
                    payload: {
                        command: 'Санта Анкета',
                    },
                    color: "primary",
                })
                .row()
                .textButton({
                    label: 'Статус',
                    payload: {
                        command: 'Санта Статус'
                    },
                    color: "secondary",
                })
                .row()
                .textButton({
                    label: 'Доставка',
                    payload: {
                        command: 'Санта Доставка'
                    },
                    color: "secondary",
                })
                .textButton({
                    label: 'Получатель',
                    payload: {
                        command: 'Санта Получатель'
                    },
                    color: "secondary",
                })
                .inline()
        else if (isRegistered)
            return Keyboard.builder()
                .textButton({
                    label: isRegistered ? 'Изменить анкету' : 'Регистрация',
                    payload: {
                        command: 'Санта Регистрация',
                    },
                    color: "primary",
                })
                .row()
                .textButton({
                    label: 'Моя анкета',
                    payload: {
                        command: 'Санта Анкета',
                    },
                    color: "primary",
                })
                .inline()
        else
            return Keyboard.builder()
                .textButton({
                    label: isRegistered ? 'Изменить анкету' : 'Регистрация',
                    payload: {
                        command: 'Санта Регистрация',
                    },
                    color: "primary",
                })
                .inline()
    }
}