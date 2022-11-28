import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ObjectID, PrimaryColumn} from "typeorm";

@Entity('santa_request')
export class SantaRequest extends BaseEntity{

    @PrimaryColumn()
    private _vkUserId: number;

    @Column({nullable: true})
    private _santaId: number;

    @Column()
    private _address: string;

    @Column()
    private _description: string;

    @Column()
    private _isDelivered: boolean;

    @Column({nullable: true})
    private _deliverInfo: string;


    get vkUserId(): number {
        return this._vkUserId;
    }

    set vkUserId(value: number) {
        this._vkUserId = value;
    }

    get santaId(): number {
        return this._santaId;
    }

    set santaId(value: number) {
        this._santaId = value;
    }

    get address(): string {
        return this._address;
    }

    set address(value: string) {
        this._address = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get isDelivered(): boolean {
        return this._isDelivered;
    }

    set isDelivered(value: boolean) {
        this._isDelivered = value;
    }

    get deliverInfo(): string {
        return this._deliverInfo;
    }

    set deliverInfo(value: string) {
        this._deliverInfo = value;
    }
}