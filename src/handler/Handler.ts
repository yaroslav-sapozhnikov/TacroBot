import { Bot } from "../bot/Bot";
import { MessageContext} from "vk-io";
import { User } from "../entity/User";
import { RegisterKeyboard } from "../keyboard/RegisterKeyboard";
import {RegisterValidator} from "../validator/RegisterValidator";
import {organType, statusType, userObject} from "../type/Types";
import {Parser} from "../pasrser/Parser";
import {Answer} from "vk-io-question";


export class Handler {

    public static async helloHandler (bot: Bot, context: MessageContext): Promise<string> {

        const [user] = await bot.utils().api.users.get({
            user_id: context.senderId
        });

        const answer: string = `Привет, [id${user.id}|${user.first_name}]`;

        return answer;
    }


    public static async inviteHandler (bot: Bot, context: MessageContext): Promise<string> {

        const userTemplate: object = {
            vkUserId: context.eventMemberId
        }

        const userExists: boolean = (await bot.utils().connection.manager.find(User, userTemplate)).length !== 0;

        const [user] = await bot.utils().api.users.get({
            user_id: context.eventMemberId
        });

        let answer: string = '';

        if (userExists) {
            answer = `Приветствую, [id${user.id}|${user.first_name}]! Вот, что я знаю об этом пользователе: \n\n [Инфа о пользователе, которую он заполнил в анкете]`;
        } else {
            answer = `Приветствую, [id${user.id}|${user.first_name}]! Зарегистрируйся, пожалуйста, в личных сообщениях`;
        }

        return answer;
    }


    public static async registerHandler (bot: Bot, context: MessageContext): Promise<string> {

        const user: User = new User();


        const answerValidationLoop = async (validator, question, keyboard?): Promise<string>  => {

            let answer = await context.question(question, {keyboard})

            while (true) {

                if (validator(answer.text) || answer.text === "Пропуск") {
                    break;
                }
                answer = await context.question("Пожалуйста, введите корректное значение", {keyboard})
            }
            return answer.text;
        }


        await context.send('Здарова заибал))))');


        user.name = await answerValidationLoop(
            RegisterValidator.nameValidator,
            'Введите Ваше имя'
        );

        user.lastName = await answerValidationLoop(
            RegisterValidator.nameValidator,
            'Введите вашу фамилию'
        );

        user.dateOfBirth = Parser.dateParser(await answerValidationLoop(
            RegisterValidator.dateValidator,
            'Введите вашу дату рождения'
        ));

        user.dateOfOperation = Parser.dateParser(await answerValidationLoop(
            RegisterValidator.dateValidator,
            'Введите вашу дату операции'
        ));

        user.status = (await answerValidationLoop(
            RegisterValidator.statusValidator,
            'Введите ваш статус',
            RegisterKeyboard.statusKeyboard())
        ).toLowerCase() as statusType;


        user.organ = [];

        if (user.status.toLowerCase() === "пересажен") {

            user.organ.push((await answerValidationLoop(
                    RegisterValidator.organValidator,
                    'Какой орган у вас пересажен?',
                    RegisterKeyboard.organKeyboard())
            ).toLowerCase() as organType);

        } else if (user.status.toLowerCase() === "ожидает") {

            user.organ.push((await answerValidationLoop(
                    RegisterValidator.statusValidator,
                    'Какой орган вы ожидаете?',
                    RegisterKeyboard.organKeyboard())
            ).toLowerCase() as organType);

        }


        user.instagram = await answerValidationLoop(RegisterValidator.instagramValidator, 'Введите ваш инстаграм');

        const description: Answer = await context.question('Расскажите о себе');
        user.description = description.text

        await context.send(
            `${user.name}\n${user.lastName}\n${user.dateOfBirth.toDateString()}\n${user.dateOfOperation.toDateString()}\n${user.organ.toString()}\n${user.status}\n${user.instagram}\n${user.description}`
        );

        return;
    }
}