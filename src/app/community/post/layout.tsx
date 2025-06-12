import "ckeditor5/ckeditor5.css";
import "@/components/commons/ckeditor5/ckeditor5.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}
