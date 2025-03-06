import { naverLogin } from "@/lib/database/action/login";

export default function LoginTestPage() {
  return (
    <form action={naverLogin}>
      <button>naver login</button>
    </form>
  );
}
