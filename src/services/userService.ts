import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { NotFoundError, ConflictError } from '../utils/errors';
import bcrypt from 'bcrypt';
import { createLogger } from '../utils/logger';

const logger = createLogger('UserService');

interface FindAllOptions {
    page: number;
    limit: number;
    sort: string;
    order: 'ASC' | 'DESC';
}

export class UserService {
    private static getRepository() {
        return AppDataSource.getRepository(User);
    }

    /**
     * Find all users with pagination
     */
    static async findAll(options: FindAllOptions): Promise<[User[], number]> {
        const { page, limit, sort, order } = options;
        const skip = (page - 1) * limit;
        
        return this.getRepository().findAndCount({
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                age: true,
                createdAt: true,
                updatedAt: true,
            },
            order: { [sort]: order },
            skip,
            take: limit,
        });
    }

    /**
     * Find user by ID
     */
    static async findById(id: number): Promise<User> {
        const user = await this.getRepository().findOne({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                age: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        
        if (!user) {
            throw new NotFoundError('User', id);
        }
        
        return user;
    }

    /**
     * Create a new user
     */
    static async create(data: { 
        name: string; 
        email: string; 
        password: string; 
        age?: number 
    }): Promise<User> {
        const repo = this.getRepository();
        const existing = await repo.findOne({ 
            where: { email: data.email } 
        });
        
        if (existing) {
            throw new ConflictError('A user with this email already exists');
        }
        
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const user = repo.create({
            ...data,
            password: hashedPassword,
        });
        
        const savedUser = await repo.save(user);
        delete (savedUser as any).password;
        
        return savedUser;
    }

    /**
     * Update an existing user
     */
    static async update(id: number, data: Partial<User>): Promise<User> {
        const repo = this.getRepository();
        const user = await repo.findOne({ where: { id } });
        
        if (!user) {
            throw new NotFoundError('User', id);
        }
        
        if (data.email && data.email !== user.email) {
            const existing = await repo.findOne({ 
                where: { email: data.email } 
            });
            
            if (existing) {
                throw new ConflictError('A user with this email already exists');
            }
        }
        
        Object.assign(user, data);
        
        return repo.save(user);
    }

    /**
     * Delete a user
     */
    static async delete(id: number): Promise<void> {
        const repo = this.getRepository();
        const user = await repo.findOne({ where: { id } });
        
        if (!user) {
            throw new NotFoundError('User', id);
        }
        
        await repo.remove(user);
    }
}