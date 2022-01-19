import {Column, PrimaryGeneratedColumn} from "typeorm";

export type organType = 'Сердце'|'Легкие'|'Почка'|'Печень'

export type statusType = 'Ожидает'|'Пересажен'

export type userObject = {

    vkUserId: number,
    name: string,
    lastName: string,
    dateOfBirth: Date,
    dateOfOperation: Date,
    organ: organType[],
    status: statusType,
    instagram: string,
    description: string,

}