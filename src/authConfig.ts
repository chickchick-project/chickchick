import { Account, NextAuthConfig, User } from "next-auth";
import { supabase } from "./lib/supabase/init";
import { v4 as uuidv4 } from "uuid";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  callbacks: {
    signIn: async ({ user, account }: { user: User; account: Account | null }) => {
      if (!account) return false;

      if (account?.provider === "naver") {
        const { name, email } = user;
        const { data: existingUser, error } = await supabase.from("users").select("*").eq("email", email).single();

        if (error) console.error(error.message);

        if (!existingUser) {
          const auth_id = uuidv4();
          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert([
              {
                name,
                auth_id,
                email,
                nickname: name,
              },
            ])
            .select()
            .single();

          if (insertError) {
            console.error("naver", insertError.message);
            return false;
          }

          user.id = newUser._id;
        } else {
          user.id = existingUser._id;
        }
        return true;
      }

      if (account?.provider === "google") {
        const { name, email } = user;
        const { data: existingUser, error } = await supabase.from("users").select("*").eq("email", email).single();

        if (error) console.error(error.message);

        if (!existingUser) {
          const auth_id = uuidv4();
          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert([
              {
                name,
                auth_id,
                email,
                nickname: name,
              },
            ])
            .select()
            .single();

          if (insertError) {
            console.error("google", insertError.message);
            return false;
          }

          user.id = newUser._id;
        } else {
          user.id = existingUser._id;
        }
        return true;
      }

      // TODO: kakao email 받아오는 권한 없음. 보류
      if (account?.provider === "kakao") {
        const { name, email } = user;
        const { data: existingUser, error } = await supabase.from("users").select("*").eq("email", email).single();

        if (error) console.error(error.message);

        if (!existingUser) {
          const auth_id = uuidv4();
          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert([
              {
                name,
                auth_id,
                email,
                nickname: name,
              },
            ])
            .select()
            .single();

          if (insertError) {
            console.error("kakao", insertError.message);
            return false;
          }

          user.id = newUser._id;
        } else {
          user.id = existingUser._id;
        }
        return true;
      }
      return false;
    },
  },
  providers: [
    /**
     * 초기 값 빈 배열
     */
  ],
} satisfies NextAuthConfig;
