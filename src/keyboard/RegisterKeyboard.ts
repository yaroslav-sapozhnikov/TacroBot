import {Keyboard, KeyboardBuilder} from "vk-io";

export class RegisterKeyboard {

    public static statusKeyboard (): KeyboardBuilder {

        return Keyboard.builder()
            .textButton({
                label: 'Пересажен',
                payload: {
                    command: 'Пересажен',
                },
                color: "positive"
            })
            .textButton({
                label: 'Ожидает',
                payload: {
                    command: 'Ожидает'
                },
                color: "negative",
            })
            .inline()
    }


    public static organKeyboard (): KeyboardBuilder {

        return Keyboard.builder()
            .textButton({
                label: 'Сердце',
                payload: {
                    command: 'Сердце'
                },
                color: "negative",
            })
            .textButton({
                label: 'Легкие',
                payload: {
                    command: 'Легкие'
                },
                color: "primary",
            })
            .row()
            .textButton({
                label: 'Почка',
                payload: {
                    command: 'Почка'
                },
                color: "positive",
            })
            .textButton({
                label: 'Печень',
                payload: {
                    command: 'Печень'
                },
                color: "secondary",
            })
            .inline()
    }

}