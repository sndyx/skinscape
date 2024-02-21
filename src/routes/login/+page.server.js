import { fail } from "@sveltejs/kit";
import { db, users } from "$lib/db.js";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";
import { lucia } from "$lib/auth.js";

export const actions = {
    register: async ({ cookies, request }) => {
        const data = await request.formData();
        const username = data.get("username");
        const password = data.get("password");
        const email = data.get("email");

        console.log(username, password, email)

        if (typeof username !== "string") {
            fail(400, {
                success: false,
                target: "username",
                message: "Invalid username",
            });
        } else if (username.length < 3) {
            fail(400, {
                success: false,
                target: "username",
                message: "Username must be longer than 2 characters",
            });
        } else if (username.length > 29) {
            fail(400, {
                success: false,
                target: "username",
                message: "Username must be shorter than 30 characters"
            })
        }  else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            fail(400, {
                success: false,
                target: "username",
                message: "Username must only contain letters, numbers, and underscores"
            })
        }

        if (typeof password !== "string") {
            fail(400, {
                success: false,
                target: "password",
                message: "Invalid password",
            });
        } else if (password.length < 6) {
            fail(400, {
                success: false,
                target: "password",
                message: "Password must be longer than 5 characters",
            });
        } else if (password.length > 255) {
            fail(400, {
                success: false,
                target: "password",
                message: "Password must be shorter than 256 characters",
            });
        }

        if (
            typeof email !== "string" ||
            email.length < 3 ||
            email.length > 31 ||
            !/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email)
        ) {
            fail(400, {
                success: false,
                target: "email",
                message: "Invalid email",
            });
        }

        if (
            await db.select().from(users)
                .where(eq(users.username, username)).limit(1)[0]
        ) {
            fail(400, {
                success: false,
                target: "username",
                message: "Username already exists",
            });
        }

        if (
            await db.select().from(users)
                .where(eq(users.email, email)).limit(1)[0]
        ) {
            fail(400, {
                success: false,
                target: 'email',
                message: "Email already exists",
            });
        }

        const hashedPassword = await new Argon2id().hash(password);
        const userId = generateId(15);

        db.insert(users).values({
            id: userId,
            username: username,
            password: hashedPassword,
            email: email
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });

        return { success: true };
    },
    login: async ({ cookies, request }) => {
        const data = await request.formData();
        const username = data.get("username");
        const password = data.get("password");

        console.log(username, password)

        const user = await db.select().from(users).where(eq(users.username, username))[0];

        if (!user) {
            fail(400, {
                success: false,
                target: "username",
                message: "Username not found",
            })
        }

        if (!await new Argon2id().verify(user.password, password)) {
            fail(400, {
                success: false,
                target: "password",
                message: "Incorrect password",
            });
        }

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });

        return { success: true };
    }
};