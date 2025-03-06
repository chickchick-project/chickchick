import { logout, naverLogin } from "@/lib/database/action/login";

export default async function LoginTestPage() {
  return (
    <>
      <form action={naverLogin}>
        <button>naver login</button>
      </form>
      <br />
      <br />
      <form action={logout}>
        <button>logout</button>
      </form>
    </>
  );
}
