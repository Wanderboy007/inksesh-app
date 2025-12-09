'use server';

import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

interface UserFormData {
  email: string;
  username?: string;
  profileUrl: string;
  password: string;
}

interface CreateUserResponse {
  success: boolean;
  message: string;
  user?: any;
  error?: string;
  userExists?: boolean;
  userId?: string;
}

export async function createUserProfile(data: UserFormData): Promise<CreateUserResponse> {
  try {
    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        email: true,
        username: true,
        profileUrl: true,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: `User with email "${data.email}" already exists`,
        userExists: true,
        userId: existingUser.id,
        error: 'USER_EXISTS',
      };
    }

    // Check if username is provided and already exists
    if (data.username) {
      const existingUsername = await prisma.user.findFirst({
        where: {
          username: data.username,
        },
      });

      if (existingUsername) {
        return {
          success: false,
          message: `Username "${data.username}" is already taken`,
          error: 'USERNAME_TAKEN',
        };
      }
    }

    // Encrypt password using bcryptjs
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username || data.email.split('@')[0],
        profileUrl: data.profileUrl || null,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        profileUrl: true,
      },
    });

    console.log('User created successfully:', newUser);

    return {
      success: true,
      message: 'Profile created successfully',
      user: newUser,
    };
  } catch (error) {
    console.error('Error creating user profile:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create profile';

    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
}
