import {OrganiserInterface} from "../../core/interfaces/organiserInterface";
import {UserEntity} from "../../core/entities/userEntity";
import {UserDto} from "../../core/dto/UserDto";
import User from "../database/schema/userSchema";
import * as bcrypt from "bcrypt";

export class OrganiserRepositoryImpl implements OrganiserInterface{
    private readonly userModel;
    constructor(userModel = User) {
        this.userModel = userModel;
    }

    async delete(id: string): Promise<{ message: string }> {
        const deletedUser = await this.userModel.findByIdAndDelete(id)
        if (!deletedUser){
            throw new Error('User not found')
        }
        return {message: 'User deleted successfully'}
    }

    async index(): Promise<UserEntity[]> {
        return await this.userModel.find({role: 'participant'}).select('_id name email role created_at')
    }

    async store(userDto: UserDto): Promise<UserEntity> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userDto.password, saltRounds);

        const createUser = await this.userModel.create({
            name: userDto.name,
            email: userDto.email,
            password: hashedPassword,
            role: userDto.role
        });

        return new UserEntity(createUser.name, createUser.email, createUser.password, createUser.role);
    }

    async update(id: string, userDto: UserDto): Promise<{ message: string }> {
        const updateUser = await this.userModel.findByIdAndUpdate(id, userDto, {new: true})
        if (!updateUser){
            throw new Error('User not found')
        }
        return {message: 'User Updated Success'}
    }

}