import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from './models';
import { LoginDto, RegisterDto } from './dtos';
import { JwtHelper } from 'src/helpers';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtHelper: JwtHelper,
  ) {}

  async login(payload: LoginDto) {
    const fuser = await this.userModel.findOne({
      where: { email: payload.email },
    });

    if (!fuser) {
      throw new NotFoundException('user not found');
    }

    const isUserMatch = bcrypt.compareSync(
      payload.password,
      fuser.password,
    );

    if (!isUserMatch) {
      throw new ConflictException('givven password eror');
    }

    const { token } = await this.jwtHelper.generateToken({
      id: fuser.id,
      role: fuser.role,
    });

    return {
      message: 'wellcome',
      token,
      data: fuser,
    };
  }

  async register(payload: RegisterDto) {
    const fuser = await this.userModel.findOne({
      where: { email: payload.email },
    });

    if (fuser) {
      throw new ConflictException("user already exists");
    }

    const passHash = bcrypt.hashSync(payload.password);

    const user = await this.userModel.create({
      email: payload.email,
      name: payload.name,
      age: payload.age,
      password: passHash,
    });

    return {
      message: "success",
      data: user,
    };
  }
}
