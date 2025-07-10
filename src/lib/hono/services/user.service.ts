import { User, CreateUser } from "@/lib/hono/schemas/user.schema";

const fakeDb: User[] = [];

export async function createUserService(newUser: CreateUser): Promise<User> {
  const createdUser = {
    ...newUser,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };
  fakeDb.push(createdUser);
  return createdUser;
}

export async function getUserService(id: string): Promise<User | null> {
  const user = fakeDb.find((u) => u.id === id);
  return user || null;
}
