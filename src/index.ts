import "reflect-metadata";
import { Bot } from "./bot/Bot";


const bot: Bot = new Bot();

bot.start().catch(error => console.log(error));


