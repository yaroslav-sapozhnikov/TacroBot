import {Bot} from "../bot/Bot";
import {MessageContext} from "vk-io";
import {User} from "../entity/User";
import {RegisterKeyboard} from "../keyboard/RegisterKeyboard";
import {RegisterValidator} from "../validator/RegisterValidator";
import {organType, statusType} from "../type/Types";
import {Parser} from "../pasrser/Parser";
import {Answer} from "vk-io-question";
import {SantaRequest} from "../entity/SantaRequest";
import {SantaKeyboard} from "../keyboard/SantaKeyboard";
import {DateUtils} from "typeorm/util/DateUtils";


export class Handler {

    public static async helloHandler (bot: Bot, context: MessageContext): Promise<string> {

        const [user] = await bot.utils().api.users.get({
            user_id: context.senderId
        });

        const answer: string = `Привет, [id${user.id}|${user.first_name}]`;

        return answer;
    }

    public static async santaHandler (bot: Bot, context: MessageContext): Promise<string> {

        const [userInfo] = await bot.utils().api.users.get({
            user_id: context.senderId
        });

        const santaRequest: SantaRequest = await SantaRequest.findOne({
            where: {
                _vkUserId: context.senderId
            }
        });

        await context.send(
            `Привет, [id${userInfo.id}|${userInfo.first_name}]. Рад, что ты захотел поучаствовать в тайном Санте!`,
            {keyboard: SantaKeyboard.mainKeyboard(santaRequest != null)}
        );

        return;
    }

    public static async santaRegisterHandler (bot: Bot, context: MessageContext): Promise<string> {

        const date: Date = new Date();
        if (date.getDate() >= 5 && date.getMonth() != 11) {
            await context.send(
                'Регистрация доступна до 5 декабря :('
            );
            return;
        }

        const [userInfo] = await bot.utils().api.users.get({
            user_id: context.senderId
        });

        const request: SantaRequest = new SantaRequest();

        request.description = (
            await context.question(
                'Опиши себя и свои увлечения, чтобы твоему Санте было проще подобрать подарок, ' +
                'а также наиболее удобный для тебя способ получения товара, если это принципиально'
            )
        ).text;
        request.address = (await context.question('Напиши мне свой адрес, а также ближайшие пункты выдачи вб/озон')).text;
        request.vkUserId = userInfo.id;
        request.isDelivered = false;

        await request.save();

        await context.send(
            'Спасибо за регистрацию!'
        );

        return;
    }


    public static async santaRandomHandler (bot: Bot, context: MessageContext): Promise<string> {

        const srList: SantaRequest[] = await SantaRequest.find();
        const usersIdList: number[] = [];

        for (let i = 0; i < srList.length; i++) {
            usersIdList.push(srList[i].vkUserId);
        }

        for (let i = 0; i < srList.length; i++) {
            const sr: SantaRequest = srList[i]
            while (true) {
                const index = Math.floor(Math.random() * usersIdList.length);
                const id: number = usersIdList[index];
                if (id != null && id != sr.vkUserId) {
                    sr.santaId = id;
                    usersIdList[index] = null
                    break;
                }
            }
            await sr.save();
        }

        return;
    }

    public static async santaStatusHandler (bot: Bot, context: MessageContext): Promise<string> {

        const santaRequest: SantaRequest = await SantaRequest.findOne({
            where: {
                _vkUserId: context.senderId
            }
        });

        let msg: string = "";

        if (santaRequest.isDelivered) {
            msg += "Твой подарок доставлен! \n\n" + santaRequest.deliverInfo;
        } else {
            msg = "Твой подарок пока не доставлен :(";
        }

        context.send(msg);

        return;
    }

    public static async santaReceiverHandler (bot: Bot, context: MessageContext): Promise<string> {

        const santaRequest: SantaRequest = await SantaRequest.findOne({
            where: {
                _santaId: context.senderId
            }
        });

        await context.send(
            `Адрес твоего получателя: ${santaRequest.address} \n\nПредпочтения твоего получателя: ${santaRequest.description}`
        );

        return;
    }

    public static async santaMeHandler (bot: Bot, context: MessageContext): Promise<string> {

        const santaRequest: SantaRequest = await SantaRequest.findOne({
            where: {
                _vkUserId: context.senderId
            }
        });

        await context.send(
            `Твой адрес: ${santaRequest.address} \n\nТвои предпочтения и рекомендации: ${santaRequest.description}`
        );

        return;
    }


    public static async santaDeliveryHandler (bot: Bot, context: MessageContext): Promise<string> {

        const santaRequest: SantaRequest = await SantaRequest.findOne({
            where: {
                _santaId: context.senderId
            }
        });

        santaRequest.deliverInfo = (await context.question('Напиши инструкцию, как получить твой подарок')).text;
        santaRequest.isDelivered = true;
        await santaRequest.save();

        await context.send('Инструкция успешно сохранена. Если захочешь ее изменить, то напиши или нажми "Доставка" заново)');

        return;
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


        // user.organ = [];
        //
        // if (user.status.toLowerCase() === "пересажен") {
        //
        //     user.organ.push((await answerValidationLoop(
        //             RegisterValidator.organValidator,
        //             'Какой орган у вас пересажен?',
        //             RegisterKeyboard.organKeyboard())
        //     ).toLowerCase() as organType);
        //
        // } else if (user.status.toLowerCase() === "ожидает") {
        //
        //     user.organ.push((await answerValidationLoop(
        //             RegisterValidator.statusValidator,
        //             'Какой орган вы ожидаете?',
        //             RegisterKeyboard.organKeyboard())
        //     ).toLowerCase() as organType);
        //
        // }


        user.instagram = await answerValidationLoop(RegisterValidator.instagramValidator, 'Введите ваш инстаграм');

        const description: Answer = await context.question('Расскажите о себе');
        user.description = description.text

        // await context.send(
        //     `${user.name}\n${user.lastName}\n${user.dateOfBirth.toDateString()}\n${user.dateOfOperation.toDateString()}\n${user.organ.toString()}\n${user.status}\n${user.instagram}\n${user.description}`
        // );

        return;
    }
}