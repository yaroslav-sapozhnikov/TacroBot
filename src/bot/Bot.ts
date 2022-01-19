import {Connection, createConnection} from "typeorm";
import {API, Updates, Upload} from "vk-io";
import {Handler} from "../handler/Handler";
import { HearManager } from '@vk-io/hear';
import {
    QuestionManager,
    IQuestionMessageContext, Answer
} from 'vk-io-question';

export class Bot {

    private connection: Connection;
    private api: API;
    private upload: Upload;
    private updates: Updates;
    private questionManager: QuestionManager;
    private hearManager: HearManager<IQuestionMessageContext>;


    public async start (): Promise<void> {

        const TOKEN: string = '08f3046ddd3820e0ab171f68c8044c775a7ef7ad1ef32ad335011f00ef99c2bb111805b2426c38e598e4b';

        this.connection = await createConnection()

        this.api = new API({ token: TOKEN });
        this.upload = new Upload({api: this.api});
        this.updates = new Updates({ api: this.api, upload: this.upload });

        this.questionManager = new QuestionManager();
        this.hearManager = new HearManager<IQuestionMessageContext>();


        this.listen().catch(c => console.log(c));
    }


    private async listen (): Promise<void> {

        this.updates.use(this.questionManager.middleware);
        this.updates.on('message', this.hearManager.middleware);

        this.hearManager.hear('sss', async (context): Promise<void> => {
            await context.send(
                await Handler.helloHandler(this, context)
            );
        })

        this.hearManager.hear('Начать', async (context) => {
            Handler.registerHandler(this, context)
        });


        this.updates.on(['chat_invite_user', 'chat_invite_user_by_link'], async (context): Promise<void> => {

            await context.send(
                await Handler.inviteHandler(this, context)
            )

        });

        this.updates.start().then(r => console.log(r));
    }


    public utils () {
        return {
            connection: this.connection,
            api: this.api,
            upload: this.upload,
            updates: this.updates,
            questionManager: this.questionManager,
            hearManager: this.hearManager,
        }
    }
}
