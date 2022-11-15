import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import {organType, statusType, userObject} from "../type/Types";

@Entity('user')
export class User {

    @Column()
    @PrimaryGeneratedColumn()
    private _id: number;

    @Column()
    private _vkUserId: number;

    @Column()
    private _name: string;

    @Column()
    private _lastName: string;

    @Column()
    private _dateOfBirth: Date;

    @Column()
    private _dateOfOperation: Date;

    // @Column()
    // private _organ: organType[];

    @Column()
    private _status: statusType;

    @Column()
    private _instagram: string;

    @Column()
    private _description: string;


    constructor (userObject?: userObject) {

        if (userObject) {
            this._vkUserId = userObject.vkUserId;
            this._lastName = userObject.lastName;
            this._name = userObject.name;
            this._dateOfBirth = userObject.dateOfBirth;
            this._dateOfOperation = userObject.dateOfOperation;
            this._description = userObject.description;
            this._instagram = userObject.instagram;
            this._status = userObject.status;
        }

    }


    get vkUserId(): number {
        return this._vkUserId;
    }

    set vkUserId(value: number) {
        this._vkUserId = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get dateOfBirth(): Date {
        return this._dateOfBirth;
    }

    set dateOfBirth(value: Date) {
        this._dateOfBirth = value;
    }

    get dateOfOperation(): Date {
        return this._dateOfOperation;
    }

    set dateOfOperation(value: Date) {
        this._dateOfOperation = value;
    }

    get status(): statusType {
        return this._status;
    }

    set status(value: statusType) {
        this._status = value;
    }

    get instagram(): string {
        return this._instagram;
    }

    set instagram(value: string) {
        this._instagram = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
}